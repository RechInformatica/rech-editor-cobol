import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { FormatterUtils } from "./FormatterUtils";

/**
 * Class to format Cobol 'evaluate'
 */
export class EvaluateFormatter implements FormatterInterface {

    /**
     * Generates an array of Text Edits for source code formatting
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lines document lines
     */
    public generate(line: number, _column: number, lines: string[]): TextEdit[] {
        let lineText = lines[line];
        let evaluateStartColumn = CompletionUtils.countSpacesAtBeginning(lineText);
        const edits: TextEdit[] = [this.createWhenTextEdit(line, evaluateStartColumn)];
        if (FormatterUtils.isClauseMissing(line, evaluateStartColumn, lines, ["END-EVALUATE"])) {
            edits.push(this.createEndEvaluateTextEdit(line + 1, evaluateStartColumn + 1));
        }
        return edits;
    }

    /**
     * Creates a TextEdit with the 'end-evaluate' clause already formatted
     * 
     * @param line line where the 'end-evaluate' clause will be inserted
     * @param column column where the 'end-evaluate' clause will be inserted
     */
    private createEndEvaluateTextEdit(line: number, column: number): TextEdit {
        let endEvaluateText = "";
        endEvaluateText = CompletionUtils.fillMissingSpaces(column, 0) + "END-EVALUATE";
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

    /**
     * Creates a TextEdit with the 'when' clause already formatted
     * 
     * @param line line where the 'when' clause will be inserted
     * @param column column where the 'when' clause will be inserted
     */
    private createWhenTextEdit(line: number, column: number): TextEdit {
        let textToInsert = "WHEN ";
        let endEvaluateText = "";
        endEvaluateText = CompletionUtils.fillMissingSpaces(column + 4, column) + textToInsert;
        return {
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
            newText: endEvaluateText
        };
    }
    
    
}