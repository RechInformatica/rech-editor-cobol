import { TextEdit } from "vscode-languageserver";

/**
 * Interface to generate an array of Cobol Text Edits used to format text
 * in Language Server Provider
 */
export interface FormatterInterface {

    /**
     * Generates an array of Text Edits for source code formatting
     * 
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lineText document lines
     */
    generate(line: number, column: number, lines: string[]): TextEdit[];
}