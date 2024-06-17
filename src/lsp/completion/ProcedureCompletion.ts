import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { CobolVariable } from "./CobolVariable";


// Cobol column for a procedure declaration
const PROCEDURE_COLUMN_DECLARATION = 8;
// Prefix of returned variable
const PREFIX_OF_RETURNED_VARIABLE = "out";
// Valid variables levels to using in method
const VALID_LINKAGE_VARIABLES_TO_USING = [1, 77];
/**
 * Class to generate LSP Completion Items for Cobol 'procedure division' declaration
 */
export class ProcedureCompletion implements CompletionInterface {

    public generate(line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let text = CompletionUtils.fillSpacesFromWordStart(PROCEDURE_COLUMN_DECLARATION, 0, "") + "procedure division";
            const variables = this.findLinkageVariables(line, lines);
            if (variables.length > 0) {
                text = text + " using "
                let first = true;
                variables.forEach((variable) => {
                    if (VALID_LINKAGE_VARIABLES_TO_USING.includes(variable.getLevel())) {
                        if (first) {
                            first = false;
                        } else {
                            text = text + ", "
                        }
                        text = text + variable.getName()
                    }
                })
            }
            const returnedVariable = this.findReturnedVariable(line, lines);
            if (returnedVariable != undefined) {
                text = text + " returning " + returnedVariable.getName();
            }
            text = text + ".";
            resolve(
                [{
                    label: 'PROCEDURE division',
                    detail: 'Generates PROCEDURE division declaration',
                    insertText: text,
                    additionalTextEdits: [CompletionUtils.createCleanLineTextEdit(line)],
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "procedure",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

    /**
     * Find the returned variable from the current method
     *
     * @param line
     * @param lines
     */
    private findReturnedVariable(line: number, lines: string[]): CobolVariable | undefined {
        const workingLine = this.getWorkingLine(line, lines);
        if (workingLine == undefined) {
            return undefined;
        }
        for (let index = workingLine + 1; index < lines.length; index++) {
            const lineText = lines[index];
            if (!this.isCommentOrEmptyLine(lineText)) {
                if (this.isOtherSectionOrDivision("WORKING-STORAGE", lineText)) {
                    break;
                }
                try {
                    const variable = CobolVariable.parseLines(index, lines, {noChildren: true, noComment: true, noScope:true, ignoreMethodReturn:true, noSection:true})
                    if (variable.getName().startsWith(PREFIX_OF_RETURNED_VARIABLE)) {
                        return variable;
                    }
                } catch(e) {
                }
            }
        }
        return undefined;
    }

    /**
     * Find linkage variables
     *
     * @param line
     * @param lines
     */
    private findLinkageVariables(line: number, lines: string[]): CobolVariable[] {
        const linkageLine = this.getLinkageLine(line, lines);
        if (linkageLine == undefined) {
            return [];
        }
        const result = [];
        for (let index = linkageLine + 1; index < lines.length; index++) {
            const lineText = lines[index];
            if (!this.isCommentOrEmptyLine(lineText)) {
                if (this.isOtherSectionOrDivision("LINKAGE", lineText)) {
                    break;
                }
                try {
                    const variable = CobolVariable.parseLines(index, lines, {noChildren: true, noComment: true, noScope:true, ignoreMethodReturn:true, noSection:true})
                    result.push(variable)
                } catch(e) {
                }
            }
        }
        return result;
    }


    /**
     * Returns true if the specified text is a comment line or an empty line
     *
     * @param line
     */
    public isCommentOrEmptyLine(line: string): boolean {
        const trimmed = line.trim();
        return trimmed.startsWith("*>") || trimmed === "";
    }

    /**
     * Returns the most appropriate linkage section for procedure division
     *
     * @param line current line
     * @param lines buffer
     */
    private getLinkageLine(line: number, lines: string[]): number | undefined {
        for (let index = line; index >= 0; index--) {
            const current = lines[index];
            if (current.toUpperCase().includes(" LINKAGE ")) {
                return index;
            }
            if (this.isOtherSectionOrDivision("LINKAGE", current)) {
                return undefined;
            }
        }
        return undefined;
    }

    /**
     * Returns the most appropriate working section for procedure division
     *
     * @param line current line
     * @param lines buffer
     */
    private getWorkingLine(line: number, lines: string[]): number | undefined {
        for (let index = line; index >= 0; index--) {
            const current = lines[index];
            if (current.toUpperCase().includes(" WORKING-STORAGE ")) {
                return index;
            }
            if (this.isOtherSectionOrDivision("WORKING-STORAGE", current)) {
                return undefined;
            }
        }
        return undefined;
    }

    /**
     * Returns true if find other section or division
     *
     * @param lineText
     */
    private isOtherSectionOrDivision(currentSection: string, lineText: string): boolean {
        if (lineText.toUpperCase().includes(" " + currentSection + " ")) {
            return false;
        }
        if (lineText.toUpperCase().includes(" SECTION ")) {
            return false;
        }
        if (lineText.toUpperCase().includes(" DIVISION ")) {
            return false;
        }
        if (lineText.toUpperCase().includes(" METHOD-ID")) {
            return true;
        }
        if (lineText.toUpperCase().includes(" CLASS-ID")) {
            return true;
        }
        if (lineText.toUpperCase().includes(" PROGRAM-ID")) {
            return true;
        }
        if (lineText.toUpperCase().includes(" PROCEDURE ")) {
            return true;
        }
        if (lineText.toUpperCase().includes(" END ")) {
            return true;
        }
        return false;
    }

}
