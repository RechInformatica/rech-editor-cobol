import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { FormatterUtils } from "./FormatterUtils";

/**
 * Class to format Cobol 'if'
 */
export class IfFormatter implements FormatterInterface {

    /**
     * Generates an array of Text Edits for source code formatting
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lines document lines
     */
    public generate(line: number, _column: number, lines: string[]): TextEdit[] {
        let lineText = lines[line];
        let ifStartColumn = CompletionUtils.countSpacesAtBeginning(lineText);
        const edits: TextEdit[] = [FormatterUtils.createIndentTextEdit(line, 0)];
        if (FormatterUtils.isClauseMissing(line, ifStartColumn, lines, ["END-IF", "ELSE"])) {
            edits.push(this.createEndIfTextEdit(line + 1, ifStartColumn + 1));
        }
        return edits;
    }

    /**
     * Creates a TextEdit with the 'end-if' clause already formatted
     * 
     * @param line line where the 'end-if' clause will be inserted
     * @param column column where the 'end-if' clause will be inserted
     */
    private createEndIfTextEdit(line: number, column: number): TextEdit {
        let endIfText = "";
        endIfText = CompletionUtils.fillMissingSpaces(column, 0) + "END-IF";
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