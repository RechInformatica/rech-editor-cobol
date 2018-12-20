import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { FormatterUtils } from "./FormatterUtils";

const COMMENTARYCOLUMN = 7;

/**
 * Class to format Cobol after commentary line
 */
export class CommentaryFormatter implements FormatterInterface {

    /**
     * Generates an array of Text Edits for source code formatting
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lines document lines
     */
    public generate(line: number, _column: number, lines: string[]): TextEdit[] {
        let previousCommandStartColumn = this.getPreviousCommand(line, lines);
        return [FormatterUtils.createIndentTextEdit(line, 0, previousCommandStartColumn - COMMENTARYCOLUMN + 1)];
    }

    /**
     * Returns the start column of the previous command
     *
     * @param line
     * @param lines
     */
    private getPreviousCommand(line: number, lines: string[]): number {
        for (let index = line; index > 0; index--) {
            const element = lines[index];
            if (element.trim().startsWith("*>")) {
                continue;
            }
            if (element.trim() == "") {
                continue;
            }
            return element.length - element.trimLeft().length;
        }
        return COMMENTARYCOLUMN;
    }

}