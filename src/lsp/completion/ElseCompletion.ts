import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { ElseFormatter } from "../formatter/ElseFormatter";

/** Else text to insert */
const ELSETEXT = "else,";

/**
 * Class to generate LSP Completion Items for 'else' clause
 */
export class ElseCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): CompletionItem[] {
        let textEdit = new ElseFormatter().generate(line, column, lines)[0];
        return [{
            label: 'Gerar comando ELSE',
            detail: 'Gera o comando ELSE em um bloco de IF.',
            textEdit: textEdit,
            filterText: "e el else" + textEdit.newText,
            insertTextFormat: InsertTextFormat.Snippet,
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}
