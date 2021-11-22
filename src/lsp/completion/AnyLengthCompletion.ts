import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { TextEdit } from "vscode";

/** End Cobol column */
const END_COBOL_COLUMN = 120;

/**
 * Class to generate LSP Completion Items for Cobol any length
 */
export class AnyLengthCompletion implements CompletionInterface {

    public generate(line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const regex = /pic\s+is\s+x.*\(.*/gi;
            let text = lines[line];
            let match = lines[line].match(regex);
            if (match != null) {
                text = lines[line].replace(regex, "pic x any length");
            } else {
                if (!text.endsWith(" ")) {
                    text = text + " ";
                }
                text = text + "any length";
            }
            text = text + " $1"
            let textEdit = {
                range: {
                  start: {
                    line: line,
                    character: 0
                  },
                  end: {
                    line: line,
                    character: END_COBOL_COLUMN
                  }
                },
                newText: ""
              };
            resolve(
                [{
                    label: 'Complete PIC X ANY LENGTH declaration',
                    detail: 'PIC X ANY LENGTH clause will be inserted on the most appropriate place.',
                    insertText: text,
                    additionalTextEdits: [textEdit],
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "x ( ) a any" + text,
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        })
    }

}
