import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { FinallyFormatter } from "../formatter/FinallyFormatter";

/**
 * Class to generate LSP Completion Items for Cobol 'finally' clause
 */
export class FinallyCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let textEdit = new FinallyFormatter().generate(line, column, lines)[0];
            textEdit.newText = textEdit.newText + "\n" + CompletionUtils.fillSpacesBetween(0, CompletionUtils.countSpacesAtBeginning(textEdit.newText)) + "   ";
            resolve(
                [{
                    label: 'FINALLY clause',
                    detail: 'Generates FINALLY clause for TRY/CATCH block',
                    textEdit: textEdit,
                    insertTextFormat: InsertTextFormat.Snippet,
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
