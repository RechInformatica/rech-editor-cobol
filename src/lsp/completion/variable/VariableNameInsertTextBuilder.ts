import { CompletionItemKind } from "vscode-languageserver";
import { VariableInsertTextBuilder as VariableInsertTextBuilder } from "./VariableInsertTextBuilder";

/**
 * Implementation to build the insertText of variable completions with the variable name
 */
export class VariableNameInsertTextBuilder implements VariableInsertTextBuilder {

    /**
     * Builds the insertText of variable completion items
     *
     * @param variableName name of the variable to be suggested
     * @param isEnum tells wheter this variable represents an enum
     * @param _currentCommand command located on the line where cursor is currently positioned
     * @param _column column where cursor is currently positioned
     */
    buildInsertText(variableName: string, _isEnum: boolean, _currentCommand: string, _column: number): string {
        return variableName;
    }
}