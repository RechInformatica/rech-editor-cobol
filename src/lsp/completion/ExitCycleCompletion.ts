import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'exit cycle' clause
 */
export class ExitCycleCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "exit" + CompletionUtils.fillMissingSpaces(35, column + 3) + "perform cycle" + CompletionUtils.separatorForColumn(column);
        return [{
            label: 'EXIT PERFORM CYCLE command',
            detail: 'Generates EXIT PERFORM CYCLE command to restart loop iteration',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "exit perform cycle xc",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}