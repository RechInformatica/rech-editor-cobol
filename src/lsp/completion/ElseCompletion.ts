import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { ElseFormatter } from "../formatter/ElseFormatter";

/** Else text to insert */
const ELSETEXT = "else,";

/**
 * Class to generate LSP Completion Items for 'else' clause
 */
export class ElseCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        let textEdit = new ElseFormatter().generate(line, column, lines)[0];
        return new Promise((resolve) => {
            resolve(
                [{
                    label: 'ELSE command',
                    detail: 'Generates ELSE command to be used with IF block',
                    textEdit: textEdit,
                    filterText: "e el else" + textEdit.newText,
                    insertTextFormat: InsertTextFormat.Snippet,
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
