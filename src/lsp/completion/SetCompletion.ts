import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'set' clause
 */
export class SetCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "SET" + CompletionUtils.fillMissingSpaces(20, column + 2) + "${0}";
        return [{
            label: 'Gera comando SET',
            detail: 'Gera o comando SET colocando o cursor na posição da primeira variável',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "SET",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}