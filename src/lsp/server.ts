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

connection.onDefinition((params: TextDocumentPositionParams): Thenable<Definition> | undefined => {
	let fullDocument = documents.get(params.textDocument.uri);
	if (fullDocument) {
		var path = new Path(params.textDocument.uri);
		var text = fullDocument.getText();

		var currentLine = text.split("\n")[params.position.line];
        var cobolWordRegex = /([a-zA-Z0-9_\-])+/g;

		let result;
		while ((result = cobolWordRegex.exec(currentLine)) !== null) {
			let start = result.index;
			let end = start + result[0].length;
			if (start <= params.position.character && params.position.character <= end) {
				return new Find(text).findDeclaration(result[0], path).then((position: RechPosition) => {
					if (position.file) {
						return createLocation(position.file, position);
					}
					return createLocation(params.textDocument.uri, position);
				});
			}
		}






		// var beforeCursor = currentLine.substring(0, params.position.character).match(/([a-zA-Z0-9_\-])+/g);
		// var afterCursor = currentLine.substring(params.position.character).match(/([a-zA-Z0-9_\-])+/g);
		// if (allCursor && beforeCursor && afterCursor) {
		// 	var currentWord = beforeCursor[beforeCursor.length - 1] + afterCursor[0];
		// 	return new Find(text).findDeclaration(currentWord, path).then((position: RechPosition) => {
		// 		return createLocation(params.textDocument.uri, position);
		// 	});
		// }
		return undefined;
	} else {
		return undefined;
	}
});


// // The content of a text document has changed. This event is emitted
// // when the text document first opened or when its content has changed.
// documents.onDidChangeContent(change => {
// 	validateTextDocument(change.document);
// });

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
	return Location.create(uri, firstCharRange);
}


