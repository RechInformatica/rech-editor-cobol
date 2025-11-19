import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to format Cobol 'Perform varying'
 */
export class PerformVaryingFormatter implements FormatterInterface {

    /** RegExp that identifies if it is the until of Perform varying clause*/
    public static UNTIL_REGEXP = /^ +(UNTIL|until)\s+.*/i;

    /**
     * Returns the line of the 'UNTIL' clause
     *
     * @param line
     * @param lines
     */
    public static LineOfUntilClause(line: number, lines: string[]): number | undefined {
        for (let index = line; index > 0; index--) {
            const element = lines[index];
            if (CompletionUtils.isTheParagraphOrMethodDeclaration(element)) {
                break
            }
            if (PerformVaryingFormatter.UNTIL_REGEXP.exec(element)) {
                return index;
            }
        }
        return
    }

    /**
     * Generates an array of Text Edits for source code formatting
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lines document lines
     */
    public generate(line: number, _column: number, lines: string[]): TextEdit[] {
        let untilLine = line
        const currentLineText = lines[untilLine - 1];
        let untilLineText = currentLineText
        if (!PerformVaryingFormatter.UNTIL_REGEXP.exec(currentLineText)) {
            untilLine = PerformVaryingFormatter.LineOfUntilClause(line, lines)!
            untilLineText = lines[untilLine];
        }
        const untilStartColumn = CompletionUtils.countSpacesAtBeginning(untilLineText);
        if (/.*\s(?:or|and|=|>|<|=>|=<|<>)$/.test(currentLineText.toLowerCase())) {
            const condition = currentLineText.substring(untilStartColumn + 5);
            const conditionColumn = condition.length - condition.trimLeft().length + untilStartColumn + 8
            return [this.createIndentofUntilTextEdit(line, conditionColumn, lines[line].trim())];
        }
        return [this.createIndentofUntilTextEdit(line, untilStartColumn, lines[line].trim())];
    }

    /**
     * Creates a TextEdit with the identation of 'Perform varying' clause
     *
     * @param line line where the 'until' clause will be inserted
     * @param column column where the 'until' clause will be inserted
     */
    private createIndentofUntilTextEdit(line: number, column: number, aditionalText?: string): TextEdit {
        let text = "";
        text = CompletionUtils.fillSpacesBetween(0, column - 3);
        if (aditionalText) {
            text += aditionalText;
        }
        return {
            range: {
                start: {
                    line: line,
                    character: 0
                },
                end: {
                    line: line,
                    character: 120
                }
            },
            newText: text
        };
    }

}

