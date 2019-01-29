import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for declare the parameters of perform
const PARAM_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol evaluate declarations
 */
export class PerformVaryingCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const performClause = "perform";
            const varyingClause = "varying";
            const untilClause = "until";
            let startColumn = CompletionUtils.findWordStartWithinLine(column, _lines[_line]);
            let text = "";
            text = text.concat(performClause).concat("\n");
            text = text.concat(CompletionUtils.fillSpacesBetween(startColumn, startColumn + 3) + varyingClause);
            text = text.concat(CompletionUtils.fillSpacesOrSingleSpace(startColumn + varyingClause.length + 2, PARAM_COLUMN_DECLARATION - 1) + "${1} from ${2:} by ${3:1}\n");
            text = text.concat(CompletionUtils.fillSpacesBetween(startColumn, startColumn + 6) + untilClause);
            text = text.concat(CompletionUtils.fillSpacesOrSingleSpace(startColumn + untilClause.length + 5, PARAM_COLUMN_DECLARATION - 1) + "${1} ${4}");
            let endPerform: TextEdit[] = [this.createEndPerformTextEdit(_line + 1, startColumn)];
            resolve(
                [{
                    label: 'PERFORM VARYING loop',
                    detail: 'Generates the declaration of PERFORM VARYING loop',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    additionalTextEdits: endPerform,
                    filterText: "pb perform varying",
                    preselect: true,
                    kind: CompletionItemKind.Keyword,
                    data: 8
                }]
            );
        });
    }

    /**
     * Creates a TextEdit with the 'end-perform' clause already formatted
     *
     * @param line line where the 'end-perform' clause will be inserted
     * @param column column where the 'end-perform' clause will be inserted
     */
    private createEndPerformTextEdit(line: number, column: number): TextEdit {
        let text = CompletionUtils.fillSpacesBetween(1, column) + "end-perform";
        text = text.concat(CompletionUtils.separatorForColumn(column));
        text = text.concat("\n");
        return {
            range: {
                start: {
                    line: line,
                    character: 0
                },
                end: {
                    line: line,
                    character: 0
                }
            },
            newText: text
        };
    }

}