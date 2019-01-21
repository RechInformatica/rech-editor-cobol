import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for 'TO' clause declaration
const TO_COLUMN_DECLARATION = 30;

/**
 * Class to generate LSP Completion Items for Cobol 'to' clause
 */
export class ToCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let currentText = lines[line];
            let text = this.buildToTextWithTabStop(currentText, column);
            resolve(
                [{
                    label: 'TO command',
                    detail: 'Generates TO command and sets cursor on first variable',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "to",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

    /**
     * Builds and returns the 'to' text snippet with tabstop
     *
     * @param currentText current line text
     * @param column current cursor column
     */
    private buildToTextWithTabStop(currentText: string, column: number): string {
        let text = this.buildToTextWithIndent(column);
        text = text.concat("${0}");
        text = text.concat(CompletionUtils.separatorForColumn(CompletionUtils.getFirstCharacterColumn(currentText)));
        return text;
    }

    /**
     * Builds and returns the 'to' text snippet witn indent and without tabstop
     *
     * @param column current cursor column
     */
    public buildToTextWithIndent(column: number): string {
        let text = "";
        if (column < TO_COLUMN_DECLARATION) {
            text = text.concat(CompletionUtils.fillMissingSpaces(TO_COLUMN_DECLARATION, column - 1));
        }
        text = text.concat("to");
        text = text.concat(CompletionUtils.fillMissingSpaces(35, column + text.length - 1));
        return text;
    }

}