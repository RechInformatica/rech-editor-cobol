import { ActionInterface } from "./ActionInterface";
import { CodeAction, TextEdit, Range, Position } from "vscode-languageserver";

/**
 * Class generating Code Action to fix incorrect class case
 */
export class FixClassCaseAction implements ActionInterface {

    constructor (private message: string) {}

    public generate(documentUri: string, line: number, _column: number, lines: string[]): Promise<CodeAction[]> {
        return new Promise((resolve) => {
            const textEdits = this.generateFixCaseTextEdits(line, lines);
            resolve(
                [{
                    title: "Fix class typo",
                    edit: { changes: { [documentUri]: textEdits } }
                }]
            );
        });
    }

    /**
     * Generates the TextEdit array related to the lines which will be fixed
     *
     * @param line line where variable is currently declared
     * @param lines buffer lines
     */
    private generateFixCaseTextEdits(line: number, lines: string[]): TextEdit[] {
        const textEdits: TextEdit[] = [];
        const lineText = lines[line];
        const newText = this.replaceClassName(lineText);
        textEdits.push({
            newText: newText,
            range: Range.create(
                Position.create(line, 0),
                Position.create(line, lines[line].length)
            )
        });
        return textEdits;
    }

    /**
     * Replaces the class name with appropriate class case
     * 
     * @param lineText text where class name will be replaced
     */
    private replaceClassName(lineText: string): string {
        const expectedClassName = this.message.match(/Esperado:\s+(\w+)/);
        if (expectedClassName && expectedClassName.length > 1) {
            const match = expectedClassName![1];
            const searchRegExp = new RegExp("([\\(\\s]+)(" + match + ")([\\s.:]+)", "gi")
            return lineText.replace(searchRegExp, "$1" + match + "$3");
        }
        return lineText;
    }

}
