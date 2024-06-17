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
        const startLine = line;
        const startColumn = lines[startLine].length;
        const endLine = this.findEndOfPerformUntilDeclaration(line, lines)
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
        const performDeclarationLine = lines[line];
        const performDeclarationColumn = CompletionUtils.countSpacesAtBeginning(performDeclarationLine);
        for (let index = line; index < lines.length; index++) {
            const currentLine = lines[index];
            if (currentLine.trimLeft().toLowerCase().startsWith("end-perform")) {
                const currentColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
                if (currentColumn == performDeclarationColumn) {
                    return index - 1;
                }
            }
        }
        return line
    }

}
