import { CompletionItemKind } from "vscode-languageserver";
import { VariableInsertTextBuilder } from "./VariableInsertTextBuilder";
import { CommandSeparatorInsertTextBuilder } from "./CommandSeparatorInsertTextBuilder";
import { CompletionUtils } from "../../commons/CompletionUtils";

/**
 * Implementation to build the insertText of variable completions with 'to true'
 */
export class ToTrueInsertTextBuilder implements VariableInsertTextBuilder {

    /**
     * Builds the insertText of variable completion items
     *
     * @param variableName name of the variable to be suggested
     * @param isEnum tells wheter this variable represents an enum
     * @param currentCommand command located on the line where cursor is currently positioned
     * @param column column where cursor is currently positioned
     */
    buildInsertText(variableName: string, isEnum: boolean, currentCommand: string, column: number): string {
        const commandSeparator = new CommandSeparatorInsertTextBuilder("to").buildInsertText(variableName, isEnum, currentCommand, column);
        // Should only suggest 'true' when is an enum variable
        // If it's an object reference, for exemplo, makes no sense to suggest 'true'
        if (isEnum) {
            return commandSeparator + "true" + CompletionUtils.separatorForColumn(CompletionUtils.getFirstCharacterColumn(currentCommand));
        }
        return commandSeparator;
    }
}