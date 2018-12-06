import { ParserCobol } from "../../cobol/parsercobol";
import { TextEdit } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

// End Cobol column
const END_COBOL_COLUMN = 120;

/**
 * Class to format Cobol source code
 */
export class CobolFormatter {

    /** Cobol parser */
    private parser: ParserCobol;

    constructor() {
        this.parser = new ParserCobol();
    }

    /**
     * Formats the Cobol source code when according to what was typed
     * 
     * @param lines all lines of the document source code
     * @param lineNumber current line where curson is positioned
     * @param ch Character that has been typed.
     * 
     */
    public formatWhenKeyIsPressed(lines: string[], lineNumber: number, ch: string): TextEdit[] {
        let currentText = lines[lineNumber];
        if (this.hasTypedEnter(ch)) {
            currentText = lines[lineNumber - 1];
        }
        if (this.isIfCondition(currentText) && this.hasTypedEnter(ch)) {
            return this.formatIfClause(lineNumber, lines);
        }
        if (this.isEvaluateCondition(currentText) && this.hasTypedEnter(ch)) {
            return this.formatEvaluateClause(lineNumber, lines);
        }
        if (this.isWhenCondition(currentText) && (this.hasTypedEnter(ch) || this.hasTypedSpace(ch))) {
            return this.formatWhenClause(lineNumber, lines, ch);
        }
        if (this.parser.getDeclaracaoParagrafo(currentText) && this.hasTypedEnter(ch)) {
            return [CompletionUtils.createIndentTextEdit(lineNumber, 0, 4)];
        }
        return [];
    }

    /**
     * Returns true if the current line represents an 'if' condition
     */
    private isIfCondition(currentText: string): boolean {
        if (/\s+(IF|if).*/.exec(currentText)) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the current line represents a 'when' condition
     */
    private isWhenCondition(currentText: string): boolean {
        if (/\s+(WHEN|when).*/.exec(currentText)) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the current line represents a 'evaluate' condition
     */
    private isEvaluateCondition(currentText: string): boolean {
        if (/\s+(EVALUATE|evaluate).*/.exec(currentText)) {
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
        let endIfText = CompletionUtils.fillMissingSpaces(column, 0) + " END-IF";
        let elseText = CompletionUtils.fillMissingSpaces(column, 0) + " ELSE";
        for (let index = lineNumber; index < lines.length; index++) {
            let lineText = lines[index];
            if (!this.parser.isCommentOrEmptyLine(lineText)) {
                // If it's a new paragraph declaration then the 'if' clause was not closed on the current
                // paragraph and the 'end-if' needs to be inserted
                if (this.parser.getDeclaracaoParagrafo(lineText)) {
                    return true;
                }
                // If it's a command at the same identation/column as 'if' clause
                // (the command is probably not nested inside the 'if')

                if (lineText.length < column) {
                    return true;
                }
                if (!(lineText.charAt(column) === " ")) {
                    return !(lineText.startsWith(endIfText.toUpperCase()) || lineText.startsWith(elseText.toUpperCase()));
                }
            }
        }
        return true;
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

    /**
     * Formats Cobol 'evaluate' clause when Enter is pressed
     * 
     * @param lineNumber number of the current line
     * @param lines document lines
     */
    private formatEvaluateClause(lineNumber: number, lines: string[]): TextEdit[] {
        let lineText = lines[lineNumber];
        let evaluateStartColumn = CompletionUtils.countSpacesAtBeginning(lineText);
        const edits: TextEdit[] = [this.createWhenTextEdit(lineNumber, evaluateStartColumn + 3)];
        if (this.isEndEvaluateMissing(lineNumber, evaluateStartColumn, lines)) {
            edits.push(this.createEndEvaluateTextEdit(lineNumber + 1, evaluateStartColumn + 1));
        }
        return edits;
    }

    /**
     * Returns true if the 'end-evaluate' clause is missing for the current paragraph
     * 
     * @param lineNumber current line number
     */
    private isEndEvaluateMissing(lineNumber: number, column: number, lines: string[]): boolean {
        let endEvaluateText = CompletionUtils.fillMissingSpaces(column, 0) + " END-EVALUATE";
        for (let index = lineNumber; index < lines.length; index++) {
            let lineText = lines[index];
            if (!this.parser.isCommentOrEmptyLine(lineText)) {
                // If it's a new paragraph declaration then the 'evaluate' clause was not closed on the current
                // paragraph and the 'end-evaluate' needs to be inserted
                if (this.parser.getDeclaracaoParagrafo(lineText)) {
                    return true;
                }
                // If it's a command at the same identation/column as 'evaluate' clause
                // (the command is probably not nested inside the 'evaluate')
                if (lineText.length < column) {
                    return true;
                }
                if (!(lineText.charAt(column) === " ")) {
                    return !(lineText.startsWith(endEvaluateText.toUpperCase()));
                }
            }
        }
        return true;
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
        let textToInsert = " WHEN ";
        let whenText = "";
        whenText = CompletionUtils.fillMissingSpaces(column, 0) + textToInsert;
        return {
            range: {
                start: {
                    line: line,
                    character: 0
                },
                end: {
                    line: line,
                    character: END_COBOL_COLUMN
                }
            },
            newText: whenText

        };
    }    

    /**
     * Formats Cobol 'when' clause when Enter is pressed
     * 
     * @param lineNumber number of the current line
     * @param lines document lines
     */
    private formatWhenClause(lineNumber: number, lines: string[], ch: string): TextEdit[] {
        // If enter is typed subtract it from line number
        let lineText = lines[lineNumber];
        if (this.hasTypedEnter(ch)) {
            lineText = lines[lineNumber - 1];
        }
        let match = /\s+(WHEN|when)\s+[a-zA-Z0-9]/.exec(lineText);
        if (!match && this.hasTypedSpace(ch)) {
            let whenStartColumn = this.evaluateColumn(lineNumber, lines) + 3;
            return [this.createWhenTextEdit(lineNumber, whenStartColumn)];
        } else {
            return [CompletionUtils.createIndentTextEdit(lineNumber, 0)];
        }
    }

    /**
     * Find the evaluate column for the 
     * 
     * @param lineNumber 
     * @param lines 
     */
    private evaluateColumn(lineNumber: number, lines: string[]) {
        for (let i = lineNumber; i > 0; i--) {
            if (this.isEvaluateCondition(lines[i])) {
                return CompletionUtils.countSpacesAtBeginning(lines[i]);
            }
        }
        return CompletionUtils.countSpacesAtBeginning(lines[lineNumber]);
    }

    /**
     * Retrun if the character that has been typed is a enter
     * 
     * @param ch 
     */
    private hasTypedEnter(ch: string) {
        return ch == "\n";
    }

    /**
     * Retrun if the character that has been typed is a space
     * 
     * @param ch 
     */
    private hasTypedSpace(ch: string) {
        return ch == " ";
    }

}