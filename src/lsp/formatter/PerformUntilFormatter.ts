import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { FormatterUtils } from "./FormatterUtils";

/**
 * Class to format Cobol 'if'
 */
export class PerformUntilFormatter implements FormatterInterface {
    
    /** RegExp that identifies if it is the PERFORM UNTIL clause*/
    public static PERFORM_UNTIL_REGEXP = /\s+(PERFORM|perform)\s+(UNTIL|until)/;

    /**
     * Generates an array of Text Edits for source code formatting
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lines document lines
     */
    public generate(line: number, _column: number, lines: string[]): TextEdit[] {
        let lineText = lines[line];
        let performUntilStartColumn = CompletionUtils.countSpacesAtBeginning(lineText);
        const edits: TextEdit[] = [FormatterUtils.createIndentTextEdit(line, 0)];
        edits.push(this.createEndPerformTextEdit(line + 1, performUntilStartColumn + 1));
        // if (FormatterUtils.isClauseMissing(line, performUntilStartColumn, lines, ["END-PERFORM"])) {
        // }
        return edits;
    }

    /**
     * Creates a TextEdit with the 'end-perform' clause already formatted
     * 
     * @param line line where the 'end-perform' clause will be inserted
     * @param column column where the 'end-perform' clause will be inserted
     */
    private createEndPerformTextEdit(line: number, column: number): TextEdit {
        let endIfText = "";
        endIfText = CompletionUtils.fillMissingSpaces(column, 0) + "END-PERFORM";
        endIfText = endIfText.concat(CompletionUtils.separatorForColumn(column));
        endIfText = endIfText.concat("\n");
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
            newText: endIfText
        };
    }

}