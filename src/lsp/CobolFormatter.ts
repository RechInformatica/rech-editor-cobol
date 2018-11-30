import { ParserCobol } from "../cobol/parsercobol";
import { TextEdit } from "vscode-languageserver";
import { CompletionUtils } from "./CompletionUtils";

/**
 * Class to format Cobol source code
 */
export class CobolFormatter {

    /** Cobol parser */
    private parserCobol: ParserCobol;

    constructor() {
        this.parserCobol = new ParserCobol();
    }

    /**
     * Formats the Cobol source code when according to what was typed
     * 
     * @param lines all lines of the document source code
     * @param lineNumber current line where curson is positioned
     */
    public formatWhenKeyIsPressed(lines: string[], lineNumber: number): TextEdit[] {
        if (this.isIfCondition(lineNumber - 1, lines)) {
            return this.formatIfClause(lineNumber, lines);
        }
        return [];
    }

    /**
     * Returns true if the current line represents an 'if' condition
     */
    private isIfCondition(line: number, lines: string[]): boolean {
        let currentLine = lines[line];
        if (/\s+IF.*/.exec(currentLine)) {
            return true;
        }
        return false;
    }

    /**
     * Formats Cobol 'if' clause when Enter is pressed
     * 
     * @param lineNumber number of the current line
     * @param lines document lines
     */
    private formatIfClause(lineNumber: number, lines: string[]): TextEdit[] {
        let lineText = lines[lineNumber];
        const edits: TextEdit[] = [CompletionUtils.createIndentTextEdit(lineNumber, 0)];
        let ifStartColumn = CompletionUtils.countSpacesAtBeginning(lineText);
        if (this.isEndIfMissing(lineNumber, ifStartColumn, lines)) {
            edits.push(this.createEndIfTextEdit(lineNumber + 1, ifStartColumn + 1));
        }
        return edits;
    }

    /**
     * Returns true if the 'end-if' clause is missing for the current paragraph
     * 
     * @param lineNumber current line number
     */
    private isEndIfMissing(lineNumber: number, column: number, lines: string[]): boolean {
        let parser = new ParserCobol();
        let endIfText = CompletionUtils.fillMissingSpaces(column, 0) + " END-IF";
        let elseText = CompletionUtils.fillMissingSpaces(column, 0) + " ELSE";
        for (let index = lineNumber; index < lines.length; index++) {
            let lineText = lines[index];
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
                    return !(lineText.startsWith(endIfText) || lineText.startsWith(elseText));
                }
            }
        }
        return true;
    }

    /**
     * Returns true if the line text starts with at least one of the specified tokens
     * 
     * @param text line text
     * @param tokens tokens to be tested
     */
    // private startsWithToken(lineText: string, tokens: string[]): boolean {
    //     let trimmed = lineText.trim();
    //     for (let index = 0; index < tokens.length; index++) {
    //         const currentToken = tokens[index];
    //         if (trimmed.startsWith(currentToken)) {
    //             return true;
    //         }
    //     };
    //     return false;
    // }

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