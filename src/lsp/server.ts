/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

// import {ExtensionContext, languages, DocumentFilter, DefinitionProvider, TextDocument, Location, Position} from "vscode";
import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	DidChangeConfigurationNotification,
	Location,
	Definition,
	TextDocumentPositionParams,
	Range,
	Position
} from 'vscode-languageserver';
import { Find } from '../editor/find';
import { Path } from '../commons/path';
import { RechPosition } from '../editor/rechposition';
import { reject, isRejected } from 'q';

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();
connection.onInitialize(() => {
	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			definitionProvider: true,
		}
	};
});


connection.onInitialized(() => {
	// Register for all configuration changes.
	connection.client.register(
		DidChangeConfigurationNotification.type,
		undefined
	);
});

connection.onDefinition((params: TextDocumentPositionParams): Thenable<Location> | Thenable<undefined> | undefined => {
	let fullDocument = documents.get(params.textDocument.uri);
	if (fullDocument) {
		var path = new Path(params.textDocument.uri);
		var text = fullDocument.getText();
		var currentLine = text.split("\n")[params.position.line];
		var cobolWordRegex = /([a-zA-Z0-9_\-])+/g;
		var result: any;
		while ((result = cobolWordRegex.exec(currentLine)) !== null) {
			let start = result.index;
			let end = start + result[0].length;
			if (start <= params.position.character && params.position.character <= end) {
				let cacheFileName = "c:\\tmp\\PREPROC\\" + path.fileName();
				return new Promise<Location>((resolve, reject) => {
					new Find(text).findDeclaration(result[0], path, cacheFileName, () => {
						var files = [params.textDocument.uri, cacheFileName];
						return connection.sendRequest("custom/runPreproc", [files]);
					}).then((position: RechPosition) => {
						if (position.file) {
							resolve(createLocation(position.file, position));
						}
						else resolve(createLocation(params.textDocument.uri, position));
					}).catch(() => {
						reject();
					});
				});
			}
		}
	} else {
		return undefined;
	}
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();

/**
 * Creates a location with the specified uri and position
 * 
 * @param uri 
 * @param position 
 */
export function createLocation(uri: string, position: RechPosition) {
	let firstCharRange = Range.create(
		Position.create(position.line, position.line),
		Position.create(position.line, position.line)
	);
	let fileUri = uri.replace(/\\\\/g, "/").replace("F:", "file:///F%3A");
	return Location.create(fileUri, firstCharRange);
}


