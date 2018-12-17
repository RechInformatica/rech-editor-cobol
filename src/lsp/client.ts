import { workspace, ExtensionContext, DocumentFilter } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import { Editor } from '../editor/editor';
import * as path from 'path';
import { configure } from 'vscode/lib/testrunner';
import { File } from '../extension';
import { Process } from '../commons/Process';
import { configuration } from '../helpers/configuration';
import { cobolDiagnosticFilter } from '../cobol/diagnostic/cobolDiagnosticFilter';

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
		let serverModule = context.asAbsolutePath(
			path.join('out', 'lsp', 'server.js')
		);
		// The debug options for the server
		// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
		let debugOptions = { execArgv: ['--nolazy', '--inspect=10998'] };
		// If the extension is launched in debug mode then the debug server options are used
		// Otherwise the run options are used
		let serverOptions: ServerOptions = {
			run: { module: serverModule, transport: TransportKind.ipc },
			debug: {
				module: serverModule,
				transport: TransportKind.ipc,
				options: debugOptions
			}
		};
		// Options to control the language client
		let clientOptions: LanguageClientOptions = {
			// Register the server for COBOL documents
			documentSelector: [{ scheme: 'file', language: 'COBOL' }]
		};
		// Create the language client and start the client.
		Client.client = new LanguageClient(
			'languageServerExample',
			'Language Server Example',
			serverOptions,
			clientOptions
		);
		// Start the client. This will also launch the server
		Client.client.start();
		Client.client.onReady().then(() => {
			Client.configureClientWhenReady();
		});
	}

	/**
	 * Configures the LSP client when it's ready for execution
	 */
	private static configureClientWhenReady() {
		if (Client.client) {
			Client.client.onRequest("custom/runPreprocExpander", (files: string[]) => {
				return Client.createPreprocExpanderExecutionPromise(files);
			});
			Client.client.onRequest("custom/runPreprocessor", (files: string[]) => {
				return Client.createPreprocessorExecutionPromise(files);
			});
			Client.client.onRequest("custom/getConfig", (section: string) => {
				return Client.getConfig(section);
			});
			Client.client.onRequest("custom/diagnosticFilter", (diagnosticMessage: string) => {
				return new Promise<Boolean>((resolve) => {
					let result = cobolDiagnosticFilter.isDiagnosticValid(diagnosticMessage);
					resolve(result);
				})
			});
		}
	}

	/**
	 * Creates a promise for Cobol Preprocessor expander execution
	 *
	 * @param files file array with necessary files
	 */
	private static createPreprocExpanderExecutionPromise(files: string[]) {
		return new Promise<string>((resolve, reject) => {
			let currentFile = files[0];
			let cacheFile = files[1];
			let executor = Editor.getSourceExpander();
			if (executor) {
				executor.setPath(currentFile).exec(cacheFile).then(() => {
					resolve();
				}).catch(() => {
					reject();
				});
			} else {
				reject();
			}
		});
	}

	/**
	 * Creates a promise for Cobol Preprocessor execution
	 *
	 * @param files file array with necessary files
	 */
	private static createPreprocessorExecutionPromise(files: string[]): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			let currentFile = files[0];
			let executor = Editor.getPreprocessor();
			if (executor) {
				executor.setPath(currentFile).exec().then((process) => {
					resolve(process.getStdout());
				}).catch(() => {
					reject();
				});
			} else {
				reject();
			}
		});
	}

	/**
	 * Returns specific setting
	 *
	 * @param section
	 */
	private static getConfig(section: string, defaultValue?: any): Promise<any> {
		return new Promise<any>((resolve) => {
			resolve(configuration.get(section, defaultValue));
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

}
