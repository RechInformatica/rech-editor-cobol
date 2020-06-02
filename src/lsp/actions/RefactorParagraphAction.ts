import { ActionInterface } from "./ActionInterface";
import { CodeAction, CodeActionKind, Command, TextEdit, Range, Position } from "vscode-languageserver";

/**
 * Class to generate refactor action for COBOL paragraph
 */
export class RefactorParagraphAction implements ActionInterface {

    generate(_documentUri: string, _line: number, _column: number, _lines: string[]): Promise<CodeAction[]> {
        return new Promise((resolve, _reject) => {
            const command: Command = {
                title: 'Extract to paragraph in current file',
                command: 'rech.editor.cobol.extractParagraph'
            };
            const action: CodeAction = {
                title: 'Extract to paragraph in current file',
                kind: CodeActionKind.RefactorExtract,
                command: command
            };
            resolve([action]);
        });
    }

}