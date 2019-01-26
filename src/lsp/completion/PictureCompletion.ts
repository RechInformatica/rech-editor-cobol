import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for 'PIC' clause declaration
const PIC_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol picture
 */
export class PictureCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let text =  CompletionUtils.fillSpacesFromWordStart(PIC_COLUMN_DECLARATION, column, _lines[_line]) + "pic is $1($2)";
            resolve(
                [{
                    label: 'Complete PIC declaration',
                    detail: 'PIC clause will be inserted on the most appropriate place.',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "pic",
                    preselect: true,
                    commitCharacters: ['x', '9', 'z', 'b', ' '],
                    kind: CompletionItemKind.Variable
                }]
            );
        })
    }

}