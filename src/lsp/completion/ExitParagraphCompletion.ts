import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'exit paragraph' clause
 */
export class ExitParagraphCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let startColumn = CompletionUtils.findWordStartWithinLine(column, _lines[_line]);
            let text = "exit" + CompletionUtils.fillSpacesFromWordReplacementEnd(35, column, _lines[_line], "exit") + "paragraph" + CompletionUtils.separatorForColumn(startColumn);
            resolve(
                [{
                    label: 'EXIT PARAGRAPH command',
                    detail: 'Generates EXIT PARAGRAPH command to leave current paragraph',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "exit paragraph xh",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}