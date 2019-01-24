import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
* Class to folding Cobol evaluate blocks
*/
export class EvaluateFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^\s+evaluate\s+.*/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        let startLine = line;
        let startColumn = lines[startLine].length;
        let endLine = this.findEndOfEvaluateDeclaration(line, lines)
        return {
            startLine: startLine,
            startCharacter: startColumn,
            endLine: endLine,
            endCharacter: lines[endLine].length
        }
    }

    /**
     * Find the end of the evaluate block
     *
     * @param line
     * @param lines
     */
    private findEndOfEvaluateDeclaration(line: number, lines: string[]): number {
        let ifDeclarationLine = lines[line];
        let ifDeclarationColumn = CompletionUtils.countSpacesAtBeginning(ifDeclarationLine);
        for (let index = line; index < lines.length; index++) {
            let currentLine = lines[index];
            if (currentLine.trimLeft().toLowerCase().startsWith("end-evaluate")) {
                let currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == ifDeclarationColumn) {
                    return index - 1;
                }
            }
        }
        return line
    }

}