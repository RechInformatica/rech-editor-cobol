import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'try' block
 */
export class TryCompletion implements CompletionInterface {

    public generate(_line: number, _column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let text = "try";
            resolve(
                [{
                    label: 'TRY command',
                    detail: 'Generates TRY command for TRY/CATCH block',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "try",
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
