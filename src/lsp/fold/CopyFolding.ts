import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";

/**
* Class to folding Cobol copys declarations
*/
export class CopyFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^\s+copy\s+.+replacing.+/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        let currentLine = lines[line];
        let startLine = line;
        let startColumn = currentLine.toLowerCase().indexOf(".cpy") + 4;
        let endLine = this.findEndOfCopyDeclaration(line, lines)
        return {
            startLine: startLine,
            startCharacter: startColumn,
            endLine: endLine,
            endCharacter: lines[endLine].length
        }
    }

    /**
     * Find the end of the copy declaration
     *
     * @param line
     * @param lines
     */
    private findEndOfCopyDeclaration(line: number, lines: string[]): number {
        for (let index = line; index < lines.length; index++) {
            let currentLine = lines[index].trimRight();
            if (currentLine.trim().startsWith("*>")) {
                continue;
            }
            if (currentLine.endsWith(".")) {
                return index;
            }
        }
        return line;
    }

}