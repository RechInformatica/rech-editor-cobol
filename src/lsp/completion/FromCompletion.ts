import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for 'FROM' clause declaration
const FROM_COLUMN_DECLARATION = 30;

/**
 * Class to generate LSP Completion Items for Cobol 'from' clause
 */
export class FromCompletion implements CompletionInterface {

    public generate(line: number, column: number, lines: string[]): CompletionItem[] {
        let currentText = lines[line];
        let text = this.buildToText(currentText, column);
        return [{
            label: 'FROM command',
            detail: 'Generates FROM command and sets cursor on first variable',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "from",
            preselect: true,
            kind: CompletionItemKind.Keyword
        }];
    }

    /**
     * Builds and returns the 'to' text snippet
     */
    private buildToText(currentText: string, column: number): string {
        let text = "";
        if (column < FROM_COLUMN_DECLARATION) {
            text = text.concat(CompletionUtils.fillMissingSpaces(FROM_COLUMN_DECLARATION, column - 1));
        }
        text = text.concat("from");
        text = text.concat(CompletionUtils.fillMissingSpaces(35, column + text.length - 1));
        text = text.concat("${0}");
        text = text.concat(CompletionUtils.separatorForColumn(CompletionUtils.getFirstCharacterColumn(currentText)));
        return text;
    }

}