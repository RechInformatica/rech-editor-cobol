import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
* Class to folding Cobol else blocks
*/
export class ElseFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^ +else,.*/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        const startLine = line;
        const startColumn = lines[startLine].length;
        const endLine = this.findEndOfElseDeclaration(line, lines)
        return {
            startLine: startLine,
            startCharacter: startColumn,
            endLine: endLine,
            endCharacter: lines[endLine].length
        }
    }

    /**
     * Find the end of the else block
     *
     * @param line
     * @param lines
     */
    private findEndOfElseDeclaration(line: number, lines: string[]): number {
        const elseDeclarationLine = lines[line];
        const elseDeclarationColumn = CompletionUtils.countSpacesAtBeginning(elseDeclarationLine);
        for (let index = line; index < lines.length; index++) {
            const currentLine = lines[index];
            if (currentLine.trimLeft().toLowerCase().startsWith("end-if")) {
                const currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == elseDeclarationColumn) {
                    return index - 1;
                }
            }
        }
        return line
    }

}
