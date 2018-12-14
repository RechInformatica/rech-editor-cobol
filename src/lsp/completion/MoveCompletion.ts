import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'move' clause
 */
export class MoveCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "move" + CompletionUtils.fillMissingSpaces(20, column + 3) + "${0}";
        return [{
            label: 'Gerar comando MOVE',
            detail: 'Gera o comando MOVE colocando o cursor na posição da primeira variável',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "move mv",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}