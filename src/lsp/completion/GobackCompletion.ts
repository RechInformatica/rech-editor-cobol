import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'goback' command
 */
export class GobackCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const startColumn = CompletionUtils.findWordStartWithinLine(column, _lines[_line]);
            const text = "goback" + CompletionUtils.separatorForColumn(startColumn);
            resolve(
                [{
                    label: 'GOBACK command',
                    detail: 'Generates GOBACK command to return control to the calling program',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "goback gb",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
