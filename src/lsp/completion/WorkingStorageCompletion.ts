import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";


// Cobol column for a working-storage declaration
const WORKING_STORAGE_COLUMN_DECLARATION = 8;
/**
 * Class to generate LSP Completion Items for Cobol 'working-storage section' clause
 */
export class WorkingStorageCompletion implements CompletionInterface {

    public generate(_line: number, _column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const text = CompletionUtils.fillSpacesFromWordStart(WORKING_STORAGE_COLUMN_DECLARATION, 0, "") + "working-storage section.";
            resolve(
                [{
                    label: 'WORKING-STORAGE section',
                    detail: 'Generates WORKING-STORAGE section',
                    insertText: text,
                    additionalTextEdits: [CompletionUtils.createCleanLineTextEdit(_line)],
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "working storage",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
