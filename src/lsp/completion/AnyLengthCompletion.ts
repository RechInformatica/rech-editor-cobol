import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol any length
 */
export class AnyLengthCompletion implements CompletionInterface {

    public generate(line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const regex = /pic(?:\s+is)?\s+x.*\(.*/gi;
            let text = lines[line];
            const match = lines[line].match(regex);
            if (match != null) {
                text = lines[line].replace(regex, "pic x any length");
            } else {
                if (!text.endsWith(" ")) {
                    text = text + " ";
                }
                text = text + "any length";
            }
            text = text + " $1"
            resolve(
                [{
                    label: 'Complete PIC X ANY LENGTH declaration',
                    detail: 'PIC X ANY LENGTH clause will be inserted on the most appropriate place.',
                    insertText: text,
                    additionalTextEdits: [CompletionUtils.createCleanLineTextEdit(line)],
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "x ( ) a any" + text,
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        })
    }

}
