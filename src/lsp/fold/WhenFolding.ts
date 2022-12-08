import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
* Class to folding Cobol when blocks
*/
export class WhenFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^ +when\s+.*/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        let startLine = this.findStartLine(line, lines);
        let startColumn = lines[startLine].length;
        let endLine = this.findEndOfWhenDeclaration(line, lines)
        return {
            startLine: startLine,
            startCharacter: startColumn,
            endLine: endLine,
            endCharacter: lines[endLine].length
        }
    }

    /**
     * Find the start line of the 'when' block
     *
     * @param line
     * @param lines
     */
    private findStartLine(line: number, lines: string[]): number {
        for (let index = line; index <= lines.length; index++) {
            let currentLine  = lines[index];
            let nextLine  = lines[index + 1];
            let words = currentLine.trim().split(" ");
            let nextWords = nextLine.trim().split(" ");
            let firtsWordOfTheNextLine = nextWords[0]
            let lastWord = words[words.length - 1]
            if (CompletionUtils.isOperator(firtsWordOfTheNextLine) || CompletionUtils.isOperator(lastWord)) {
                continue;
            }
            return index
        }
        return line;
    }

    /**
     * Find the end of the when block
     *
     * @param line
     * @param lines
     */
    private findEndOfWhenDeclaration(line: number, lines: string[]): number {
        let whenDeclarationLine = lines[line];
        let whenDeclarationColumn = CompletionUtils.countSpacesAtBeginning(whenDeclarationLine);
        for (let index = line + 1; index < lines.length; index++) {
            let currentLine = lines[index];
            let formatedCurrentLine = currentLine.trimLeft().toLowerCase();
            if (formatedCurrentLine.startsWith("when")) {
                let currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == whenDeclarationColumn) {
                    return this.findTheStartLineOfNextClause(index, lines) - 1;
                }
            }
            if (formatedCurrentLine.startsWith("end-evaluate")) {
                let currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == whenDeclarationColumn - 3) {
                    return index - 1
                }
            }
        }
        return line
    }

    /**
     * Find the start line of the next clause declaration considering the documentation of this
     *
     * @param currenLinePosition
     * @param lines
     */
    private findTheStartLineOfNextClause(currenLinePosition: number, lines: string[]): number {
        let hasDocumentation = false;
        for (let index = currenLinePosition - 1; index > 0; index--) {
            let currentLine = lines[index].trimLeft();
            if (hasDocumentation && !currentLine.startsWith("*>")) {
                return index + 1;
            }
            if (!hasDocumentation && currentLine.startsWith("*>")) {
                hasDocumentation = true;
            }
            if (!hasDocumentation) {
               return currenLinePosition;
            }
        }
        return currenLinePosition;
    }

}