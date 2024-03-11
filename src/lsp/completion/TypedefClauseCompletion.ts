import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { CobolVariable, Type } from "./CobolVariable";

// Cobol column for 'COMP/TYPEDEF' clause declaration
const COMP_TYPEDEF_COLUMN_DECLARATION = 66;
/**
 * Class to generate LSP Completion Items for Cobol picture
 */
export class TypedefClauseCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const currentLineText = lines[line];
            const variable = CobolVariable.parseLines(line, lines);
            const text = this.generateTextFromVariable(variable, column, currentLineText);
            resolve(
                [{
                    label: 'Complete TYPEDEF declaration',
                    detail: 'TYPEDEF clause will be inserted on the most appropriate place.',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "typedef",
                    preselect: true,
                    kind: CompletionItemKind.Variable
                }]
            );
        })
    }

    /**
     * Generate the typedef text from the specified variable and column number
     *
     * @param variable Cobol variable
     * @param column column
     * @param currentLineText current line text
     */
    private generateTextFromVariable(variable: CobolVariable, column: number, currentLineText: string): string {
        let text = CompletionUtils.fillSpacesFromWordStart(COMP_TYPEDEF_COLUMN_DECLARATION, column, currentLineText);
        text = text.concat(this.createCompIfNeeded(variable));
        text = text.concat("typedef.");
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
                return "${2:comp} ";
            }
            return "${2:comp-x} ";
        }
        return "";
    }

}
