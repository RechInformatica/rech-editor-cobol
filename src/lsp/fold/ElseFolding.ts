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
        let startLine = line;
        let startColumn = lines[startLine].length;
        let endLine = this.findEndOfElseDeclaration(line, lines)
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
        let elseDeclarationLine = lines[line];
        let elseDeclarationColumn = CompletionUtils.countSpacesAtBeginning(elseDeclarationLine);
        for (let index = line; index < lines.length; index++) {
            let currentLine = lines[index];
            if (currentLine.trimLeft().toLowerCase().startsWith("end-if")) {
                let currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == elseDeclarationColumn) {
                    return index - 1;
                }
            }
        }
        return line
    }

}