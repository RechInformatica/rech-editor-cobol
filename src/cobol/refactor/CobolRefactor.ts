import { Editor } from "../../editor/editor";
import { commands, Position, Uri } from "vscode";
import { CompletionUtils } from "../../lsp/commons/CompletionUtils";
import { COLUNA_C } from "../colunas";
import { ParserCobol } from "../parsercobol";
import { IndentCommands } from '../../indent/indentCommands';
import { BufferSplitter } from "rech-ts-commons";

/**
 * Class to perform refactor operations on COBOL source
 */
export class CobolRefactor {

    private editor: Editor;
    private parser: ParserCobol;

    constructor() {
        this.editor = new Editor();
        this.parser = new ParserCobol();
    }

    /**
     * Extracts the selected source to a new paragraph on current file
     */
    async extractParagraph(): Promise<void> {
        const name = 'new-paragraph';
        const currentRowNumber = this.editor.getCurrentRow();
        //
        // Retrieves the lines where user has selection
        //
        this.editor.selectWholeLines();
        const selectedLines = BufferSplitter.split(this.editor.getSelectionBuffer()[0]);
        const firstCommandColumn = this.findFirstCommandColumn(selectedLines);
        //
        // Builds the new paragraph declaration (with paragraph content) and
        // the respective 'perform' command for this paragraph
        //
        const declaration = this.buildParagraphDeclaration(name, selectedLines);
        const perform = this.buildParagraphPerform(name, firstCommandColumn);
        //
        // Replaces the selected lines with the 'perform' command
        //
        await this.editor.replaceSelection(perform);
        //
        // Looks for the last line of the current paragraph, where the
        // new paragraph will be declared
        //
        const lastLine = this.getLastParagraphLine();
        this.editor.setCursor(lastLine + 1, 0);
        //
        // Declares the paragraph itself with it's content and indents it
        //
        await this.editor.insertText(declaration);
        await IndentCommands.indentWholeParagraph();
        //
        // Fires rename action on the paragraph name of 'perform' command
        //
        const fileName = this.editor.getCurrentFileName();
        const position = new Position(currentRowNumber, COLUNA_C - 1);
        await commands.executeCommand('editor.action.rename', [
            Uri.file(fileName),
            position
        ]);
    }

    /**
     * Returns the column of first character given the specified lines.
     * This method ignores comment and empty lines.
     *
     * @param selectedLines lines to find the column of first command
     */
    private findFirstCommandColumn(selectedLines: string[]): number {
        let firstCharacterColumn = 0;
        for (let i = 0; i < selectedLines.length; i++) {
            const lineText = selectedLines[i];
            if (!ParserCobol.isCommentOrEmptyLine(lineText)) {
                firstCharacterColumn = CompletionUtils.getFirstCharacterColumn(lineText);
                break;
            }
        }
        return firstCharacterColumn;
    }

    /**
     * Returns the number of the last line on current paragraph
     */
    private getLastParagraphLine(): number {
        // This is the position where next paragraph declaration is located
        const nextParagraphDeclaration = this.editor.getNextParagraphPosition();
        //
        // We still need to look back and ignore comment lines above it, which
        // are documentation of next paragraph
        //
        let currentLineNumber = nextParagraphDeclaration.line;
        let foundLastLine = false;
        while (!foundLastLine && currentLineNumber >= 0) {
            currentLineNumber--;
            const lineText = this.editor.getLine(currentLineNumber);
            if (!ParserCobol.isCommentOrEmptyLine(lineText)) {
                foundLastLine = true;
            }
        }
        return currentLineNumber;
    }

    /**
     * Builds the 'perform' command to the new paragraph
     *
     * @param name paragraph name
     * @param initialColumn initial column where 'perform' command will be inserted
     */
    private buildParagraphPerform(name: string, initialColumn: number): string {
        const command = CompletionUtils.fillSpacesBetween(0, initialColumn) + 'perform';
        const content = command + CompletionUtils.fillSpacesOrSingleSpace(command.length, COLUNA_C - 1) + name + CompletionUtils.separatorForColumn(initialColumn) + "\n";
        return content;
    }

    /**
     * Builds the paragraph declaration itself with it's content
     *
     * @param name paragraph name
     * @param sourceLines lines representing the paragraph body
     */
    private buildParagraphDeclaration(name: string, sourceLines: string[]): string {
        let content = '';
        content = content + '      *>--------------------------------------------------------------------------------------------------------------<*\n';
        content = content + '       ' + name + '.\n'
        content = content + sourceLines.join("\n");
        return content;
    }

}
