import { ActionInterface } from "./ActionInterface";
import { CodeAction, TextEdit, Range, Position } from "vscode-languageserver";
import { CobolVariable } from "../completion/CobolVariable";
import { ElementDocumentationExtractor } from "../../cobol/rechdoc/ElementDocumentationExtractor";
import { CobolDocParser } from "../../cobol/rechdoc/CobolDocParser";

/**
 * Class to generate Code Action to remove unused variable
 */
export class RemoveVariableAction implements ActionInterface {

    public generate(documentUri: string, line: number, _column: number, lines: string[]): Promise<CodeAction[]> {
        return new Promise((resolve) => {
            const textEdits = this.generateRemovalTextEdits(line, lines);
            resolve(
                [{
                    title: "Remove unused variable",
                    edit: { changes: { [documentUri]: textEdits } }
                }]
            );
        });
    }

    /**
     * Generates the TextEdit array related to the lines which will be removed
     *
     * @param line line where variable is currently declared
     * @param lines buffer lines
     */
    private generateRemovalTextEdits(line: number, lines: string[]): TextEdit[] {
        const firstRemovalLine = this.findFirstRemovalLine(line, lines);
        const lastRemovalLine = this.findLastRemovalLine(line, lines);
        const textEdits: TextEdit[] = [];
        textEdits.push({
            newText: "",
            range: Range.create(
                Position.create(firstRemovalLine - 1, lines[firstRemovalLine - 1].length),
                Position.create(lastRemovalLine, lines[lastRemovalLine].length)
            )
        });
        return textEdits;
    }

    /**
     * Returns the line number within buffer, which is related to the first line related to be removed.
     *
     * If the variable has no comment then return the line number itself.
     * Otherwise, if the variable has 'N' line comments, then returns:
     *    - 'Current line number' minus 'Number of comment lines'
     *
     * @param line line where variable is currently declared
     * @param lines buffer lines
     */
    private findFirstRemovalLine(line: number, lines: string[]): number {
        const comment = this.extractVariableComment(line, lines);
        const firstContextLine = line - comment.length;
        return firstContextLine;
    }

    /**
     * Extracts the variable comment.
     *
     * The reason why CobolVariable.getComment() method is not used is because, when it's an enum variable (level is 88) it assumes
     * the parent comment.
     *
     * For this CodeAction we need the exact Variable comment because we use this information to subtract lines to be removed above.
     *
     * @param line line where variable is currently declared
     * @param lines buffer lines
     */
    private extractVariableComment(line: number, lines: string[]): string[] {
        const docArray = new ElementDocumentationExtractor().getElementDocumentation(lines, line);
        const doc = new CobolDocParser().parseCobolDoc(docArray);
        return doc.comment;
    }

    /**
     * Returns the line number within buffer, which is related to the last line related to be removed.
     *
     * @param line line where variable is currently declared
     * @param lines buffer lines
     */
    private findLastRemovalLine(line: number, lines: string[]): number {
        const lastVariable = this.findVisuallyLowerVariable(line, lines);
        const position = lastVariable.getDeclarationPosition();
        if (position) {
            const lastContextLine = position.line;
            return lastContextLine;
        }
        return line;
    }

    /**
     * Returns the instance of the visually lower variable within source code.
     *
     * @param line line where variable is currently declared
     * @param lines buffer lines
     */
    private findVisuallyLowerVariable(line: number, lines: string[]): CobolVariable {
        let foundDeepestChild: boolean = false;
        let lastVariable = CobolVariable.parseLines(line, lines);
        while (!foundDeepestChild) {
            let children = lastVariable.getChildren();
            if (children && children.length > 0) {
                lastVariable = children[children.length - 1];
            } else {
                foundDeepestChild = true;
            }
        }
        return lastVariable;
    }

}
