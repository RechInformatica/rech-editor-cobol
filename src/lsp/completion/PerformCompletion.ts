import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'perform' clause
 */
export class PerformCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let startColumn = CompletionUtils.findWordStartWithinLine(column, _lines[_line]);
            let text = "perform" + CompletionUtils.fillSpacesFromWordReplacementEnd(35, column, _lines[_line], "perform") + "${0}" + CompletionUtils.separatorForColumn(startColumn);
            resolve(
                [{
                    label: 'PERFORM command',
                    detail: 'Generates PERFORM command for paragraph execution',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "pe perform",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}