import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { ParserCobol } from "../../cobol/parsercobol";

/**
* Class to folding Cobol paragraph declarations
*/
export class ParagraphFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        return /^\s\s\s\s\s\s\s([\w\-]+)\.(?:\s*\*\>.*)?/gm.test(line);
    }

    fold(line: number, lines: string[]): FoldingRange {
        let currentLine = lines[line];
        let startLine = line;
        let startColumn = currentLine.length;
        let endLine = this.findEndOfParagraphDeclaration(line, lines)
        return {
            startLine: startLine,
            startCharacter: startColumn,
            endLine: endLine,
            endCharacter: lines[endLine].length
        }
    }

    /**
     * Find the end of the paragraph declaration
     *
     * @param line
     * @param lines
     */
    private findEndOfParagraphDeclaration(line: number, lines: string[]): number {
        for (let index = line + 1; index < lines.length; index++) {
            let currentLine = lines[index];
            if (currentLine.trim().startsWith("*>")) {
                continue;
            }
            if (this.mustFolding(currentLine)) {
                return this.startOfDeclaration(index - 1, lines);
            }
            if (/\s+[A-Za-z0-9-]+\s+section\./.test(currentLine)) {
                return this.startOfDeclaration(index - 1, lines);
            }
        }
        return line;
    }

    /**
     * Returns the line of the start paragraph declaration, considering the documentation
     *
     * @param line
     * @param lines
     */
    private startOfDeclaration(line: number, lines: string[]): number {
        if (line <= 0) {
            return line;
        }
        let hasDocumentation = false;
        for (let i = line; i > 0; i--) {
            let currentLine = lines[i].trimLeft();
            if (hasDocumentation && !currentLine.startsWith("*>")) {
                return i;
            }
            if (currentLine.startsWith("*>")) {
                hasDocumentation = true;
            }
            if (!hasDocumentation) {
                return line;
            }
        }
        return line;
    }

}