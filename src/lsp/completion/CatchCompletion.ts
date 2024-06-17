import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CatchFormatter } from "../formatter/CatchFormatter";

/**
 * Class to generate LSP Completion Items for Cobol 'catch' clause
 */
export class CatchCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const textEdit = new CatchFormatter().generate(line, column, lines)[0];
            textEdit.newText = textEdit.newText + " $1";
            resolve(
                [{
                    label: 'CATCH clause',
                    detail: 'Generates CATCH clause for TRY/CATCH block',
                    textEdit: textEdit,
                    insertTextFormat: InsertTextFormat.Snippet,
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
