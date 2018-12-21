import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for declare the parameters of perform
const PARAM_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol evaluate declarations
 */
export class PerformVaryingCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        const performClause = "perform";
        const varyingClause = "varying";
        const untilClause = "until";
        let text = "";
        text = text.concat(performClause).concat("\n");
        text = text.concat(CompletionUtils.fillMissingSpaces(column + 4, column) + varyingClause);
        text = text.concat(CompletionUtils.fillMissingSpaces(PARAM_COLUMN_DECLARATION, column + varyingClause.length + 2) + "${1} from ${2:} by ${3:1}\n");
        text = text.concat(CompletionUtils.fillMissingSpaces(column + 7, column) + untilClause);
        text = text.concat(CompletionUtils.fillMissingSpaces(PARAM_COLUMN_DECLARATION, column + untilClause.length + 5) + "${1} ${4}");
        let endPerform: TextEdit[] = [this.createEndPerformTextEdit(_line + 1, column)];
        return [{
            label: 'Gerar declaração de laço variando o índice (perform varying).',
            detail: 'Gera a declaração de laço variando o índice (perform varying).',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            additionalTextEdits: endPerform,
            filterText: "pb",
            preselect: true,
            kind: CompletionItemKind.Keyword,
            data: 8
        }];
    }

    /**
     * Creates a TextEdit with the 'end-perform' clause already formatted
     *
     * @param line line where the 'end-perform' clause will be inserted
     * @param column column where the 'end-perform' clause will be inserted
     */
    private createEndPerformTextEdit(line: number, column: number): TextEdit {
        let text = CompletionUtils.fillMissingSpaces(column, 0) + "end-perform";
        text = text.concat(CompletionUtils.separatorForColumn(column));
        text = text.concat("\n");
        return {
            range: {
                start: {
                    line: line,
                    character: 0
                },
                end: {
                    line: line,
                    character: 0
                }
            },
            newText: text
        };
    }

}