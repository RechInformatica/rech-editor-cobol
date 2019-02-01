import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to format Cobol source code keeping the commands separator
 * 'dot' or 'comma' on the current line
 */
export class CommandSeparatorFormatter implements FormatterInterface {

    /**
     * Generates an array of Text Edits for source code formatting
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lineText document lines
     */
    public generate(line: number, _column: number, lines: string[]): TextEdit[] {
        let previousLineText = lines[line - 1];
        let previousLineNumber = line - 1;
        let currentLineText = lines[line];
        return [this.createKeepDotOrCommaTextEdit(previousLineText, previousLineNumber, currentLineText)]
    }

    /**
     * Creates a text edit to prevent editor from removing dot/comma from the end of the line
     *
     * @param previousLineText current line text
     * @param previousLineNumber line where the cursor is positioned
     * @param currentLineText text of the current line
     */
    public createKeepDotOrCommaTextEdit(previousLineText: string, previousLineNumber: number, currentLineText: string): TextEdit {
        let targetChar = this.getCommandDelimiter(currentLineText);
        return {
            range: {
                start: {
                    line: previousLineNumber,
                    character: previousLineText.length
                },
                end: {
                    line: previousLineNumber + 1,
                    character: previousLineText.length
                }
            },
            newText: targetChar + "\n" + CompletionUtils.fillSpacesBetween(0, CompletionUtils.countSpacesAtBeginning(previousLineText))
        };
    }

    /**
     * Returns the command delimiter for the specified line text
     *
     * @param lineText line text
     */
    private getCommandDelimiter(lineText: string): string {
        if (lineText.trim().endsWith(".")) {
            return ".";
        }
        return ",";
    }

}