/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	DidChangeConfigurationNotification,
	Location,
	TextDocumentPositionParams,
	Range,
	Position
} from 'vscode-languageserver';
import { Find } from '../editor/find';
import { Path } from '../commons/path';
import { RechPosition } from '../editor/rechposition';
import { CobolWordFinder } from '../commons/CobolWordFinder';

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
		let text = fullDocument.getText();
		let word = getLineText(text, params.position.line, params.position.character);
		return createPromiseForWordDeclaration(text, word, params.textDocument.uri);
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
 * Returns the specified line within the document text
 * 
 * @param documentText document text
 * @param line line
 * @param column column
 */
export function getLineText(documentText: string, line: number, column: number) {
	var currentLine = documentText.split("\n")[line];
	return new CobolWordFinder().findWordAt(currentLine, column);
}

/**
 * Creates a promise to find the specified word declaration
 * 
 * @param documentFullText full text of the current document
 * @param word the target word which declaration will be searched
 * @param uri URI of the current file open in editor
 */
export function createPromiseForWordDeclaration(documentFullText: string, word: string, uri: string, ) {
	// Creates an external promise so the reject function can be called when no definition
	// is found for the specified word
	return new Promise<Location>((resolve, reject) => {
		// Cache filename where the declaration is searched before
		// invoking Cobol preprocessor
		let cacheFileName = buildCacheFileName(uri);
		// Creates a promise to find the word declaration
		new Find(documentFullText).findDeclaration(word, new Path(uri), cacheFileName, () => {
			// Runs Cobol preprocessor on client-side
			return sendExternalPreprocExecution(uri, cacheFileName);
		}).then((position: RechPosition) => {
			// If the delcaration was found on an external file
			if (position.file) {
				// Retrieves the location on the external file
				resolve(createLocation(position.file, position));
			} else {
				// Retrieves the location on the current file
				resolve(createLocation(uri, position));
			}
		}).catch(() => {
			reject();
		});
	});
}

/**
 * Builds Cobol preprocessor cache filename
 *  
 * @param uri current URI of the file open in editor
 */
export function buildCacheFileName(uri: string) {
	var path = new Path(uri);
	return "c:\\tmp\\PREPROC\\" + path.fileName();
}

/**
 * Sends a request to the client for Cobol preprocessor execution
 * 
 * @param uri current URI of the file open in editor
 * @param cacheFileName Cache filename where the declaration is searched before
 * invoking Cobol preprocessor
 */
export function sendExternalPreprocExecution(uri: string, cacheFileName: string) {
	var files = [uri, cacheFileName];
	return connection.sendRequest("custom/runPreproc", [files]);
}

/**
 * Creates a location with the specified uri and position
 * 
 * @param uri 
 * @param position 
 */
export function createLocation(uri: string, position: RechPosition) {
	let firstCharRange = Range.create(
		Position.create(position.line, position.column),
		Position.create(position.line, position.column)
	);
	let fileUri = uri.replace(/\\\\/g, "/").replace("F:", "file:///F%3A");
	return Location.create(fileUri, firstCharRange);
}


