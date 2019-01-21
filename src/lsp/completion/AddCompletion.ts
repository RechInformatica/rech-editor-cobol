import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'add' clause
 */
export class AddCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let text = "add" + CompletionUtils.fillMissingSpaces(20, column + 2) + "${0}";
            resolve( [{
                label: 'Gerar comando ADD',
                detail: 'Gera o comando ADD colocando o cursor na posição da primeira variável',
                insertText: text,
                insertTextFormat: InsertTextFormat.Snippet,
                filterText: "add",
                preselect: true,
                kind: CompletionItemKind.Keyword
            }]);
        })
    }

}