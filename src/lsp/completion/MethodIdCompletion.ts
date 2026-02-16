import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for a method-id declaration
const METHOD_COLUMN_DECLARATION = 8;
/**
 * Class to generate LSP Completion Items for Cobol method-id
 */
export class MethodIdCompletion implements CompletionInterface {

    public generate(line: number, _column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const text = CompletionUtils.fillSpacesFromWordStart(METHOD_COLUMN_DECLARATION, 0, "") + "method-id. $1$0.";
            resolve(
                [{
                    label: 'METHOD-ID declaration',
                    detail: 'Generates the declaration of METHOD-ID.',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "method",
                    additionalTextEdits: [CompletionUtils.createCleanLineTextEdit(line)],
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
