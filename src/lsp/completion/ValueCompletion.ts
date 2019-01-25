import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { CobolVariable, Type } from "./CobolVariable";

// Cobol column for 'VALUE' clause declaration
const VALUE_COLUMN_DECLARATION = 51;

/**
 * Class to generate LSP Completion Items for Cobol value
 */
export class ValueCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let currentLineText = lines[line];
            let variable = CobolVariable.parseLine(currentLineText);
            let text = this.generateTextFromVariable(variable, column, currentLineText);
            resolve(
                [{
                    label: 'Complete VALUE declaration',
                    detail: 'VALUE clause will be inserted on the most appropriate place',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "value",
                    preselect: true,
                    kind: CompletionItemKind.Variable
                }]
            );
        });
    }

    /**
     * Generate the value text from the specified variable and column number
     *
     * @param variable Cobol variable
     * @param column column
     * @param currentLineText current line text
     */
    private generateTextFromVariable(variable: CobolVariable, column: number, currentLineText: string): string {
        let text = CompletionUtils.fillExactMissingSpaces(VALUE_COLUMN_DECLARATION, column, currentLineText);
        if (variable.getType() == Type.Alphanumeric) {
            text = text.concat("value is ${1:spaces}");
        } else {
            text = text.concat("value is ${1:zeros}");
            text = text.concat(this.createCompIfNeeded(variable));
        }
        text = text.concat(".");
        return text;
    }

    /**
     * Create comp or comp-x text if needed
     *
     * @param variable Cobol variable
     */
    private createCompIfNeeded(variable: CobolVariable): string {
        if (!variable.isDisplay()) {
            if (variable.getType() == Type.Decimal || variable.isAllowNegative()) {
                return " ${2:comp}";
            }
            return " ${2:comp-x}";
        }
        return "";
    }

}
