import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for a variable of evaluate declaration
const UNTIL_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol evaluate declarations
 */
export class PerformUntilExitCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let text = "perform" + CompletionUtils.fillSpacesFromWordReplacementEnd(UNTIL_COLUMN_DECLARATION, column, _lines[_line], "perform") + "until exit";
            resolve(
                [{
                    label: 'PERFORM UNTIL EXIT loop',
                    detail: 'Generates PERFORM UNTIL EXIT loop',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "pu",
                    preselect: true,
                    kind: CompletionItemKind.Keyword,
                    data: 7
                }]
            );
        });
    }

}