import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'add' clause
 */
export class AddCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let lineWithoutEnter = _lines[_line].replace("\r", "").replace("\n", "");
            let futureLine = CompletionUtils.replaceLastWord(lineWithoutEnter, "add");
            let text = "add" + CompletionUtils.fillSpacesFromWordEnd(20, column, futureLine) + "${0}";            
            resolve( [{
                label: 'ADD command',
                detail: 'Generates ADD command and sets cursor on the first variable',
                insertText: text,
                insertTextFormat: InsertTextFormat.Snippet,
                filterText: "add",
                preselect: true,
                kind: CompletionItemKind.Keyword
            }]);
        });
    }

}