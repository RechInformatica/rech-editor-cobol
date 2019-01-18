import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { TextEdit } from "vscode-languageserver";

// Cobol column for a variable of evaluate declaration
const VAR_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol evaluate declarations
 */
export class EvaluateCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "evaluate";
        text += CompletionUtils.fillMissingSpaces(VAR_COLUMN_DECLARATION, column + text.length - 1) + "true";
        return [{
            label: 'EVALUATE command',
            detail: 'Generates the declaration of EVALUATE command',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "evaluate",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

}