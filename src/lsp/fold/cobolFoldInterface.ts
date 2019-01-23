import { FoldingRange } from "vscode-languageserver";

/**
 * Interface to returns an array of Cobol foldingRange used to folding text
 * in Language Server Provider
 */
export interface CobolFoldInterface {

    /**
     * Fold cobol source code
     *
     * @param line line number where cursor is positioned
     * @param lines document lines
     */
    fold(line: number, lines: string[]): FoldingRange;

    /**
     *
     *
     * @param line
     */
    mustFolding(line: string): boolean
}