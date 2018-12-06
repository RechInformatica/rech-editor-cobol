import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'add' clause
 */
export class AddCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "ADD" + CompletionUtils.fillMissingSpaces(20, column + 2) + "${0}";
        return [{
            label: 'Gerar comando ADD',
            detail: 'Gera o comando ADD colocando o cursor na posição da primeira variável',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "ADD",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}