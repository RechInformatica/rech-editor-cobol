import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { ToCompletion } from "./ToCompletion";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'to true' clause
 */
export class ToTrueCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const currentText = lines[line];
            let text = "";
            text = new ToCompletion().buildToTextWithIndent(currentText, column);
            text = text.concat("true");
            text = text.concat(CompletionUtils.separatorForColumn(CompletionUtils.getFirstCharacterColumn(currentText)));
            resolve(
                [{
                    label: 'TO TRUE command',
                    detail: 'Generates TO TRUE command and sets cursor on the end of the line',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "to true tt",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}