import { CodeAction } from "vscode-languageserver";

/**
 * Interface to generate an array of Cobol code actions
 */
export interface ActionInterface {

    /**
     * Generates an array of Code Actions
     *
     * @param documentUri current document URI
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lineText document lines
     */
    generate(documentUri: string, line: number, column: number, lines: string[]): Promise<CodeAction[]>;
}