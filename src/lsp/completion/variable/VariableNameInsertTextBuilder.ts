import { VariableInsertTextBuilder } from "./VariableInsertTextBuilder";

/**
 * Implementation to build the insertText of variable completions with the variable name
 */
export class VariableNameInsertTextBuilder implements VariableInsertTextBuilder {

    /**
     * Builds the insertText of variable completion items
     *
     * @param variableName name of the variable to be suggested
     * @param _currentCommand command located on the line where cursor is currently positioned
     */
    buildInsertText(variableName: string, _currentCommand: string): string {
        return variableName;
    }
}