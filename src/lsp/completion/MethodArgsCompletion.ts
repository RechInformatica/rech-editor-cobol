import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { ParserCobol } from "../../cobol/parsercobol";
import { IndentUtils } from "../../indent/indentUtils";

/**
 * Class to generate LSP Completion Items for Cobol methods modifications
 */
export class MethodArgsCompletion implements CompletionInterface {

    private readonly existsArgsDeclared: boolean;

    constructor(existsArgsDeclared: boolean) {
        this.existsArgsDeclared = existsArgsDeclared;
    }

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
         return new Promise((resolve) => {
            // Get method header info (handles multi-line headers)
            const headerInfo = ParserCobol.getMethodHeaderInfo(lines, line, column);
            if (!headerInfo) {
                return resolve([]);
            }
            const { startLine, endLine, headerText, cursorPositionColumn } = headerInfo;
            const lineText = headerText;
            const textBeforeCursor = lineText.substring(0, cursorPositionColumn);
            const textAfterCursor = lineText.substring(cursorPositionColumn);

            // Check if cursor is inside empty parentheses
            const insideEmptyParens = /method-id\.\s+[^\s.()]+\(\s*$/i.exec(textBeforeCursor) && /^\s*\)/.exec(textAfterCursor);

            if (insideEmptyParens) {
                // Suggest completing just the inside of parentheses
                resolve(
                    [{
                        label: 'ARGUMENTS for method declaration',
                        detail: 'Generates the arguments declaration for current method.',
                        insertText: "$1 as $2",
                        insertTextFormat: InsertTextFormat.Snippet,
                        filterText: "args var as type",
                        preselect: true,
                        commitCharacters: ['('],
                        kind: CompletionItemKind.Keyword
                    }]
                );
                return;
            }

            // Extract the original indentation from the first line
            const firstLineText = lines[startLine];
            const indentation = firstLineText.match(/^\s*/)?.[0] || '';

            const match = /(\s*method-id\.\s+)([^\s.()]+)\.?(.*)\.?/.exec(lineText.trimEnd())
            if (match == null || match.length < 2) {
                resolve([]);
                return;
            }
            let text = "";
            let label = 'Complete ARGUMENTS for method declaration';
            if (this.existsArgsDeclared) {
                label = 'Complete AS clause for method args declaration';
                text = this.getNewArgumentsText(match);
            } else {
                text = this.getInitialArgumentsText(match);
            }

            // Normalize spaces and add original indentation
            text = indentation + text.replace(/\s+/g, ' ').trim();

            // Format the method declaration line (may break into multiple lines)
            const formattedLines = IndentUtils.formatMethodDeclarationLine(text, indentation);

            // Create additional edits to clean multi-line headers
            const additionalEdits = CompletionUtils.createMultiLineHeaderCleanupEdits(startLine, endLine, line);

            // Build the final text to insert (all lines joined with \n for snippet placeholders to work)
            const finalNewText = formattedLines.join('\n');

            resolve(
                [{
                    label: label,
                    detail: 'Generates the arguments declaration for current method.',
                    textEdit: {
                        range: {
                            start: {
                                line: line,
                                character: 0
                            },
                            end: {
                                line: line,
                                character: lines[line].length
                            }
                        },
                        newText: finalNewText
                    },
                    additionalTextEdits: additionalEdits,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: lines[line],
                    preselect: true,
                    kind: CompletionItemKind.Keyword,
                    commitCharacters: ['(', ',']
                }]
            );
        });
    }

    /**
     * Gets the initial arguments text for method declaration
     * @param match
     * @returns
     */
    private getInitialArgumentsText(match: RegExpExecArray): string {
        const initialText = match[1] + match[2];
        let terminateText = "";
        if (match.length > 3) {
            const modifyers = match[3].split(/[\s.]/g);
            for (const modifyer of modifyers) {
                const modify = modifyer.replace(".", "");
                terminateText = terminateText + " " + modify;
            }
        }
        return initialText.trimEnd() + "($1 as $2) " + terminateText.trim() + ".";
    }

    /**
     * Gets the new arguments text for method declaration
     * @param match
     * @returns
     */
    private getNewArgumentsText(match: RegExpExecArray): string {
        const newArgs = ", $1 as $2)";
        return match[0].replace(/,\s*[as]*\s*\)/, newArgs);
    }

}
