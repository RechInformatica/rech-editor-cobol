import { workspace, ExtensionContext, DefinitionProvider, TextDocument, Location, Position, languages, DocumentFilter } from 'vscode';
import * as path from 'path';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

const COBOL_MODE: DocumentFilter = { language: 'COBOL', scheme: 'file' };
/**
 * Language Server Provider client
 */
export default class Client {

	private client: LanguageClient | undefined;

	/**
     * Starts the LSP server and establishes communication between them
     */
	startServerAndEstablishCommunication(context: ExtensionContext) {
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
		this.client = new LanguageClient(
			'languageServerExample',
			'Language Server Example',
			serverOptions,
			clientOptions
		);

		// Start the client. This will also launch the server
		this.client.start();
	}

	/**
	 * 
	 */
	stopClient() {
		if (!this.client) {
			return undefined;
		}
		return this.client.stop();
	}

}
