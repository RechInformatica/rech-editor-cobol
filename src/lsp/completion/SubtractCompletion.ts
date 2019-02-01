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
                    label: 'SUBTRACT command',
                    detail: 'Generates SUBTRACT command and sets cursor on first variable',
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