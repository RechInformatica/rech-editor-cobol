import { CobolFoldInterface } from "./cobolFoldInterface";
import { FoldingRange } from "vscode-languageserver";
import { ParserCobol } from "../../cobol/parsercobol";
import { CobolVariable } from "../completion/CobolVariable";

/**
* Class to folding Cobol variables declarations
*/
export class VariableFolding implements CobolFoldInterface {

    mustFolding(line: string): boolean {
        const match = new ParserCobol().getDeclaracaoVariavelIgnoreReplace(line)
        if (match) {
            return true;
        }
        return false;
    }

    fold(line: number, lines: string[]): FoldingRange {
        const currentLine = lines[line];
        const startLine = line;
        const startColumn = currentLine.length;
        const endLine = this.findEndOfVariableDeclaration(line, lines)
        return {
            startLine: startLine,
            startCharacter: startColumn,
            endLine: endLine,
            endCharacter: lines[endLine].length
        }
    }

    /**
     * Find the end of the variable declaration
     *
     * @param line
     * @param lines
     */
    private findEndOfVariableDeclaration(line: number, lines: string[]): number {
        const pattern = /\s+(\d\d)\s+.*/;
        const currentVariableLevel = pattern.exec(lines[line])![1]
        for (let index = line + 1; index < lines.length; index++) {
            const currentLine = lines[index];
            if (currentLine.trim().startsWith("*>")) {
                continue;
            }
            const match = pattern.exec(currentLine)
            if (match) {
                const level = match[1];
                if (level <= currentVariableLevel || CobolVariable.isEspecialVariableType(level)) {
                    return this.startOfDeclaration(index - 1, lines);
                }
            } else {
                return this.startOfDeclaration(index - 1, lines);
            }
        }
        return line;
    }

    /**
     * Returns the line of the start variable declaration, considering the documentation
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
            const currentLine = lines[i].trimLeft();
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
