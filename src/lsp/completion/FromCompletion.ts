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
            label: 'Gerar comando FROM',
            detail: 'Gera o comando FROM colocando o cursor na posição da primeira variável',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "FROM",
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
        text = text.concat("FROM");
        text = text.concat(CompletionUtils.fillMissingSpaces(35, column + text.length - 1));
        text = text.concat("${0}");
        text = text.concat(CompletionUtils.separatorForColumn(this.getFirstCharacterColumn(currentText)));
        return text;
    }

    /**
     * Returns the number of the first character on the specified line
     */
    private getFirstCharacterColumn(lineText: string): number {
        for (let i = 0; i < lineText.length; i++) {
            if (lineText.charAt(i) !== " ") {
                return i;
            }
        }
        return 0;
    }

}