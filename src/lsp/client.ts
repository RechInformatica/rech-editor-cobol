import { commands, ExtensionContext, window, workspace } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, StreamInfo, TransportKind } from 'vscode-languageclient/node';
import { Editor } from '../editor/editor';
import * as path from 'path';
import * as cp from 'child_process';
import { PassThrough } from 'stream';
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

/**
 * Language Server Provider client
 */
export class Client {

	/** Cliente Node.js, o qual provê todos os recursos de linguagem (completion, definition, etc.) */
	private static client: LanguageClient | undefined;
	/** Cliente Java, o qual é exclusivo para diagnósticos do pré-processador */
	private static javaClient: LanguageClient | undefined;

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
		const internalConfig = workspace.getConfiguration("rech.editor.internal");
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
		Client.client.start().then(() => {
			Client.configureClientWhenReady(useJava);
			dj.defineSourceExpander();
			dj.definePreprocessor();
			dj.defineDianosticConfigs();
			dj.defineCopyHierarchyFunction();
			dj.defineElementPropertiesExtractor();
			dj.defineSpecialClassPullerFunction();
			dj.defineCopyUsageLocatorFunction();
			dj.defineExternalMethodCompletionFunction();
		}).catch();

		// Servidor Java — opcional, exclusivamente diagnósticos
		if (useJava) {
			const defaultPreprocOptions = ["-cpn", "-spn", "-msi", "-vnp", "-war", "-wes", "-cem", "-wop=ALL"];
			// Inclui as pastas abertas na workspace na resolução de COPYs, antes do configurado —
			// cobre o caso comum de o usuário ter a working-copy aberta como pasta da workspace.
			const workspaceCopyDirs = (workspace.workspaceFolders ?? []).map(folder => folder.uri.fsPath);
			const configuredCopyDirs = config.get<string[]>("cobolLsp.copyDirs", []);
			const copyDirs = [...workspaceCopyDirs, ...configuredCopyDirs];
			Client.javaClient = new LanguageClient(
				'cobolJavaLsp',
				'Cobol LSP (diagnósticos)',
				Client.buildJavaServerOptions(classPath),
				{
					documentSelector: [{ scheme: 'file', language: 'COBOL' }],
					initializationOptions: {
						cobol: {
							copyDirs: copyDirs,
							preprocessorOptions: config.get<string[]>("cobolLsp.preprocessorOptions", defaultPreprocOptions),
							// Repassa os filtros do rech-editor-internal para o servidor Java
							noShowWarnings: internalConfig.get<string[]>("diagnosticfilter", []),
							deprecatedWarning: internalConfig.get<string[]>("deprecatedWarning", [])
						}
					}
				}
			);
			Client.javaClient.start().then(() => {
				Client.configureJavaClientWhenReady();
			}).catch();

		}
	}

    /**
     * Configura o cliente Java quando pronto.
     * Registra o handler custom/showQuickPick para exibir picklist ao usuário
     * quando o servidor Java solicita seleção de métodos a implementar (W190).
     */
    private static configureJavaClientWhenReady() {
        if (!Client.javaClient) return;
        Client.javaClient.onRequest("custom/showQuickPick", async (params: { titulo: string, itens: string[], multipla: boolean }) => {
            const items = params.itens.map(item => ({ label: item, picked: true }));
            const resultado = await window.showQuickPick(items, {
                title: params.titulo,
                canPickMany: params.multipla,
                placeHolder: "Selecione os métodos a implementar"
            });
            if (!resultado) return [];
            if (Array.isArray(resultado)) {
                return resultado.map((i: { label: string }) => i.label);
            }
            return [(resultado as { label: string }).label];
        });
    }

	/**
	 * Monta as ServerOptions para o servidor Java via stdio.
	 * Usa -cp <classPath> <mainClass> --lsp.
	 * jvmArgs é inserido antes do -cp, permitindo flags como -agentlib (debug remoto).
	 */
	private static buildJavaServerOptions(classPath: string): ServerOptions {
		const config = workspace.getConfiguration("rech.editor.cobol");
		const javaPath = config.get<string>("cobolLsp.javaPath", "java");
		const jvmArgs = config.get<string[]>("cobolLsp.jvmArgs", []);
		const mainClass = config.get<string>("cobolLsp.mainClass",
			"br.com.rech.preproc.lsp.Main");

		return (): Promise<StreamInfo> => new Promise<StreamInfo>((resolve, reject) => {
			const args = [...jvmArgs, '-cp', classPath, mainClass, '--lsp'];
			const proc = cp.spawn(javaPath, args, {
				stdio: ['pipe', 'pipe', 'pipe']
			});
			proc.on('error', (err) => reject(err));

			// Drena stderr para evitar backpressure (logs Java vão para stderr)
			proc.stderr?.resume();

			// Filtra saída pré-LSP (ex: mensagem de startup do JDWP) do stdout.
			// Descarta tudo até encontrar "Content-Length:", que é o início do protocolo LSP.
			const lspStream = new PassThrough();
			let buffered = Buffer.alloc(0);
			let forwarding = false;

			proc.stdout!.on('data', (chunk: Buffer) => {
				if (forwarding) {
					lspStream.write(chunk);
					return;
				}
				buffered = Buffer.concat([buffered, chunk]);
				const idx = buffered.indexOf('Content-Length:');
				if (idx >= 0) {
					forwarding = true;
					lspStream.write(buffered.slice(idx));
					buffered = Buffer.alloc(0);
				}
			});
			proc.stdout!.on('end', () => lspStream.end());
			proc.stdout!.on('error', (e) => lspStream.destroy(e));

			resolve({ reader: lspStream, writer: proc.stdin! });
		});
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
	 * Quando {@code javaActive} é true, custom/getAutoDiagnostic retorna false para
	 * suprimir os diagnósticos do servidor Node.js (evita duplicação com o Java LSP).
	 */
	private static configureClientWhenReady(javaActive: boolean = false) {
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
				if (javaActive) {
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
		if (Client.client) stops.push(Client.client.stop());
		if (Client.javaClient) stops.push(Client.javaClient.stop());
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
