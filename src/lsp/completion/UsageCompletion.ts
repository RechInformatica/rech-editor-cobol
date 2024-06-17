import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for 'USAGE' clause declaration
const USAGE_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol picture
 */
export class UsageCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const text =  CompletionUtils.fillSpacesFromWordStart(USAGE_COLUMN_DECLARATION, column, _lines[_line]) + "usage $1";
            resolve(
                [{
                    label: 'Complete USAGE declaration',
                    detail: 'USAGE clause will be inserted on the most appropriate place.',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "usage",
                    preselect: true,
                    commitCharacters: ['x', '9', 'z', 'b', ' '],
                    kind: CompletionItemKind.Variable
                }]
            );
        })
    }

}
