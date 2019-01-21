import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'subtract' clause
 */
export class SubtractCompletion implements CompletionInterface {

    public generate(_line: number, _column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let text = "subtract ${0}";
            resolve(
                [{
                    label: 'Gerar comando SUBTRACT',
                    detail: 'Gera o comando SUBTRACT colocando o cursor na posição da primeira variável',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "subtract",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}