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
	InitializeParams,
	TextDocumentPositionParams,
	Range,
	Position,
	CompletionItem,
	CompletionItemKind,
	InsertTextFormat,
	TextDocument,
	DocumentOnTypeFormattingParams
} from 'vscode-languageserver';
import { Find } from '../editor/Find';
import { Path } from '../commons/path';
import { RechPosition } from '../editor/rechposition';
import { CobolWordFinder } from '../commons/CobolWordFinder';
import { ParserCobol } from '../cobol/parsercobol';
import { ParagraphCompletion } from './ParagraphCompletion';
import { Diagnostician } from '../cobol/diagnostic/diagnostician';
import { CobolFormatter } from './CobolFormatter';
import { CompletionUtils } from './CompletionUtils';

// Cobol column for 'PIC' clause declaration
const PIC_COLUMN_DECLARATION = 35;

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

let hasDiagnosticRelatedInformationCapability: boolean | undefined = false;
let documents: TextDocuments = new TextDocuments();
connection.onInitialize((params: InitializeParams) => {
	let capabilities = params.capabilities;
	hasDiagnosticRelatedInformationCapability =
		capabilities.textDocument &&
		capabilities.textDocument.publishDiagnostics &&
		capabilities.textDocument.publishDiagnostics.relatedInformation;
	return {
		capabilities: {
			textDocumentSync: documents.syncKind,
			definitionProvider: true,
			// Tell the client that the server supports code completion
			completionProvider: {
				resolveProvider: true
			},
			documentOnTypeFormattingProvider: {
				firstTriggerCharacter: "\n"
			}
		}
	};
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});
// If the document closed
documents.onDidClose((textDocument) => {
	//Clear the computed diagnostics to VSCode.
	connection.sendDiagnostics({ uri: textDocument.document.uri, diagnostics: []});
});

/**
 * Create diagnostics for all errors or warnings
 * 
 * @param textDocument
 */
export async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  getConfig<Boolean>("autodiagnostic").then(autodiagnostic => {
    if (autodiagnostic) {
      new Diagnostician().diagnose(
          textDocument,
          fileName => {
            return sendExternalPreprocessExecution(fileName);
          },
          message => {
            return externalDiagnosticFilter(message);
          }
        ).then(diagnostics => {
          //Send the computed diagnostics to VSCode.
		  connection.sendDiagnostics({uri: textDocument.uri, diagnostics: diagnostics});
		  
        });
    }
  });
}

/**
 * Sends a request to the client for Cobol preprocessor execution
 *
 * @param uri current URI of the file open in editor
 */
export function sendExternalPreprocessExecution(uri: string) {
	var files = [uri];
	return connection.sendRequest<string>("custom/runPreprocessor", [files]);
}

/**
 * Sends a request to the client for get a specific setting
 *
 * @param section
 */
export function getConfig<T>(section: string) {
	return connection.sendRequest<T>("custom/configPreproc", section);
}

/**
 * Sends a request to the client for get a specific setting
 *
 * @param section
 */
export function externalDiagnosticFilter(diagnosticMessage: string) {
	return connection.sendRequest<boolean>("custom/diagnosticFilter", diagnosticMessage);
}

// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
	let items: CompletionItem[] = [];
	let line = _textDocumentPosition.position.line;
	let fullDocument = documents.get(_textDocumentPosition.textDocument.uri);
	if (fullDocument) {
		switch (true) {
			case isCommentLine(line, fullDocument): {
				break;
			}
			case isVarDeclaration(line, fullDocument): {
				items.push(createVarDeclarationItem(_textDocumentPosition));
				break;
			}
			case isParagraphPerform(line, fullDocument): {
				fillItemsWithParagraphs(items, fullDocument);
				break;
			}
			default: {
				items.push(createPerformSnippet(_textDocumentPosition));
				break;
			}
		}
	}
	return items;
});

/**
 * Returns true if the curson is on a comment line
 * 
 * @param line current line number
 * @param fullDocument full document
 */
export function isCommentLine(line: number, fullDocument: TextDocument) {
	let fullDocumentText = fullDocument.getText();
	let currentLine = fullDocumentText.split("\n")[line];
	if (currentLine.trim().startsWith("*>")) {
		return true;
	}
	return false;
}

/**
 * Returns true if the editor should suggest Cobol variable declaration
 */
export function isVarDeclaration(line: number, fullDocument: TextDocument): boolean {
	let fullDocumentText = fullDocument.getText();
	let currentLine = fullDocumentText.split("\n")[line];
	if (new ParserCobol().getDeclaracaoVariavel(currentLine)) {
		return isVariableLevelAndNameDeclared(currentLine);
	}
	return false;
}

/**
 * Returns true if the current line represents a paragraph perform
 */
export function isParagraphPerform(line: number, fullDocument: TextDocument): boolean {
	let fullDocumentText = fullDocument.getText();
	let currentLine = fullDocumentText.split("\n")[line];
	if (/\s+PERFORM.*/.exec(currentLine)) {
		return true;
	}
	return false;
}

/**
 * Fills the completion items with Cobol paragraphs
 *
 * @param items items array
 * @param fullDocument full document information
 */
export function fillItemsWithParagraphs(items: CompletionItem[], fullDocument: TextDocument) {
	let paragraphCompletion = new ParagraphCompletion();
	let lines = fullDocument.getText().split("\r\n");
	paragraphCompletion.generateCompletionItems(lines).forEach(element => {
		items.push(element);
	});
}

/**
 * Document formatter
 */
connection.onDocumentOnTypeFormatting((params: DocumentOnTypeFormattingParams) => {
	let lineNumber = params.position.line;
	let fullDocument = documents.get(params.textDocument.uri);
	if (fullDocument) {
		let lines = fullDocument.getText().split("\r\n");
		return new CobolFormatter().formatWhenKeyIsPressed(lines, lineNumber);
	}
	return [];
});

/**
 * Returns true if the level and the name of the Cobol variable are declared.
 *
 * This regular expression checks if the variable is ready to receive the 'PIC'
 * and 'VALUE IS' clauses.
 *
 * @param line target line to test variable declaration
 */
export function isVariableLevelAndNameDeclared(line: string) {
	let result = /(\d+\w.+\s)([^\s].*)/.exec(line);
	if (result && result[2]) {
		return true;
	}
	return false;
}

/**
 * Creates an IntelliSense entry to generate code-completion for variable declaration
 *
 * @param _textDocumentPosition document information
 */
export function createVarDeclarationItem(_textDocumentPosition: TextDocumentPositionParams): CompletionItem {
	let cursorColumn = _textDocumentPosition.position.character;
	let text = CompletionUtils.fillMissingSpaces(PIC_COLUMN_DECLARATION, cursorColumn) + "PIC IS $1($2)    VALUE IS $3     ${4:COMP-X}.";
	return {
		label: 'Completar declaração de variável',
		detail: 'Completa a declaração da variável.',
		insertText: text,
		insertTextFormat: InsertTextFormat.Snippet,
		filterText: "PIC",
		preselect: true,
		commitCharacters: ['X', '9', 'Z', 'B', ' '],
		kind: CompletionItemKind.Variable,
		data: 1
	};
}

/**
 * Creates a dynamic perform snippet
 *
 * @param _textDocumentPosition document information
 */
export function createPerformSnippet(_textDocumentPosition: TextDocumentPositionParams): CompletionItem {
	let cursorColumn = _textDocumentPosition.position.character;
	let text = "PERFORM" + CompletionUtils.fillMissingSpaces(35, cursorColumn + 6) + "${0}" + CompletionUtils.separatorForColumn(cursorColumn);
	return {
		label: 'Completar chamada de parágrafo',
		detail: 'Completa a chamada do parágrafo.',
		insertText: text,
		insertTextFormat: InsertTextFormat.Snippet,
		filterText: "PE",
		preselect: true,
		kind: CompletionItemKind.Keyword,
		data: 2
	};
}


// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
	(item: CompletionItem): CompletionItem => {
		if (item.data === 1) {
			(item.documentation = 'Serão inseridas cláusulas PIC e VALUE IS nos lugares apropriados.');
		}
		if (item.data === 2) {
			(item.documentation = 'Será gerado PERFORM para execução do parágrafo especificado.');
		}
		return item;
	}
);

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
	return new Promise<Location>((resolve) => {
		// If the word is too small
		if (word.length < 3) {
			connection.window.showWarningMessage(`Select at least three characters!`);
			resolve(undefined);
			return;
		}
		// Cache filename where the declaration is searched before
		// invoking Cobol preprocessor
		let cacheFileName = buildCacheFileName(uri);
		// Creates a promise to find the word declaration
		new Find(documentFullText).findDeclaration(word, new Path(uri), cacheFileName, () => {
			// Runs Cobol preprocessor on client-side
			return sendExternalPreprocExpanderExecution(uri, cacheFileName);
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
			resolve(undefined);
		});
	});
}

/**
 * Builds Cobol preprocessor cache filename
 *
 * @param uri current URI of the file open in editor
 */
export function buildCacheFileName(uri: string) {
	var path = new Path(uri).fullPathWin();
	return "c:\\tmp\\PREPROC\\" + new Path(path).fileName();
}

/**
 * Sends a request to the client for Cobol preprocessor execution
 *
 * @param uri current URI of the file open in editor
 * @param cacheFileName Cache filename where the declaration is searched before
 * invoking Cobol preprocessor
 */
export function sendExternalPreprocExpanderExecution(uri: string, cacheFileName: string) {
	var files = [uri, cacheFileName];
	return connection.sendRequest("custom/runPreprocExpander", [files]);
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


