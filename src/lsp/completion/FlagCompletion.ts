import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { CobolVariable } from "./CobolVariable";

// Cobol column for 'VALUE' clause declaration
const VALUE_COLUMN = 51;

/**
 * Class to generate LSP Completion Items for Cobol flags
 */
export class FlagCompletion implements CompletionInterface {

    public generate(line: number, _column: number, lines: string[]): CompletionItem[] {
        let currentLineText = lines[line];
        let variable = CobolVariable.parseLine(currentLineText);
        let variableName, varsim, varnao = '';
        let posprefixo = variable.getName().indexOf("-");
        let prefixoName = variable.getName().substring(0, posprefixo + 1);
        variableName = variable.getName().substring(posprefixo + 1);
        if (variableName.length == 3) {
            varsim = 'sim';
            varnao = 'nao';
        } else {
            varsim = '-sim';
            varnao = '-nao';
        }
        if (prefixoName.toLowerCase() != "w-") {
            variableName = variable.getName();
        }
        let firstWordColumn = this.firstWordColumn(lines[line]);
        let flagsText = this.buildFlagsText(firstWordColumn, variableName, varsim, varnao);
        let snippetText = lines[line] + "\n" + flagsText;
        let item = this.createFlagsCompletionItem(line, _column, lines, variableName, snippetText);
        return [item];
    }

    /**
     * Returns the column of the first word on the specified line
     *
     * @param currentText current line text
     */
    private firstWordColumn(currentText: string): number {
        return currentText.search(/\S|$/) + 1;
    }

    /**
     * Build 88 variables (flags) text for snippet generation
     *
     * @param firstWordColumn column of the first word
     * @param variableName parent variable name
     * @param varsim variable of 'SIM' flag
     * @param varnao variable of 'NAO' flag
     */
    private buildFlagsText(firstWordColumn: number, variableName: string, varsim: string, varnao: string) {
        let text = "";
        text = text.concat(this.buildCurrentFlagText(firstWordColumn, variableName, varsim, 1))
        text = text.concat("\n");
        text = text.concat(this.buildCurrentFlagText(firstWordColumn, variableName, varnao, 2));
        return text;
    }

    /**
     * Builds the flag text
     *
     * @param firstWordColumn column where the first word is placed on variable declaration
     * @param variableName variable name
     * @param suffix suffix
     * @param value flag value
     */
    private buildCurrentFlagText(firstWordColumn: number, variableName: string, suffix: string, value: number): string {
        let text = "";
        text = text.concat(CompletionUtils.fillMissingSpaces(firstWordColumn, - 3) + "88 " + variableName + suffix);
        text = text.concat(CompletionUtils.fillMissingSpaces(VALUE_COLUMN, text.length));
        text = text.concat("value is " + value + ".");
        return text;
    }

    /**
     * Creates the completion item itself
     *
     * @param variableName parent variable name
     * @param text text to be inserted
     */
    private createFlagsCompletionItem(_line: number, _column: number, _lines: string[], _variableName: string, text: string): CompletionItem {
        return {
            label: '88 SIM/NAO variables',
            detail: 'Generates 88 SIM/NAO variables',
            filterText: _lines[_line],
            textEdit: {
                range: {
                    start: {
                        line: _line,
                        character: 0
                    },
                    end: {
                        line: _line,
                        character: 120
                    }
                },
                newText: text
            },
            insertTextFormat: InsertTextFormat.PlainText,
            kind: CompletionItemKind.Variable
        };
    }

}
