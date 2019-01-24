import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
* Class to folding Cobol if blocks
*/
export class IfFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^\s+if\s+.*/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        let startLine = this.findStartLine(line, lines);
        let startColumn = lines[startLine].length;
        let endLine = this.findEndOfIfDeclaration(line, lines)
        return {
            startLine: startLine,
            startCharacter: startColumn,
            endLine: endLine,
            endCharacter: lines[endLine].length
        }
    }

    /**
     * Find the start line of the 'if' block
     *
     * @param line
     * @param lines
     */
    private findStartLine(line: number, lines: string[]): number {
        for (let index = line; index < lines.length; index++) {
            let currentLine  = lines[index];
            let words = currentLine.trim().split(" ");
            let firtsWord = words[0]
            let lastWord = words[words.length - 1]
            if (this.isOperator(firtsWord) || this.isOperator(lastWord)) {
                continue;
            }
            return index
        }
        return line;
    }

    /**
     * Returns true if the word is a oprator
     *
     * @param word
     */
    private isOperator(word: string) {
        return /and|or|=|>|<|=>|<=/.test(word);
    }

    /**
     * Find the end of the variable declaration
     *
     * @param line
     * @param lines
     */
    private findEndOfIfDeclaration(line: number, lines: string[]): number {
        let ifDeclarationLine = lines[line];
        let ifDeclarationColumn = CompletionUtils.countSpacesAtBeginning(ifDeclarationLine);
        for (let index = line; index < lines.length; index++) {
            let currentLine = lines[index];
            if (currentLine.trimLeft().startsWith("end-if") || currentLine.trimLeft().startsWith("else")) {
                let currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == ifDeclarationColumn) {
                    return index - 1;
                }
            }
        }
        return line
    }

}