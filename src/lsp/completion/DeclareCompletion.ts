import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'declare' clause
 */
export class DeclareCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const startColumn = CompletionUtils.findWordStartWithinLine(column, _lines[_line]);
            const text = "declare" + CompletionUtils.fillSpacesFromWordReplacementEnd(35, column, _lines[_line], "declare") + "${1} as ${2}" + CompletionUtils.separatorForColumn(startColumn);
            resolve(
                [{
                    label: 'DECLARE command',
                    detail: 'Generates DECLARE command for data item declaration',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "de decl declare",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
