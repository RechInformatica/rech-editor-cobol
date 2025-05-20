import { ElementDocumentationExtractor } from "../cobol/rechdoc/ElementDocumentationExtractor";
import { CobolVariable } from "../lsp/completion/CobolVariable";
import { Scan } from "rech-ts-commons";

/**
 * Utility class for Cobol variables
 */
export class VariableUtils {

    /* Max number of lines to look for a flag parent */
    public static MAX_LINES_FLAG_PARENT: number = 20;

    /**
     * Returns the variable description array, or if it's a 88 boolean flag, returns it's parent
     * description array
     *
     * @param lines buffer lines
     * @param variableLine current variable line within buffer lines
     */
    public static findVariableDocArray(lines: string[], variableLine: number): string[] {
        const enumVar = VariableUtils.isBooleanFlag(lines[variableLine]);
        const docArray = new ElementDocumentationExtractor().getElementDocumentation(lines, variableLine);
        if (docArray.length == 0 && enumVar) {
            return this.findParentDocArray(lines, variableLine);
        }
        return docArray;
    }

    /**
     * Returns the documentation array for the parent variable when it's a 88 boolean variable
     *
     * @param lines buffer lines
     * @param variableLine current variable line within buffer lines
     */
    private static findParentDocArray(lines: string[], variableLine: number): string[] {
        const parentLine = VariableUtils.findBooleanParentVariableLine(variableLine, lines);
        return new ElementDocumentationExtractor().getElementDocumentation(lines, parentLine);
    }

    /**
     * Returns the boolean flag parent location
     *
     * @param lineNumber current line number
     * @param bufferLines lines on the buffer
     */
    private static findBooleanParentVariableLine(lineNumber: number, bufferLines: string[]): number {
        if (bufferLines.length < VariableUtils.MAX_LINES_FLAG_PARENT) {
            return lineNumber;
        }
        for (let i = 1; i <= VariableUtils.MAX_LINES_FLAG_PARENT; i++) {
            const currentLine = bufferLines[lineNumber - i];
            if (!VariableUtils.isBooleanFlag(currentLine) && !currentLine.trim().startsWith("*>")) {
                return lineNumber - i;
            }
        }
        return lineNumber;
    }

    /**
     * Returns true if the specified line represents boolean flag
     *
     * @param currentLine current line text
     */
    private static isBooleanFlag(currentLine: string): boolean {
        const upperLine = currentLine.toUpperCase();
        if (/\s+(88).*/.exec(upperLine)) {
            return true;
        }
        return false;
    }

    /**
     * Parse the lines and find the section from specific line
     *
     * @param lines
     * @param line
     */
    public static findVariableSection(lines: string[], line: number): "working-storage" | "linkage" | "file" | undefined {
        let section: "working-storage" | "linkage" | "file"| undefined;
        for (let i = line; i >= 0; i--) {
            const currentLine = lines[i];
            let match;
            match = /^(.*)section[\.\,]?\s*$/i.exec(currentLine)
            if (!section && match) {
                section = <"working-storage" | "linkage" | "file"> match[1];
                break;
            }
        }
        return section;
    }

    /**
     * Parse the lines and find the scope from specific line
     *
     * @param lines
     * @param line
     */
    public static findVariableScope(lines: string[], line: number): string {
        let section: string | undefined;
        for (let i = line; i >= 0; i--) {
            const currentLine = lines[i];
            let match;
            match = /^ *(repository|factory|object)[\.\,]?\s*$/i.exec(currentLine)
            if (match) {
                section = match[1].toLowerCase();
                break;
            }
            match = /^ *method-id[\.]?\s(.+)[\.]?\s*$/i.exec(currentLine)
            if (match) {
                section = match[1].split(" ")[0];
                break;
            }
            if (/^.*data\s+division[\.\,]?\s*$/i.test(currentLine) || /^ *end method[\.]?/i.test(currentLine)) {
                break;
            }
        }
        return section ? section : "object";
    }

    /**
     * Returns true if the variable scope is local
     *
     * @param varible
     */
    public static isLocalScope(varibleScope: CobolVariable | string) {
        let scope;
        if (varibleScope instanceof CobolVariable) {
            scope = varibleScope.getScope();
        } else {
            scope = varibleScope
        }
        return scope != "object" && scope != "factory" && scope != "repository"
    }

    /**
     * Returns true if the variable is a return variable from his method
     *
     * @param varible
     */
    public static isMethodReturn(varible: string, lines: string[], line: number): boolean {
        for (let i = line; i < lines.length; i++) {
            if (lines[i].trim().startsWith("procedure")) {
                return new RegExp(`returning\\s+${varible}`, "gi").test(lines[i]);
            }
        }
        return false;
    }


    /**
     * Determines the method number (occurrence) in which a given COBOL variable is declared.
     *
     * @param variable - The COBOL variable whose method number is to be determined.
     * @param lines - An array of strings representing the lines of the COBOL source code.
     * @returns The method number (1-based index) where the variable is declared, or -1 if the
     *          variable's declaration position or scope (method name) is not found.
     *
     */
    public static getMethodNumber(variable: CobolVariable, lines: string[]): number {
        let methodCount = 0;

        const position = variable.getDeclarationPosition();
        if (!position) {
            return methodCount;
        }

        const methodName = variable.getScope();
        if (!methodName) {
            return methodCount;
        }

        const regex = new RegExp(`method-id\\.\\s+${methodName}`, "gi");

        new Scan(lines.join("\n")).scan(regex, (iterator: any) => {
            methodCount++;
            if (iterator.row >= position.line) {
                iterator.stop();
            }
        });

        return methodCount;
    }

}
