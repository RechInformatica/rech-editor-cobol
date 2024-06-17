import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for 'FROM' clause declaration
const FROM_COLUMN_DECLARATION = 30;

/**
 * Class to generate LSP Completion Items for Cobol 'from' clause
 */
export class FromCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const currentText = lines[line];
            const text = this.buildFromText(currentText, column);
            resolve(
                [{
                    label: 'FROM command',
                    detail: 'Generates FROM command and sets cursor on first variable',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "from",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

    /**
     * Builds and returns the 'from' text snippet
     */
    private buildFromText(currentText: string, column: number): string {
        let text = this.buildFromTextWithIndent(currentText, column);
        text = text.concat("${0}");
        text = text.concat(CompletionUtils.separatorForColumn(CompletionUtils.getFirstCharacterColumn(currentText)));
        return text;
    }

    /**
     * Builds and returns the 'from' text snippet witn indent and without tabstop
     *
     * @param currentText current line text
     * @param column current cursor column
     */
    private buildFromTextWithIndent(currentText: string, column: number): string {
        const wordReplacement =  CompletionUtils.fillSpacesFromWordStart(FROM_COLUMN_DECLARATION, column, currentText) + "from";
        const futureLine = CompletionUtils.replaceLastWord(currentText, wordReplacement);
        const finalText = wordReplacement + CompletionUtils.fillSpacesFromWordEnd(35, futureLine.length, futureLine);
        return finalText;
    }

}
