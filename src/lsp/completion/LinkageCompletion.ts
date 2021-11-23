import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";


// Cobol column for a linkage declaration
const LINKAGE_COLUMN_DECLARATION = 8;
/**
 * Class to generate LSP Completion Items for Cobol 'working-storage section' clause
 */
export class LinkageCompletion implements CompletionInterface {

    public generate(_line: number, _column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const text = CompletionUtils.fillSpacesFromWordStart(LINKAGE_COLUMN_DECLARATION, 0, "") + "linkage section.";
            resolve(
                [{
                    label: 'LINKAGE section',
                    detail: 'Generates LINKAGE section',
                    insertText: text,
                    additionalTextEdits: [CompletionUtils.createCleanLineTextEdit(_line)],
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "linkage",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
