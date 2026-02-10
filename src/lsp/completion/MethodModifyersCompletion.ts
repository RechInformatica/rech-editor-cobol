import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { ParserCobol } from "../../cobol/parsercobol";
import { CompletionUtils } from "../commons/CompletionUtils";
import { IndentUtils } from "../../indent/indentUtils";

/**
 * Class to generate LSP Completion Items for Cobol methods modifications
 */
export enum MethodModifier {
    RETURNING = "returning",
    PUBLIC = "public",
    PROTECTED = "protected",
    STATIC = "static",
    OVERRIDE = "override"
}

export class MethodModifyersCompletion implements CompletionInterface {

    private modification: MethodModifier | string;

    constructor(modification: MethodModifier | string) {
        this.modification = modification;
    }

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            // Get method header info (handles multi-line headers)
            const headerInfo = ParserCobol.getMethodHeaderInfo(lines, line, column);
            if (!headerInfo) {
                return resolve([]);
            }

            const { startLine, endLine, headerText } = headerInfo;

            // Extract the original indentation from the first line
            const firstLineText = lines[startLine];
            const indentation = firstLineText.match(/^\s*/)?.[0] || '';

            // Use the concatenated header text from getMethodHeaderInfo
            // Regex to capture (without indentation):
            // Group 1: method-id. + name
            // Group 2: parameters (including parentheses) - optional
            // Group 3: rest (modifiers and returning)
            const match = /^\s*(method-id\.\s+[\w-]+)(\([^)]*\))?\s*(.*)\.?\s*$/.exec(headerText);
            if (match == null) {
                return resolve([]);
            }

            const methodName = match[1]; // method-id. nextYear (without indentation)
            const parameters = match[2] || ''; // (inYear as INumericVar) or empty
            const restOfLine = match[3] || ''; // modifiers and returning

            // Separate existing modifiers into two groups:
            // 1. Returning clause (returning + variable + as + type)
            // 2. Simple modifiers (static, protected, public, override) - come AFTER returning
            const simpleModifiers: string[] = [];
            let returningClause = "";

            if (restOfLine.length > 0) {
                // Remove trailing period if it exists
                const cleanRest = restOfLine.replace(/\.\s*$/, '').trim();
                const tokens = cleanRest.split(/\s+/);

                let i = 0;
                while (i < tokens.length) {
                    const token = tokens[i].toLowerCase();

                    // If it's the modifier we're adding, skip it (avoid duplication)
                    if (this.modification.toLowerCase() === token) {
                        i++;
                        continue;
                    }

                    // If found returning, capture the entire returning clause
                    if (token === MethodModifier.RETURNING) {
                        const returningParts = [tokens[i]]; // returning
                        i++;
                        // Capture: variable + as + type
                        // Continue until finding a simple modifier or end of line
                        while (i < tokens.length && !this.verifyTerminatedModifier(tokens[i].toLowerCase())) {
                            returningParts.push(tokens[i]);
                            i++;
                        }
                        returningClause = returningParts.join(" ");
                        // Don't break here, continue processing modifiers that come after
                        continue;
                    }

                    // If it's a simple modifier (comes after returning)
                    if (this.verifyTerminatedModifier(token)) {
                        simpleModifiers.push(token);
                    }

                    i++;
                }
            }

            // Add the new modifier in the correct position
            if (this.modification === MethodModifier.RETURNING) {
                // If it's returning, overwrite the existing one
                returningClause = this.modification + " $1 as $2";
            } else if (!simpleModifiers.includes(this.modification.toLowerCase())) {
                // If it's a simple modifier, add to the list (if not already there)
                simpleModifiers.push(this.modification.toLowerCase());
            }

            // Build the final text in the correct order:
            // method-id. name(params) [returning clause] [simple modifiers].
            let finalText = methodName + parameters;
            if (returningClause.length > 0) {
                finalText += " " + returningClause;
            }
            if (simpleModifiers.length > 0) {
                finalText += " " + simpleModifiers.join(" ");
            }
            finalText += ".";

            // Normalize spaces and add original indentation
            finalText = indentation + finalText.replace(/\s+/g, ' ').trim();

            // Format the method declaration line (may break into multiple lines)
            const formattedLines = IndentUtils.formatMethodDeclarationLine(finalText, indentation);

            // Build additional text edits to clean all lines except the current one
            const additionalEdits = CompletionUtils.createMultiLineHeaderCleanupEdits(startLine, endLine, line);

            // If formatted into multiple lines, add them as additional edits
            if (formattedLines.length > 1) {
                // Add subsequent lines after the current line
                for (let i = 1; i < formattedLines.length; i++) {
                    additionalEdits.push({
                        range: {
                            start: { line: line + 1, character: 0 },
                            end: { line: line + 1, character: 0 }
                        },
                        newText: formattedLines[i] + '\n'
                    });
                }
            }

            // Use textEdit on current line and additionalTextEdits for other lines
            resolve(
                [{
                    label: 'Complete ' + this.modification.toUpperCase() + ' to method declaration',
                    detail: 'Generates the ' + this.modification.toUpperCase() + ' declaration to current method.',
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
                        newText: formattedLines[0]
                    },
                    additionalTextEdits: additionalEdits,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: lines[line],
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

    /**
     * Verifies if the modifier is a terminated one
     * @param text
     * @returns
     */
    private verifyTerminatedModifier(text: string): boolean {
        const terminatedModifiers = [MethodModifier.OVERRIDE, MethodModifier.STATIC, MethodModifier.PROTECTED, MethodModifier.PUBLIC];
        return terminatedModifiers.includes(text.trim().toLowerCase() as MethodModifier);
    }

}
