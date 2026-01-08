import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { FormatterUtils } from "./FormatterUtils";
import { WhenFormatter } from "./WhenFormatter";
import { CommandSeparatorFormatter } from "./CommandSeparatorFormatter";

/**
 * Class to format Cobol 'evaluate'
 */
export class EvaluateFormatter implements FormatterInterface {

    /** RegExp that identifies if it is the EVALUATE clause */
    public static EVALUATE_REGEXP = /^ +(EVALUATE|evaluate).*/;

    /**
     * Generates an array of Text Edits for source code formatting
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lines document lines
     */
    public generate(line: number, _column: number, lines: string[]): TextEdit[] {
        const evaluateLineText = lines[line - 1];
        const evaluateStartColumn = CompletionUtils.countSpacesAtBeginning(evaluateLineText);
        const edits: TextEdit[] = [];
        edits.push(this.createWhenTextEdit(line, evaluateStartColumn + 3));
        const endEvaluateClause = "end-evaluate";
        if (FormatterUtils.isClauseMissing(line + 1, evaluateStartColumn, lines, endEvaluateClause, [endEvaluateClause, "when"])) {
            edits.push(this.createEndEvaluateTextEdit(line + 1, evaluateStartColumn + 1));
        }
        return edits;
    }

    /**
     * Creates a TextEdit with the 'WHEN' clause already formatted
     *
     * @param line
     * @param whenColumn
     */
    private createWhenTextEdit(line: number, whenColumn: number): TextEdit {
        const result = new WhenFormatter().createWhenTextEdit(line, whenColumn);
        result.newText += " ";
        return result;
    }

    /**
     * Creates a TextEdit with the 'end-evaluate' clause already formatted
     *
     * @param line line where the 'end-evaluate' clause will be inserted
     * @param column column where the 'end-evaluate' clause will be inserted
     */
    private createEndEvaluateTextEdit(line: number, column: number): TextEdit {
        let endEvaluateText = "";
        endEvaluateText = CompletionUtils.fillSpacesBetween(0, column - 1) + "end-evaluate";
        endEvaluateText = endEvaluateText.concat(CompletionUtils.separatorForColumn(column));
        endEvaluateText = endEvaluateText.concat("\n");
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
            newText: endEvaluateText
        };
    }

}
