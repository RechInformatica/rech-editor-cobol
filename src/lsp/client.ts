import { workspace, ExtensionContext, DocumentFilter } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient';
import { Editor } from '../editor/editor';
import * as path from 'path';
import { configure } from 'vscode/lib/testrunner';

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
			// Register the server for plain text documents
			documentSelector: [{ scheme: 'file', language: 'COBOL' }],
			synchronize: {
				// Notify the server about file changes to '.clientrc files contained in the workspace
				fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
			}
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
			Client.client.onRequest("custom/runPreproc", (files: string[]) => {
				return Client.createPreprocExecutionPromise(files);
			});
		}
	}

	/**
	 * Creates a promise for Cobol Preprocessor execution
	 * 
	 * @param files file array with necessary files 
	 */
	private static createPreprocExecutionPromise(files: string[]) {
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
	 * Stops the LSP client if it has ben previously started
	 */
	public static stopClient() {
		if (!Client.client) {
			return undefined;
		}
		return Client.client.stop();
	}

}
