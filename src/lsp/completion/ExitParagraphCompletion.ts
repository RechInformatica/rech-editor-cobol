import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'exit paragraph' clause
 */
export class ExitParagraphCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "exit" + CompletionUtils.fillMissingSpaces(35, column + 3) + "paragraph" + CompletionUtils.separatorForColumn(column);
        return [{
            label: 'EXIT PARAGRAPH command',
            detail: 'Generates EXIT PARAGRAPH command to leave current paragraph',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "exit paragraph xh",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}