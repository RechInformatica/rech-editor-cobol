import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { Configuration } from "../../helpers/configuration";
import { getConfig } from "../server";

const PARAM_COLUMN_DECLARATION = 35;

export class PerformVaryingCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const performClause = "perform";
            const varyingClause = "varying";
            const untilClause = "until";
            const startColumn = CompletionUtils.findWordStartWithinLine(column, _lines[_line]);

            // Check if JInt substitution is enabled in configuration
            getConfig<boolean[]>("enableJIntSubstitution").then(enableJIntSubstitution => {

                /**
                 * Creates a snippet for the loop variable.
                 * If JInt substitution is enabled, uses regex to automatically suggest the JInt type.
                 * The pattern checks if the variable name does not contain a hyphen, starts with a letter, and may contain letters, numbers, or underscores.
                 * If it matches, "as JInt" is added to the variable name, making it easier to declare a typed variable in the snippet.
                 */
                const variableSnippet = enableJIntSubstitution
                    ? "${1/^((?!.*-)[a-zA-Z][a-zA-Z0-9_]*)$/$1 as JInt/}"
                    : "${1}";

                let text = "";
                text = text.concat(performClause).concat("\n");
                text = text.concat(CompletionUtils.fillSpacesBetween(startColumn, startColumn + 3) + varyingClause);
                text = text.concat(
                    CompletionUtils.fillSpacesOrSingleSpace(startColumn + varyingClause.length + 2, PARAM_COLUMN_DECLARATION - 1) +
                    variableSnippet + " from ${2:} by ${3:1}\n"
                );
                text = text.concat(CompletionUtils.fillSpacesBetween(startColumn, startColumn + 6) + untilClause);
                text = text.concat(
                    CompletionUtils.fillSpacesOrSingleSpace(startColumn + untilClause.length + 5, PARAM_COLUMN_DECLARATION - 1) +
                    "${1} ${4}"
                );

                const endPerform: TextEdit[] = [this.createEndPerformTextEdit(_line + 1, startColumn)];

                const detailText = enableJIntSubstitution
                    ? 'Generates declaration of PERFORM VARYING loop (auto-detects variable type)'
                    : 'Generates declaration of PERFORM VARYING loop';

                resolve(
                    [{
                        label: 'PERFORM VARYING loop',
                        detail: detailText,
                        insertText: text,
                        insertTextFormat: InsertTextFormat.Snippet,
                        additionalTextEdits: endPerform,
                        filterText: "pb perform varying",
                        preselect: true,
                        kind: CompletionItemKind.Keyword,
                        data: 8
                    }]
                );
            });
        });
    }

    private createEndPerformTextEdit(line: number, column: number): TextEdit {
        let text = CompletionUtils.fillSpacesBetween(1, column) + "end-perform";
        text = text.concat(CompletionUtils.separatorForColumn(column));
        text = text.concat("\n");
        return {
            range: {
                start: { line, character: 0 },
                end: { line, character: 0 }
            },
            newText: text
        };
    }
}
