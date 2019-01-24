import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
* Class to folding Cobol perform whit test blocks
*/
export class PerformWithTest implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^\s+perform(?:with\s+test\s+(?:after|before)|\s+)$/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        let startLine = this.findStartOfPerformDeclaration(line, lines);
        let startColumn = lines[startLine].length;
        let endLine = this.findEndOfPerformDeclaration(line, lines)
        return {
            startLine: startLine,
            startCharacter: startColumn,
            endLine: endLine,
            endCharacter: lines[endLine].length
        }
    }

    /**
     * Returns the start line of perform declaration
     *
     * @param line
     * @param lines
     */
    private findStartOfPerformDeclaration(line: number, lines: string[]): number {
        for (let index = line + 1; index <= lines.length; index++) {
            if (!this.belongsToThePerformDeclarationBlock(index, lines)) {
                return index - 1;
            }
        }
        return line
    }

    /**
     * Returns true if the line content belongs to te perform declaration block
     *
     * @param currentLine
     */
    private belongsToThePerformDeclarationBlock(currentLine: number, lines: string[]) {
        let lineContent = lines[currentLine].trim();
        if (lineContent == "") {
            return true;
        }
        if (lineContent.startsWith("varying")) {
            return true;
        }
        if (lineContent.startsWith("until")) {
            return true;
        }
        if (currentLine > 0) {
            let previousLineWords = lines[currentLine - 1].trim().split(" ");
            if (CompletionUtils.isOperator(previousLineWords[previousLineWords.length - 1])) {
                return true;
            }
        }
        let lineWords = lineContent.split(" ");
        if (CompletionUtils.isOperator(lineWords[0])) {
            return true;
        }
        return false;
    }

    /**
     * Find the end of the perform block
     *
     * @param line
     * @param lines
     */
    private findEndOfPerformDeclaration(line: number, lines: string[]): number {
        let performDeclarationLine = lines[line];
        let performDeclarationColumn = CompletionUtils.countSpacesAtBeginning(performDeclarationLine);
        for (let index = line; index < lines.length; index++) {
            let currentLine = lines[index];
            if (currentLine.trimLeft().toLowerCase().startsWith("end-perform")) {
                let currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == performDeclarationColumn) {
                    return index - 1;
                }
            }
        }
        return line
    }

}