import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for a variable of evaluate declaration
const VAR_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol evaluate declarations
 */
export class EvaluateCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "EVALUATE";
        text += CompletionUtils.fillMissingSpaces(VAR_COLUMN_DECLARATION, column + text.length - 1) + "${1:TRUE},$2";
        return [{
            label: 'Gerar comando EVALUATE',
            detail: 'Gera a declaração do comando evaluate.',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "EVALUATE",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}