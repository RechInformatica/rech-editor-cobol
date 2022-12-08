import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
* Class to folding Cobol if blocks
*/
export class IfFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^ +if\s+.*/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        const startLine = this.findStartLine(line, lines);
        const startColumn = lines[startLine].length;
        const endLine = this.findEndOfIfDeclaration(line, lines)
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
        for (let index = line; index <= lines.length; index++) {
            const currentLine  = lines[index];
            const nextLine  = lines[index + 1];
            const words = currentLine.trim().split(" ");
            const nextWords = nextLine.trim().split(" ");
            const firtsWordOfTheNextLine = nextWords[0]
            const lastWord = words[words.length - 1]
            if (CompletionUtils.isOperator(firtsWordOfTheNextLine) || CompletionUtils.isOperator(lastWord)) {
                continue;
            }
            return index
        }
        return line;
    }

    /**
     * Find the end of the if block
     *
     * @param line
     * @param lines
     */
    private findEndOfIfDeclaration(line: number, lines: string[]): number {
        const ifDeclarationLine = lines[line];
        const ifDeclarationColumn = CompletionUtils.countSpacesAtBeginning(ifDeclarationLine);
        for (let index = line; index < lines.length; index++) {
            const currentLine = lines[index];
            const formatedCurrentLine = currentLine.trimLeft().toLowerCase();
            if (formatedCurrentLine.startsWith("end-if") || formatedCurrentLine.startsWith("else")) {
                const currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == ifDeclarationColumn) {
                    return index - 1;
                }
            }
        }
        return line
    }

}