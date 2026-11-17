import { commands, ExtensionContext, window, workspace } from 'vscode';
import { LanguageClient, ServerOptions, TransportKind } from 'vscode-languageclient/node';
import { Editor } from '../editor/editor';
import * as path from 'path';
import { configuration } from '../helpers/configuration';
import { cobolDiagnosticFilter } from '../cobol/diagnostic/cobolDiagnosticFilter';
import { SourceExpander } from '../editor/SourceExpander';
import { SourceOfCompletions } from './commons/SourceOfCompletions';
import { RechPosition } from '../commons/rechposition';
import { Log } from '../commons/Log';
import { FoldStatusBar } from './fold/FoldStatusBar';
import { ExpandedSourceStatusBar } from '../cobol/ExpandedSourceStatusBar';
import * as dj from '../dependencieInjection';
import { CopyUsageLocator } from './completion/copy/CopyUsageLocator';
import { ExpandedSourceCacheStatusBar } from '../cobol/ExpandedSourceCacheStatusBar';
import { JavaLspManager } from './JavaLspManager';

/**
 * Language Server Provider client
 */
export class Client {

	/** Cliente Node.js, o qual provê todos os recursos de linguagem (completion, definition, etc.) */
	private static client: LanguageClient | undefined;
	private static javaManager: JavaLspManager | undefined;
	private static nodeStart: Promise<void> | undefined;

	/**
	 * Starts the LSP server and establishes communication between them.
	 *
	 * Arquitetura dual-server (v1.0):
	 *   - Servidor Node.js: sempre ativo e provê completion, definition, folding, rename, etc.
	 *   - Servidor Java (opcional): exclusivo para diagnósticos do pré-processador.
	 *     Quando ativo, suprime os diagnósticos do Node.js via custom/getAutoDiagnostic → false.
	 */
	public static startServerAndEstablishCommunication(context: ExtensionContext) {
		const config = workspace.getConfiguration("rech.editor.cobol");
		const javaLspEnabled = config.get<boolean>("cobolLsp.enabled", false);
		const classPath = config.get<string>("cobolLsp.classPath", "");
		const useJava = javaLspEnabled && !!classPath;

		// Servidor Node.js — sempre ativo, todos os recursos de linguagem
		Client.client = new LanguageClient(
			'cobolLanguageServer',
			'Cobol Language Server',
			Client.buildNodeServerOptions(context),
			{ documentSelector: [{ scheme: 'file', language: 'COBOL' }] }
		);
		Client.nodeStart = Client.client.start();
		Client.nodeStart.then(() => {
			Client.configureClientWhenReady();
			dj.defineSourceExpander();
			dj.definePreprocessor();
			dj.defineDianosticConfigs();
			dj.defineCopyHierarchyFunction();
			dj.defineElementPropertiesExtractor();
			dj.defineSpecialClassPullerFunction();
			dj.defineCopyUsageLocatorFunction();
			dj.defineExternalMethodCompletionFunction();
		}).catch((error) => {
			Log.get().error("Falha ao iniciar o Cobol Language Server: " + error);
		});

		// Servidor Java — opcional, exclusivamente diagnósticos
		if (useJava) {
			Client.javaManager = new JavaLspManager(
				() => Client.clearNodeDiagnostics(),
				() => Client.requestNodeRevalidation()
			);
			Client.javaManager.initialize(context);
		} else {
			Client.javaManager = undefined;
		}
	}

	private static requestNodeRevalidation() {
		void Client.requestNodeNotification('custom/revalidateOpenDocuments');
	}

	private static clearNodeDiagnostics(): Promise<void> {
		return Client.requestNodeNotification('custom/clearDiagnostics');
	}

	private static requestNodeNotification(method: string): Promise<void> {
		const nodeClient = Client.client;
		const nodeStart = Client.nodeStart;
		if (!nodeClient || !nodeStart) return Promise.resolve();
		return nodeStart.then(() => {
			if (Client.client !== nodeClient) return;
			return nodeClient.sendNotification(method);
		}).catch(error => {
			Log.get().error("Falha ao solicitar notificação ao Cobol Language Server: " + error);
		});
	}

	private static javaOwnsDiagnostics(): boolean {
		return Client.javaManager?.ownsDiagnostics() ?? false;
	}

	/**
	 * Monta as ServerOptions para o servidor Node.js original via IPC
	 */
	private static buildNodeServerOptions(context: ExtensionContext): ServerOptions {
		const serverModule = context.asAbsolutePath(path.join('out', 'lsp', 'server.js'));
		const debugOptions = { execArgv: ['--nolazy', '--inspect=11000'] };
		return {
			run: { module: serverModule, transport: TransportKind.ipc },
			debug: {
				module: serverModule,
				transport: TransportKind.ipc,
				options: debugOptions
			}
		};
	}

	/**
	 * Configures the LSP client when it's ready for execution.
	 * Enquanto o Java está ativo ou em transição, custom/getAutoDiagnostic retorna false
	 * para evitar duplicação com o Java LSP.
	 */
	private static configureClientWhenReady() {
		if (Client.client) {
			Client.client.onRequest("custom/runExternalMethodCompletion", (params: any) => {
				return new Promise<any>((resolve, reject) => {
					Log.get().info("ExternalMethodCompletion was called in client side");
					Client.createExternalMethodCompletionPromise(params).then((result) => resolve(result)).catch((e) => reject(e));
				});
			});
			Client.client.onRequest("custom/runPreprocExpander", (files: string[]) => {
				return new Promise<any>((resolve, reject) => {
					Log.get().info("PreprocExpander was called in client side. Files: " + files);
					new SourceExpander().createExpanderExecutionPromise(files).then((result) => {
						return resolve(result)
					}).catch((e) => {
						return reject(e);
					});
				});
			});
			Client.client.onRequest("custom/runPreprocessor", (files: string[]) => {
				return new Promise<any>((resolve, reject) => {
					Log.get().info("Preprocessor was called in client side. Files" + files);
					Client.createPreprocessorExecutionPromise(files).then((result) => {
						return resolve(result)
					}).catch((e) => {
						return reject(e);
					});
				});
			});
			Client.client.onRequest("custom/runCopyHierarchy", (uri: string) => {
				return new Promise<any>((resolve, reject) => {
					Log.get().info("CopyHierarchy was called in client side. Uri: " + uri);
					Client.createCopyHierarchyPromise(uri).then((result) => {
						return resolve(result);
					}).catch((e) => {
						return reject(e);
					});
				});
			});
			Client.client.onRequest("custom/getConfig", (section: string) => {
				return new Promise<any>((resolve, reject) => {
					Client.getConfig(section).then((result) => {
						return resolve(result);
					}).catch((e) => {
						return reject(e);
					})
				})
			});
			Client.client.onRequest("custom/getAutoDiagnostic", () => {
				if (Client.javaOwnsDiagnostics()) {
					// Java LSP cuida dos diagnósticos; Node.js não deve duplicá-los
					return Promise.resolve(false);
				}
				return new Promise<any>((resolve, reject) => {
					const result = cobolDiagnosticFilter.getAutoDiagnostic();
					if (result !== undefined) {
						return resolve(result);
					} else {
						return reject();
					}
				});
			});
			Client.client.onRequest("custom/diagnosticFilter", (diagnosticMessage: string) => {
				return new Promise<boolean>((resolve, reject) => {
					const result = cobolDiagnosticFilter.isDiagnosticValid(diagnosticMessage);
					if (result !== undefined) {
						return resolve(result);
					} else {
						return reject();
					}
				})
			});
			Client.client.onRequest("custom/deprecatedWarning", (diagnosticMessage: string) => {
				return new Promise<boolean>((resolve, reject) => {
					const result = cobolDiagnosticFilter.isDeprecatedWarning(diagnosticMessage);
					if (result !== undefined) {
						return resolve(result);
					} else {
						return reject(false);
					}
				})
			});
			Client.client.onRequest("custom/sourceOfParagraphCompletions", () => {
				return new Promise<string>((resolve, reject) => {
					const activeEditor = window.activeTextEditor;
					if (activeEditor) {
						const document = activeEditor.document;
						const result = SourceOfCompletions.getSourceOfParagraphCompletions(document.fileName);
						if (result !== undefined) {
							return resolve(result);
						} else {
							return reject();
						}
					}
					return reject();
				})
			});
			Client.client.onRequest("custom/specialClassPuller", (uri: string) => {
				return new Promise<string>((resolve, reject) => {
					Client.createSpecialClassPullerPromise(uri).then((result) => {
						return resolve(result);
					}).catch((e) => {
						return reject(e);
					});
				})
			});
			Client.client.onRequest("custom/copyUsageLocator", (copy: string) => {
				return new Promise<string[]>((resolve, reject) => {
					Client.createCopyUsageLocatorExecutionPromise(copy).then((result) => {
						return resolve(result);
					}).catch((e) => {
						return reject(e);
					});
				})
			});
			Client.client.onRequest("custom/showFoldinStatusBar", (file?: string) => {
				FoldStatusBar.show(file);
			});
			Client.client.onRequest("custom/hideFoldinStatusBar", () => {
				FoldStatusBar.hide();
			});
			Client.client.onRequest("custom/showStatusBarFromSourceExpander", (file?: string) => {
				ExpandedSourceStatusBar.show(file);
			});
			Client.client.onRequest("custom/hideStatusBarFromSourceExpander", () => {
				ExpandedSourceStatusBar.hide();
			});
			Client.client.onRequest("custom/showStatusBarFromSourceExpanderCache", (file?: string) => {
				ExpandedSourceCacheStatusBar.show(file);
			});
			Client.client.onRequest("custom/hideStatusBarFromSourceExpanderCache", () => {
				ExpandedSourceCacheStatusBar.hide();
			});
			Client.client.onRequest("custom/sourceOfVariableCompletions", () => {
				return new Promise<string>((resolve, reject) => {
					const activeEditor = window.activeTextEditor;
					if (activeEditor) {
						const document = activeEditor.document;
						const result = SourceOfCompletions.getSourceOfVariableCompletions(document.fileName);
						if (result !== undefined) {
							return resolve(result);
						} else {
							return reject();
						}
					}
					return reject();
				})
			});
			if (Editor.getSourceExpander()) {
				const activeEditor = window.activeTextEditor;
				if (activeEditor) {
					const document = activeEditor.document;
					SourceOfCompletions.show(document.fileName);
				}
			}
		}
	}

	/**
	 * Creates a promise for Cobol Preprocessor execution
	 *
	 * @param files file array with necessary files
	 */
	private static createExternalMethodCompletionPromise(param: any): Promise<any> {
		return new Promise<string>((resolve, reject) => {
			const command = Editor.getExternalMethodCompletion();
			if (command) {
				commands.executeCommand(command, param).then((result) => {
					return resolve(<string>result);
				}, ((err) => {
					return reject(err);
				}));
			} else {
				return reject("ExternalMethodCompletion is not defined");
			}
		});
	}

	/**
	 * Creates a promise for copy usage locator execution
	 *
	 * @param copy Copy file to find uses
	 */
	private static createCopyUsageLocatorExecutionPromise(copy: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			CopyUsageLocator.findUsage(copy).then((result) => {
				return resolve(result);
			}).catch((e) => {
				return reject(e);
			});
		});
	}

	/**
	 * Creates a promise for Cobol Preprocessor execution
	 *
	 * @param files file array with necessary files
	 */
	private static createPreprocessorExecutionPromise(files: string[]): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const currentFile = files[0];
			const extraCopyDirectory = files[1];
			const executor = Editor.getPreprocessor();
			if (executor) {
				const extraParams = new Map<string, string[]>();
				extraParams.set("dc", [extraCopyDirectory])
				executor.setPath(currentFile).setExtraParams(extraParams).exec().then((output) => {
					return resolve(output);
				}).catch((e) => {
					return reject(e);
				});
			} else {
				return reject("No Preprocessor avaliable");
			}
		});
	}

	/**
	 * Creates a promise for Cobol Preprocessor execution
	 *
	 * @param files file array with necessary files
	 */
	private static createCopyHierarchyPromise(uri: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const executor = Editor.getCopyHierarchy();
			if (executor) {
				executor.setPath(uri).exec().then((buffer) => {
					return resolve(buffer);
				}).catch((e) => {
					return reject(e);
				});
			} else {
				return reject("No CopyHierarchy avaliable");
			}
		});
	}

	/**
	 * Creates a promise for return the avaliable class
	 */
	private static createSpecialClassPullerPromise(uri: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const executor = Editor.getSpecialClassPuller();
			if (executor) {
				executor.setPath(uri).exec().then((classes: string) => {
					return resolve(classes);
				}).catch((e) => {
					return reject(e);
				});
			} else {
				return reject("No SpecialClassPuller avaliable");
			}
		});
	}

	/**
	 * Returns specific setting
	 *
	 * @param section
	 */
	private static getConfig(section: string, defaultValue?: any): Promise<any> {
		return new Promise<any>((resolve, reject) => {
			const result = configuration.get(section, defaultValue);
			if (result != undefined) {
				return resolve(result);
			} else {
				return reject();
			}
		});
	}


	/**
	 * Stops the LSP client if it has ben previously started
	 */
	public static stopClient() {
		const stops: Promise<void>[] = [];
		if (Client.javaManager) stops.push(Client.javaManager.stop());
		if (Client.client) {
			const nodeClient = Client.client;
			stops.push((async () => {
				try {
					if (Client.nodeStart) await Client.nodeStart;
				} catch (error) {
					Log.get().error("Falha ao iniciar o Cobol Language Server durante a desativação: " + error);
				}
				if (nodeClient.isRunning()) await nodeClient.stop();
			})());
		}
		return stops.length > 0 ? Promise.all(stops) : undefined;
	}

	/**
	 * Request the server and return the RechPosition of word declaration
	 */
	public static getDeclararion(word: string, referenceLine: number, referenceColumn: number, fullDocument: string, uri: string): Promise<RechPosition> {
		return new Promise((resolve, reject) => {
			if (Client.client) {
				const params = [word, referenceLine, referenceColumn, fullDocument, uri];
				return Client.client.sendRequest<RechPosition | undefined>("custom/findDeclarationPosition", params).then((position: any) => {
					if (position) {
						return resolve(position);
					} else {
						return reject();
					}
				})
			} else {
				return reject();
			}
		});
	}

}
