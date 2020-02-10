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
    public generate(line: number, column: number, lines: string[]): TextEdit[] {
        if (this.isRechDocLine(line, lines)) {
            return [
                {
                    range: {
                        start: {
                            line: line,
                            character: column
                        },
                        end: {
                            line: line,
                            character: column
                        }
                    },
                    newText: "*> "
                }
            ];
        } else {
            const previousCommandStartColumn = this.getPreviousCommand(line, lines);
            return [FormatterUtils.createIndentTextEdit(line, 0, previousCommandStartColumn - COMMENTARYCOLUMN + 1)];
        }
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


    /**
     * Returns true if is a rechDoc comment line
     */
    private isRechDocLine(line: number, lines: string[]): boolean {
        return this.isAfterTheStartOfRechDoc(line, lines) && this.isBeforeTheEndOfRechDoc(line, lines);
    }

    /**
     * Return true if the line after the rechDoc start line
     *
     * @param line
     * @param lines
     */
    private isAfterTheStartOfRechDoc(line: number, lines: string[]): boolean {
        for (let i = line - 1; i > 0; i--) {
            const currentLine = lines[i];
            if (currentLine.trim().startsWith("*>/**")) {
                return true;
            }
            if (currentLine.trim().startsWith("*>")) {
                continue;
            }
            if (currentLine.trim() == "") {
                continue;
            }
            break;
        }
        return false;
    }

    /**
     * Return true if the line after the rechDoc start line
     *
     * @param line
     * @param lines
     */
    private isBeforeTheEndOfRechDoc(line: number, lines: string[]): boolean {
        for (let i = line; i < lines.length; i++) {
            const currentLine = lines[i];
            if (currentLine.trim().startsWith("*>*/")) {
                return true;
            }
            if (currentLine.trim().startsWith("*>")) {
                continue;
            }
            if (currentLine.trim() == "") {
                continue;
            }
            break;
        }
        return false;
    }


}