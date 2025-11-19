import { ActionInterface } from "./ActionInterface";
import { CodeAction, TextEdit, Range, Position } from "vscode-languageserver";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate Code Action to replace Comma by Dot at the end of the line
 */
export class ReplaceCommaByDotAction implements ActionInterface {

    public generate(documentUri: string, line: number, _column: number, lines: string[]): Promise<CodeAction[]> {
        return new Promise((resolve) => {
            const textEdits = this.generateRemovalTextEdits(line, lines);
            resolve(
                [{
                    title: "Replace , with .",
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
        const textEdits: TextEdit[] = [];
        const lineText = lines[line];
        const newText = this.insertStaticClause(lineText);
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
     * Inserts 'static' clause at the end of method declaration
     *
     * @param lineText current line text with method declaration
     */
    private insertStaticClause(lineText: string): string {
        let newText = lineText.trimRight();
        newText = newText.slice(0, -1);
        newText = newText.concat(".");
        return newText;
    }

}
