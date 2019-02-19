/**
 * Interface to build the insertText of variable completion items
 */
export interface VariableInsertTextBuilder {

    /**
     * Builds the insertText of variable completion items
     *
     * @param variableName name of the variable to be suggested
     * @param currentCommand command located on the line where cursor is currently positioned
     * @param column column where cursor is currently positioned
     */
    buildInsertText(variableName: string, currentCommand: string, column: number): string;
}