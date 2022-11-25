import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
* Class to folding Cobol perform until blocks
*/
export class PerformUntilFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^ +perform\s+until\s+exit,?/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        let startLine = line;
        let startColumn = lines[startLine].length;
        let endLine = this.findEndOfPerformUntilDeclaration(line, lines)
        return {
            startLine: startLine,
            startCharacter: startColumn,
            endLine: endLine,
            endCharacter: lines[endLine].length
        }
    }

    /**
     * Find the end of the perform until block
     *
     * @param line
     * @param lines
     */
    private findEndOfPerformUntilDeclaration(line: number, lines: string[]): number {
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