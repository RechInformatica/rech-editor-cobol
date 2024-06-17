import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";

/**
* Class to folding Cobol copys declarations
*/
export class CopyFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^ +copy\s+.+replacing.+/gi.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        const currentLine = lines[line];
        const startLine = line;
        const startColumn = currentLine.toLowerCase().indexOf(".cpy") + 4;
        const endLine = this.findEndOfCopyDeclaration(line, lines)
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
            const currentLine = lines[index].trimRight();
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
