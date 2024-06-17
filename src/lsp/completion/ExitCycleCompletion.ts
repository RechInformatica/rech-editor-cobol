import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'exit cycle' clause
 */
export class ExitCycleCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const startColumn = CompletionUtils.findWordStartWithinLine(column, _lines[_line]);
            const text = "exit" + CompletionUtils.fillSpacesFromWordReplacementEnd(35, column, _lines[_line], "exit") + "perform cycle" + CompletionUtils.separatorForColumn(startColumn);
            resolve(
                [{
                    label: 'EXIT PERFORM CYCLE command',
                    detail: 'Generates EXIT PERFORM CYCLE command to restart loop iteration',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "exit perform cycle xc",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        })
    }

}
