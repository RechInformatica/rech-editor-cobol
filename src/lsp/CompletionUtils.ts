import { TextEdit } from "vscode-languageserver";

/**
 * Utili class for Cobol code completion and formatting
 */
export class CompletionUtils {

    /**
     * Returns the number of spaces in the beginning of the specified string
     * 
     * @param lineText line text
     */
    public static countSpacesAtBeginning(lineText: string) {
        for (let index = 0; index < lineText.length; index++) {
            if (lineText.charAt(index) !== " ") {
                return index;
            }
        }
        return lineText.length;
    }


    /**
     * Fills missing spaces for clauses declaration considering the column
     * where the cursor is currently positioned
     * 
     * @param startColumn initial column
     * @param initialColumn cursor column
     */
    public static fillMissingSpaces(startColumn: number, initialColumn: number): string {
        let missingSpaces = startColumn - initialColumn;
        let text = '';
        for (var i = 1; i < missingSpaces; i++) {
            text = text.concat(" ");
        }
        if (text.length === 0) {
            text = ' ';
        }
        return text;
    }

    /**
     * Returns the Cobol command separator for the specified column
     * 
     * @param column target column
     */
    public static separatorForColumn(column: number): string {
        if (column <= 12) {
            return ".";
        }
        return ",";
    }

    /**
     * Creates an indent text edit for the specified line and column
     * 
     * @param line line number
     * @param column column number
     * @param size indentation size (number of spaces to be inserted)
     */
    public static createIndentTextEdit(line: number, column: number, size: number = 3): TextEdit {
        let indentSpaces = "";
        for (let i = 0; i < size; i++) {
            indentSpaces = indentSpaces.concat(" ");
        }
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
            newText: indentSpaces
        };
    }

}