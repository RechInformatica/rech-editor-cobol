/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
"use strict";

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
  TextDocument,
  DocumentOnTypeFormattingParams,
  DocumentHighlight
} from "vscode-languageserver";
import { CobolDeclarationFinder } from "./declaration/CobolDeclarationFinder";
import { Path } from "../commons/path";
import { RechPosition } from "../commons/rechposition";
import { CobolWordFinder } from "../commons/CobolWordFinder";
import { Diagnostician } from "../cobol/diagnostic/diagnostician";
import { CobolFormatter } from "./formatter/CobolFormatter";
import { CobolCompletionItemFactory } from "./completion/CobolCompletionItemFactory";
import { DynamicJsonCompletion } from "./completion/DynamicJsonCompletion";
import { ParagraphCompletion } from "./completion/ParagraphCompletion";
import { HighlightFactory } from "./highlight/HighlightFactory";

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
      documentHighlightProvider: true,
      // Tell the client that the server supports code completion
      completionProvider: {
        resolveProvider: true
      },
      documentOnTypeFormattingProvider: {
        firstTriggerCharacter: "\n",
        moreTriggerCharacter: ["N", 'n', 'E', 'e'],
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
documents.onDidClose(textDocument => {
  //Clear the computed diagnostics to VSCode.
  connection.sendDiagnostics({
    uri: textDocument.document.uri,
    diagnostics: []
  });
});

/**
 * Create diagnostics for all errors or warnings
 *
 * @param textDocument
 */
export async function validateTextDocument(
  textDocument: TextDocument
): Promise<void> {
  getAutoDiagnostic<Boolean>().then(autodiagnostic => {
    if (autodiagnostic) {
      new Diagnostician()
        .diagnose(
          textDocument,
          fileName => {
            return sendExternalPreprocessExecution(fileName);
          },
          message => {
            return externalDiagnosticFilter(message);
          }
        )
        .then(diagnostics => {
          //Send the computed diagnostics to VSCode.
          connection.sendDiagnostics({
            uri: textDocument.uri,
            diagnostics: diagnostics
          });
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
 * Sends a request to the client to get a specific setting
 *
 * @param section
 */
export function getConfig<T>(section: string) {
  return connection.sendRequest<T>("custom/getConfig", section);
}

/**
 * Sends a request to the client to identify if should activate auto diagnostic
 */
export function getAutoDiagnostic<Boolean>() {
  return connection.sendRequest<Boolean>("custom/getAutoDiagnostic");
}

/**
 * Sends a request to the client for get a specific setting
 *
 * @param section
 */
export function externalDiagnosticFilter(diagnosticMessage: string) {
  return connection.sendRequest<boolean>(
    "custom/diagnosticFilter",
    diagnosticMessage
  );
}

/**
 * Provide the document highlight positions
 */
connection.onDocumentHighlight((_textDocumentPosition: TextDocumentPositionParams): Thenable<DocumentHighlight[]> => {
  return new Promise((resolve) => {
    let fullDocument = documents.get(_textDocumentPosition.textDocument.uri);
    let text = fullDocument!.getText();
    let line = _textDocumentPosition.position.line;
    let character = _textDocumentPosition.position.character
    let word = getLineText(
      text,
      line,
      character
    );
    resolve(new HighlightFactory().getHighlightsPositions(fullDocument!, word, line, character))
  })
})

// This handler provides the initial list of the completion items.
connection.onCompletion((_textDocumentPosition: TextDocumentPositionParams): Thenable<CompletionItem[]> => {
  return new Promise((resolve) => {
    getConfig<string[]>("snippetsRepositories").then(repositories => {
      let line = _textDocumentPosition.position.line;
      let column = _textDocumentPosition.position.character;
      let uri = _textDocumentPosition.textDocument.uri;
      let cacheFileName = buildCacheFileName(uri);
      let fullDocument = documents.get(uri);
      if (fullDocument) {
        new CobolCompletionItemFactory(line, column, fullDocument)
          .addCompletionImplementation(new DynamicJsonCompletion(repositories, uri))
          .setParagraphCompletion(new ParagraphCompletion(cacheFileName, () => {
            // Runs Cobol preprocessor on client-side
            return sendExternalPreprocExpanderExecution(uri, cacheFileName);
          }))
          .generateCompletionItems().then((items) => {
            resolve(items);
          }).catch(() => {
            resolve([]);
          })
      };
    });
  });
});

/**
 * Document formatter
 */
connection.onDocumentOnTypeFormatting(
  (params: DocumentOnTypeFormattingParams) => {
    let line = params.position.line;
    let column = params.position.character;
    let fullDocument = documents.get(params.textDocument.uri);
    if (fullDocument) {
      let formatter = new CobolFormatter(line, column, fullDocument);
      switch (true) {
        case hasTypedEnter(params.ch):
          return formatter.formatWhenEnterIsPressed();
        case params.ch.toUpperCase() == "E":
          return formatter.formatWhenEIsPressed();
        case params.ch.toUpperCase() == "N":
          return formatter.formatWhenNIsPressed();
      }
    }
    return [];
  }
);

/**
 * Retrun if the character that has been typed is a enter
 *
 * @param ch
 */
export function hasTypedEnter(ch: string) {
  return ch == "\n";
}

connection.onInitialized(() => {
  // Register for all configuration changes.
  connection.client.register(
    DidChangeConfigurationNotification.type,
    undefined
  );
});

connection.onDefinition(
  (
    params: TextDocumentPositionParams
  ): Thenable<Location> | Thenable<undefined> | undefined => {
    let fullDocument = documents.get(params.textDocument.uri);
    if (fullDocument) {
      let text = fullDocument.getText();
      let word = getLineText(
        text,
        params.position.line,
        params.position.character
      );
      return createPromiseForWordDeclaration(
        text,
        word,
        params.textDocument.uri
      );
    } else {
      return undefined;
    }
  }
);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);
// Listen on the connection
connection.listen();

// This handler resolve additional information for the item selected in
// the completion list.
connection.onCompletionResolve(
  (item: CompletionItem): CompletionItem => {
    return item;
  }
);

/**
 * Returns the specified line within the document text
 *
 * @param documentText document text
 * @param line line
 * @param column column
 */
export function getLineText(
  documentText: string,
  line: number,
  column: number
) {
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
export function createPromiseForWordDeclaration(
  documentFullText: string,
  word: string,
  uri: string
) {
  // Creates an external promise so the reject function can be called when no definition
  // is found for the specified word
  return new Promise<Location>(resolve => {
    // Creates a promise to find the word declaration
    new CobolDeclarationFinder(documentFullText)
      .findDeclaration(word, uri, (cacheFileName) => {
        // Runs Cobol preprocessor on client-side
        return sendExternalPreprocExpanderExecution(uri, cacheFileName);
      })
      .then((position: RechPosition) => {
        // If the delcaration was found on an external file
        if (position.file) {
          // Retrieves the location on the external file
          resolve(createLocation(position.file, position));
        } else {
          // Retrieves the location on the current file
          resolve(createLocation(uri, position));
        }
      })
      .catch(() => {
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
export function sendExternalPreprocExpanderExecution(
  uri: string,
  cacheFileName: string
) {
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
