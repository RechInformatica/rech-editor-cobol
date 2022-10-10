import { CompletionItem } from "vscode-languageserver";

/**
 * Interface to generate an array of Cobol completion items
 */
export interface CompletionInterface {

    /**
     * Generates an array of Completion Items
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lineText document lines
     */
    generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]>;
}
