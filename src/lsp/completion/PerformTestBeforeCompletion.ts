import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for declare the parameters of perform
const PARAM_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol evaluate declarations
 */
export class PerformTestBeforeCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        const performClause = "PERFORM";
        const varyingClause = "VARYING";
        const untilClause = "UNTIL";
        let text = "";
        text = text.concat(performClause);
        text = text.concat(CompletionUtils.fillMissingSpaces(PARAM_COLUMN_DECLARATION, column + performClause.length - 1) + "WITH TEST BEFORE\n");
        text = text.concat(CompletionUtils.fillMissingSpaces(column + 4, column) + varyingClause);
        text = text.concat(CompletionUtils.fillMissingSpaces(PARAM_COLUMN_DECLARATION, column + varyingClause.length + 2) + "${1:_index_} FROM ${2:_start_} BY ${3:1}\n");
        text = text.concat(CompletionUtils.fillMissingSpaces(column + 7, column) + untilClause);
        text = text.concat(CompletionUtils.fillMissingSpaces(PARAM_COLUMN_DECLARATION, column + untilClause.length + 5) + "${1:_index_} ${4:_stop_condition_}");
        let endPerform: TextEdit[] = [this.createEndPerformTextEdit(_line + 1, column)];
        return [{
            label: 'Gera a declaração de laço com teste antes (with test before).',
            detail: 'Gera a declaração de laço com teste antes (with test before).',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            additionalTextEdits: endPerform,
            filterText: "PB",
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
        let text = CompletionUtils.fillMissingSpaces(column, 0) + "END-PERFORM";
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