import { CompletionUtils } from "../commons/CompletionUtils";
import { ParserCobol } from "../../cobol/parsercobol";
import { TextEdit } from "vscode-languageserver";

/**
 * Utili class for Cobol code formatting
 */
export class FormatterUtils {

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

    /**
     * Returns true if at least one of the specified clauses is missing
     *
     * @param line line number
     * @param column column number
     * @param lines editor lines
     * @param clause clause to be tested
     * @param identClauses clauses to be ignored
     */
    public static isClauseMissing(line: number, column: number, lines: string[], clause:string, identClauses: string[]): boolean {
        const parser = ParserCobol;
        const indentedClauses: string[] = [];
        identClauses.forEach(currentClause => {
            indentedClauses.push(CompletionUtils.fillSpacesBetween(0, column) + currentClause.toLowerCase());
        });
        for (let index = line; index < lines.length; index++) {
            const lineText = lines[index];
            if (!parser.isCommentOrEmptyLine(lineText)) {
                // If it's a new paragraph declaration then the 'if' clause was not closed on the current
                // paragraph and the 'end-if' needs to be inserted
                if (parser.getDeclaracaoParagrafo(lineText)) {
                    return true;
                }
                // If it's a command at the same identation/column as 'if' clause
                // (the command is probably not nested inside the 'if')

                if (lineText.length < column) {
                    return true;
                }
                if (!(lineText.charAt(column) === " ")) {
                    if ((this.startsWithClause(lineText.toLowerCase(), indentedClauses))) {
                        if (lineText.toLowerCase().trim().startsWith(clause)) {
                            return false;
                        }
                    } else {
                        return true;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Returns true if the line text starts with at least one of the specified indented clauses
     *
     * @param lineText line text
     * @param indentedClauses indented clauses
     */
    private static startsWithClause(lineText: string, indentedClauses: string[]) {
        for (let i = 0; i < indentedClauses.length; i++) {
            if (lineText.startsWith(indentedClauses[i])) {
                return true;
            }
        }
        return false;
    }

}
