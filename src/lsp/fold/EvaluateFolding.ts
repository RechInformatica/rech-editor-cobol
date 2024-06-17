import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
* Class to folding Cobol evaluate blocks
*/
export class EvaluateFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^ +evaluate\s+.*/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        const startLine = line;
        const startColumn = lines[startLine].length;
        const endLine = this.findEndOfEvaluateDeclaration(line, lines)
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
        const ifDeclarationLine = lines[line];
        const ifDeclarationColumn = CompletionUtils.countSpacesAtBeginning(ifDeclarationLine);
        for (let index = line; index < lines.length; index++) {
            const currentLine = lines[index];
            if (currentLine.trimLeft().toLowerCase().startsWith("end-evaluate")) {
                const currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == ifDeclarationColumn) {
                    return index - 1;
                }
            }
        }
        return line
    }

}
