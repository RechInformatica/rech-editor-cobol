import { VariableInsertTextBuilder } from "./VariableInsertTextBuilder";
import { CommandSeparatorInsertTextBuilder } from "./CommandSeparatorInsertTextBuilder";
import { CommaDotInsertTextBuilder } from "./CommaDotInsertTextBuilder";
import { CompletionUtils } from "../../commons/CompletionUtils";

/**
 * Implementation to build the insertText of variable completions with 'to true'
 */
export class ToTrueInsertTextBuilder implements VariableInsertTextBuilder {

    /**
     * Builds the insertText of variable completion items
     *
     * @param variableName name of the variable to be suggested
     * @param currentCommand command located on the line where cursor is currently positioned
     * @param column column where cursor is currently positioned
     */
    buildInsertText(variableName: string, currentCommand: string, column: number): string {
        const commandSeparator = new CommandSeparatorInsertTextBuilder("to").buildInsertText(variableName, currentCommand, column);
        return commandSeparator + "true" + CompletionUtils.separatorForColumn(CompletionUtils.getFirstCharacterColumn(currentCommand));
    }
}