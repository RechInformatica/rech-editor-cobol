
import { HighlightInterface } from "./HighlightInterface";
import { TextDocument, DocumentHighlight, Position, Range } from "vscode-languageserver";

/** Clauses from constant test */
const CLAUSE_IF = "$if";
const CLAUSE_ELSE = "$else";
const CLAUSE_END = "$end";
const START_COLUMN_FOR_TEST = 6;

/**
 * Class to return the behavior of highlight when is a constant test term
 */
export class ConstantTestHighlight implements HighlightInterface {

    isABlockTerm(word: string): boolean {
        const match = /\$(if|else|end)/i.exec(word);
        if (match) {
            return true
        }
        return false
    }

    positions(text: TextDocument, _word: string, currentLine: number, _currentCharacter: number): DocumentHighlight[]{
        const results: DocumentHighlight[] = []
        const ifPosition = this.findClauseIftOfTest(text.getText().split("\n"), currentLine);
        if (!ifPosition) {
            return results;
        }
        const elsePosition = this.findClauseElsetOfTest(text.getText().split("\n"), ifPosition);
        const endPosition = this.findClauseEndtOfTest(text.getText().split("\n"), ifPosition);
        if (!endPosition) {
            return results;
        }
        results.push(this.buildDocumentHighlight(ifPosition, CLAUSE_IF))
        if (elsePosition) {
            results.push(this.buildDocumentHighlight(elsePosition, CLAUSE_ELSE))
        }
        results.push(this.buildDocumentHighlight(endPosition, CLAUSE_END))
        return results;
    }

    /**
     * Find the $if term from constant test
     *
     * @param buffer
     * @param currentLine
     */
    private findClauseIftOfTest(buffer: string[], currentLine: number): number | undefined {
        let numberOfEnds = 0;
        for (let i = currentLine; i > 0; i--) {
            const line = buffer[i].trimLeft();
            if (line.startsWith(CLAUSE_IF)) {
                if (numberOfEnds == 0) {
                    return i;
                } else {
                    numberOfEnds--;
                }
            }
            if (line.startsWith(CLAUSE_END) && i < currentLine) {
                numberOfEnds++;
            }
        }
        return currentLine;
    }

    /**
     * Find the $else term from constant test
     *
     * @param buffer
     * @param currentLine
     */
    private findClauseElsetOfTest(buffer: string[], ifPosition: number): number | undefined {
        let numberOfIfs = 0;
        for (let i = ifPosition + 1; i < buffer.length; i++) {
            const line = buffer[i].trimLeft();
            if (line.startsWith(CLAUSE_ELSE)) {
                if (numberOfIfs == 0) {
                    return i;
                }
            }
            if (line.startsWith(CLAUSE_END) && i > ifPosition) {
                if (numberOfIfs > 0) {
                    numberOfIfs--;
                } else if (numberOfIfs == 0) {
                    return undefined;
                }
            }
            if (line.startsWith(CLAUSE_IF)) {
                numberOfIfs++;
            }
        }
        return undefined;
    }

    /**
     * Find the $end term from constant test
     *
     * @param buffer
     * @param currentLine
     */
    private findClauseEndtOfTest(buffer: string[], ifPosition: number): number | undefined {
        let numberOfIfs = 0;
        for (let i = ifPosition + 1; i < buffer.length; i++) {
            const line = buffer[i].trimLeft();
            if (line.startsWith(CLAUSE_END)) {
                if (numberOfIfs == 0) {
                    return i;
                } else {
                    numberOfIfs--;
                }
            }
            if (line.startsWith(CLAUSE_IF)) {
                numberOfIfs++;
            }
        }
        return undefined;
    }

    /**
     * Builds and returns the DocumentHighlight of the term
     *
     * @param iterator
     * @param word
     */
    private buildDocumentHighlight(line: number, word: string): DocumentHighlight {
        return {
            range:  Range.create(
                Position.create(line, START_COLUMN_FOR_TEST),
                Position.create(line, START_COLUMN_FOR_TEST + word.length)
            )
        }
    }

}