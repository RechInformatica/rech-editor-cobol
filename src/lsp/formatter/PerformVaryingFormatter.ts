import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to format Cobol 'Perform varying'
 */
export class PerformVaryingFormatter implements FormatterInterface {

    /** RegExp that identifies if it is the until of Perform varying clause*/
    public static UNTIL_REGEXP = /\s+UNTIL\s+.*/i;

    /**
     * Generates an array of Text Edits for source code formatting
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lines document lines
     */
    public generate(line: number, _column: number, lines: string[]): TextEdit[] {
        let lineText = lines[line];
        let untilStartColumn = CompletionUtils.countSpacesAtBeginning(lineText);
        return [this.createIndentofUntilTextEdit(line, untilStartColumn)];;
    }

    /**
     * Creates a TextEdit with the identation of 'Perform varying' clause
     *
     * @param line line where the 'until' clause will be inserted
     * @param column column where the 'until' clause will be inserted
     */
    private createIndentofUntilTextEdit(line: number, column: number): TextEdit {
        let text = "";
        text = CompletionUtils.fillMissingSpaces(column - 2, 0);
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

