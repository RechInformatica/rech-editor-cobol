import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'exit cycle' clause
 */
export class ExitCycleCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "EXIT" + CompletionUtils.fillMissingSpaces(35, column + 3) + "PERFORM CYCLE" + CompletionUtils.separatorForColumn(column);
        return [{
            label: 'Gerar comando EXIT PERFORM CYCLE',
            detail: 'Gera o comando EXIT PERFORM CYCLE para reiniciar a iteração do laço',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "EXIT PERFORM CYCLE XC",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}