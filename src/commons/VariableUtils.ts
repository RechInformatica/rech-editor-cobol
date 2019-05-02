import { ElementDocumentationExtractor } from "../cobol/rechdoc/ElementDocumentationExtractor";
import { CobolVariable } from "../lsp/completion/CobolVariable";

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

}
