import { ActionInterface } from "./ActionInterface";
import { CodeAction, TextEdit, Range, Position } from "vscode-languageserver";

/**
 * Class to generate Code Action for useless parentheses
 */
export class UselessParenthesesAction implements ActionInterface {

    public generate(documentUri: string, line: number, _column: number, lines: string[]): Promise<CodeAction[]> {
        return new Promise((resolve) => {
            const textEdits = this.generateRemovalTextEdits(line, lines);
            resolve(
                [{
                    title: "Remove useless parentheses",
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
        const newText = lineText.replace("()", "");
        textEdits.push({
            newText: newText,
            range: Range.create(
                Position.create(line, 0),
                Position.create(line, lines[line].length)
            )
        });
        return textEdits;
    }

}
