
import { HighlightInterface } from "./HighlightInterface";
import { TextDocument, DocumentHighlight, Position, Range } from "vscode-languageserver";
import { BufferSplitter } from "rech-ts-commons";

/** Terms of block */
const BEGINBLOCKTERM = "if"
const ENDBLOCKTERM = "end-if"
const ELSETERM = "else"

/**
 * Class to return the behavior of highlight when is a 'if' term
 */
export class IfHighlight implements HighlightInterface {

    isABlockTerm(word: string): boolean {
        const match = /^(if|else|end-if)$/i.exec(word);
        if (match) {
            return true
        }
        return false
    }

    positions(text: TextDocument, _word: string, currentLine: number, _currentCharacter: number): DocumentHighlight[]{
        const results: DocumentHighlight[] = []
        const buffer = BufferSplitter.split(text.getText());
        const currentLineContent = buffer[currentLine];
        const commandColumn = currentLineContent.length - currentLineContent.trimLeft().length
        const beginLine = this.findTheBeginOfBlock(text, currentLine, commandColumn);
        const endLine = this.findTheEndOfBlock(text, currentLine, commandColumn);
        if (beginLine && endLine) {
            const elseLine = this.findLineOfBlockTerm(text, beginLine, ELSETERM, commandColumn, true)
            if (elseLine && elseLine < endLine) {
                results.push(this.buildDocumentHighlight(elseLine, commandColumn, ELSETERM))
            }
            results.push(this.buildDocumentHighlight(beginLine, commandColumn, BEGINBLOCKTERM))
            results.push(this.buildDocumentHighlight(endLine, commandColumn, ENDBLOCKTERM))
        }
        return results;
    }

    /**
     * Find the begin line of the block
     *
     * @param text
     * @param currentLine
     * @param commandColumn
     */
    private findTheBeginOfBlock(text: TextDocument, currentLine: number, commandColumn: number) {
        return this.findLineOfBlockTerm(text, currentLine, BEGINBLOCKTERM, commandColumn, false)
    }

    /**
     * Find the end line of the block
     *
     * @param text
     * @param currentLine
     * @param commandColumn
     */
    private findTheEndOfBlock(text: TextDocument, currentLine: number, commandColumn: number) {
        return this.findLineOfBlockTerm(text, currentLine, ENDBLOCKTERM, commandColumn, true)
    }

    /**
     * Find a line of a term in the block
     *
     * @param text
     * @param currentLine
     * @param term
     * @param commandColumn
     */
    private findLineOfBlockTerm(text: TextDocument, currentLine: number, term: string, commandColumn: number, forward: boolean) {
        const buffer = BufferSplitter.split(text.getText());
        let index = currentLine;
        while ((forward && index < buffer.length) || (!forward && index > 0)) {
            const line = buffer[index];
            if (line.trimLeft().startsWith(term) && line.substring(commandColumn, commandColumn + term.length).toLowerCase() == term) {
                return index
            }
            if (forward) {
                index++
            } else {
                index--
            }
        }
        return
    }

    /**
     * Builds and returns the DocumentHighlight of interator
     *
     * @param line
     * @param colum
     * @param word
     */
    private buildDocumentHighlight(line: number, colum: number, word: string): DocumentHighlight {
        return {
            range:  Range.create(
                Position.create(line, colum),
                Position.create(line, colum + word.length)
            )
        }
    }

}
