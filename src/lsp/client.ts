import { commands, ExtensionContext } from 'vscode';
import { LanguageClient, LanguageClientOptions, ResponseError, ServerOptions, TransportKind } from 'vscode-languageclient';
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
import { isArray } from 'util';
import { CopyUsageLocator } from './completion/copy/CopyUsageLocator';
import { ExpandedSourceCacheStatusBar } from '../cobol/ExpandedSourceCacheStatusBar';

/**
 * Language Server Provider client
 */
export class Client {

	/** Client instance of the Language Server Provider (LSP) */
	private static client: LanguageClient | undefined;

	/**
     * Starts the LSP server and establishes communication between them
     */
	public static startServerAndEstablishCommunication(context: ExtensionContext) {
		// The server is implemented in node
		const serverModule = context.asAbsolutePath(
			path.join('out', 'lsp', 'server.js')
		);
		// The debug options for the server
		// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
		const debugOptions = { execArgv: ['--nolazy', '--inspect=11000'] };
		// If the extension is launched in debug mode then the debug server options are used
		// Otherwise the run options are used
		const serverOptions: ServerOptions = {
			run: { module: serverModule, transport: TransportKind.ipc },
			debug: {
				module: serverModule,
				transport: TransportKind.ipc,
				options: debugOptions
			}
		};
		// Options to control the language client
		const clientOptions: LanguageClientOptions = {
			// Register the server for COBOL documents
			documentSelector: [{ scheme: 'file', language: 'COBOL' }]
		};
		// Create the language client and start the client.
		Client.client = new LanguageClient(
			'cobolLanguageServer',
			'Cobol Language Server',
			serverOptions,
			clientOptions
		);
		// Start the client. This will also launch the server
		Client.client.start();
		Client.client.onReady().then(() => {
			Client.configureClientWhenReady();
			// Injects the dependencies
			dj.defineSourceExpander();
			dj.definePreprocessor();
			dj.defineDianosticConfigs();
			dj.defineCopyHierarchyFunction();
			dj.defineSpecialClassPullerFunction();
			dj.defineCopyUsageLocatorFunction();
			dj.defineExternalMethodCompletionFunction();
		}).catch();
	}

	/**
	 * Configures the LSP client when it's ready for execution
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
				return new Promise<Boolean>((resolve, reject) => {
					const result = cobolDiagnosticFilter.isDiagnosticValid(diagnosticMessage);
					if (result !== undefined) {
						return resolve(result);
					} else {
						return reject();
					}
				})
			});
			Client.client.onRequest("custom/deprecatedWarning", (diagnosticMessage: string) => {
				return new Promise<Boolean>((resolve, reject) => {
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
					const result = SourceOfCompletions.getSourceOfParagraphCompletions();
					if (result !== undefined) {
						return resolve(result);
					} else {
						return reject();
					}
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
					const result = SourceOfCompletions.getSourceOfVariableCompletions();
					if (result !== undefined) {
						return resolve(result);
					} else {
						return reject();
					}
				})
			});
			if (Editor.getSourceExpander()) {
				SourceOfCompletions.show();
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
					return resolve(<string> result);
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
				executor.setPath(currentFile).setExtraParams([extraCopyDirectory]).exec().then((output) => {
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
			if (result) {
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
		if (!Client.client) {
			return undefined;
		}
		return Client.client.stop();
	}

	/**
	 * Request the server and return the RechPosition of word declaration
	 */
	public static getDeclararion(word: string, referenceLine: number, referenceColumn: number, fullDocument: string, uri: string): Promise<RechPosition> {
		return new Promise((resolve, reject) => {
			if (Client.client) {
				const params = [word, referenceLine, referenceColumn, fullDocument, uri];
				return Client.client.sendRequest<RechPosition | undefined>("custom/findDeclarationPosition", params).then((position) => {
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
