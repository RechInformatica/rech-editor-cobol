import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { FormatterUtils } from "./FormatterUtils";
import { CatchFormatter } from "./CatchFormatter";

/**
 * Class to format Cobol 'try'
 */
export class TryFormatter implements FormatterInterface {

    /** RegExp that identifies if it is the TRY clause*/
    public static TRY_REGEXP = /\s+(TRY|try).*/;

    /**
     * Generates an array of Text Edits for source code formatting
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lines document lines
     */
    public generate(line: number, _column: number, lines: string[]): TextEdit[] {
        let tryLineText = lines[line - 1];
        let tryStartColumn = CompletionUtils.countSpacesAtBeginning(tryLineText);
        let edits: TextEdit[] = [FormatterUtils.createIndentTextEdit(line, 0)];
        let endTryClause = "end-try"
        let catchClause = "catch"
        let identClauses = [endTryClause, catchClause, "finally"]
        if (FormatterUtils.isClauseMissing(line + 1, tryStartColumn, lines, catchClause, identClauses)) {
            edits = edits.concat(new CatchFormatter().generate(line + 1, tryStartColumn, lines));
        }
        if (FormatterUtils.isClauseMissing(line + 1, tryStartColumn, lines, endTryClause, identClauses)) {
            edits.push(this.createEndTryTextEdit(line + 2, tryStartColumn + 1));
        }
        return edits;
    }

    /**
     * Creates a TextEdit with the 'end-if' clause already formatted
     *
     * @param line line where the 'end-if' clause will be inserted
     * @param column column where the 'end-if' clause will be inserted
     */
    private createEndTryTextEdit(line: number, column: number): TextEdit {
        let endTryText = "";
        endTryText = CompletionUtils.fillSpacesBetween(0, column - 1) + "end-try";
        endTryText = endTryText.concat(CompletionUtils.separatorForColumn(column));
        endTryText = endTryText.concat("\n");
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
            newText: endTryText
        };
    }

}
