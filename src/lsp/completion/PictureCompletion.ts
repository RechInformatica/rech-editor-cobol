import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for 'PIC' clause declaration
const PIC_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol picture
 */
export class PictureCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = CompletionUtils.fillMissingSpaces(PIC_COLUMN_DECLARATION, column - 1) + "pic is $1($2)";
        return [{
            label: 'Complete PIC declaration',
            detail: 'PIC clause will be inserted on the most appropriate place.',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "pic",
            preselect: true,
            commitCharacters: ['x', '9', 'z', 'b', ' '],
            kind: CompletionItemKind.Variable
        }];
    }

}