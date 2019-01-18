import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'add' clause
 */
export class AddCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "add" + CompletionUtils.fillMissingSpaces(20, column + 2) + "${0}";
        return [{
            label: 'ADD command',
            detail: 'Generates ADD command and sets cursor on the first variable',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "add",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}