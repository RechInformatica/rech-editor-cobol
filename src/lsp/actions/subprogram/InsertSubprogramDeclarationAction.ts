import { ActionInterface } from "../ActionInterface";
import { CodeAction, TextEdit, Range, Position } from "vscode-languageserver";
import { CompletionUtils } from "../../commons/CompletionUtils";
import { SubprogramUtils } from "./SubprogramUtils";

/** Max number of lines to be considered on the top or the bottom of buffer lines */
const MAX_SEARCH_LINES = 2000;
/** RegEx to detect copy declaration */
const GENERAL_COPY_REGEX = /\s+copy\s+........\.cpy\./;

/**
 * Class to generate Code Action to insert subprogram dependencies
 */
export class InsertSubprogramDeclarationAction implements ActionInterface {

    public generate(documentUri: string, line: number, _column: number, lines: string[]): Promise<CodeAction[]> {
        return new Promise((resolve) => {
            const subprogramName = SubprogramUtils.extractSubprogramName(line, lines);
            if (subprogramName.length == 0) {
                resolve([]);
            }
            if (this.isSubprogramAlreadyDeclared(subprogramName, lines)) {
                resolve([]);
            }
            const action: CodeAction = this.generateCodeAction(documentUri, subprogramName, lines);
            resolve([action]);
        });
    }

    /**
     * Returns true if the subprogram any subprogram copy is already declared
     *
     * @param subprogramName subprogram name
     * @param lines buffer lines
     */
    private isSubprogramAlreadyDeclared(subprogramName: string, lines: string[]): boolean {
        const regex = this.createSubprogramDeclarationRegex(subprogramName);
        const maxTopSearch = this.getMaxSearchIterations(lines);
        if (CompletionUtils.applyRegexFromBeginning(regex, maxTopSearch, lines)) {
            return true;
        }
        const maxBottomSearch = this.getBottomSearchIterations(lines);
        return CompletionUtils.applyRegexFromEnd(regex, maxBottomSearch, lines);
    }

    /**
     * Creates a RegEx instance to check wheter subprogram is declared or not
     *
     * @param subprogramName subprogram name
     */
    private createSubprogramDeclarationRegex(subprogramName: string): RegExp {
        const textRegex = "\\s+copy\\s+" + subprogramName + "(wf|pf)\\.cpy";
        const regex = new RegExp(textRegex);
        return regex;
    }

    /**
     * Returns the bottom number of line to be iterated
     *
     * @param lines
     */
    private getBottomSearchIterations(lines: string[]): number {
        return lines.length - this.getMaxSearchIterations(lines);
    }

    /**
     * Returns the max number of line to be iterated
     *
     * @param lines
     */
    private getMaxSearchIterations(lines: string[]): number {
        return lines.length > MAX_SEARCH_LINES ? MAX_SEARCH_LINES : lines.length;
    }

    /**
     * Performs the Code Action generation
     *
     * @param documentUri current document URI
     * @param subprogramName subprogram name
     * @param lines buffer lines
     */
    private generateCodeAction(documentUri: string, subprogramName: string, lines: string[]): CodeAction {
        const textEdits = this.generateTextEdits(subprogramName, lines);
        return {
            title: "Insert 'wf / pf / fecarq / cancel' dependencies",
            edit: { changes: { [documentUri]: textEdits } }
        };
    }

    /**
     * Generates the TextEdit array related to the lines which will be removed
     *
     * @param subprogramName subprogram name
     * @param lines buffer lines
     */
    private generateTextEdits(subprogramName: string, lines: string[]): TextEdit[] {
        const textEdits: TextEdit[] = [];
        this.addTextEditIfNeeded(textEdits, this.createParametersCopyTextEdit(subprogramName, lines));
        this.addTextEditIfNeeded(textEdits, this.createProcedureCopyTextEdit(subprogramName, lines));
        this.addTextEditIfNeeded(textEdits, this.createCloseProgramsTextEdit(subprogramName, lines));
        this.addTextEditIfNeeded(textEdits, this.createCancelTextEdit(subprogramName, lines));
        return textEdits;
    }

    /**
     * Adds the specified TextEdit if needed
     *
     * @param textEdits array of all text edits
     * @param currentEdit text edit to be added
     */
    private addTextEditIfNeeded(textEdits: TextEdit[], currentEdit: TextEdit | undefined): void {
        if (currentEdit) {
            textEdits.push(currentEdit);
        }
    }

    /**
     * Creates a TextEdit related to parameters copy (xxxxxxwf.cpy)
     *
     * @param lines buffer lines
     */
    private createParametersCopyTextEdit(subprogramName: string, lines: string[]): TextEdit | undefined {
        const newText = SubprogramUtils.generateCopyDeclaration(subprogramName, "wf");
        const declarationLine = this.findParametersCopyLine(lines);
        return this.createTextEdit(declarationLine, newText);
    }

    /**
     * Returns the line where parameters copy declaration should be inserted within source buffer
     *
     * @param line current line
     * @param lines buffer lines
     */
    private findParametersCopyLine(lines: string[]): number {
        let lastGeneralCopyLine: number = 0;
        let lastParametersCopyLine: number = 0;
        const maxTopSearch = this.getMaxSearchIterations(lines);
        for (let i = 0; i < maxTopSearch; i++) {
            const currentLineText = lines[i];
            const section = /\s+(linkage|procedure)\s+section./.exec(currentLineText);
            if (section) {
                break;
            }
            let result: RegExpExecArray | null = null;
            result = GENERAL_COPY_REGEX.exec(currentLineText);
            if (result) {
                lastGeneralCopyLine = i;
            }
            result = /\s+copy\s+\w\w\w\w\w\wwf.cpy\./.exec(currentLineText);
            if (result) {
                lastParametersCopyLine = i;
            }
        }
        if (lastParametersCopyLine > 0) {
            return lastParametersCopyLine;
        }
        return lastGeneralCopyLine;
    }

    /**
     * Creates a TextEdit related to parameters copy (xxxxxxwf.cpy)
     *
     * @param line current line
     * @param lines buffer lines
     */
    private createProcedureCopyTextEdit(subprogramName: string, lines: string[]): TextEdit | undefined {
        const newText = SubprogramUtils.generateCopyDeclaration(subprogramName, "pf");
        const declarationLine = this.findProcedureCopyLine(lines);
        return this.createTextEdit(declarationLine, newText);
    }

    /**
     * Returns the line where procedure copy declaration should be inserted within source buffer
     *
     * @param lines buffer lines
     */
    private findProcedureCopyLine(lines: string[]): number {
        let lastGeneralCopyLine: number = 0;
        let lastProcedureCopyLine: number = 0;
        const maxBottomSearch = this.getBottomSearchIterations(lines);
        for (let i = lines.length - 1; i > maxBottomSearch; i--) {
            const currentLineText = lines[i];
            let result: RegExpExecArray | null = null;
            if (CompletionUtils.isTheParagraphDeclaration(currentLineText)) {
                break;
            }
            if (lastGeneralCopyLine == 0) {
                result = GENERAL_COPY_REGEX.exec(currentLineText);
                if (result) {
                    lastGeneralCopyLine = i;
                }
            }
            result = /\s+copy\s+\w\w\w\w\w\wpf.cpy\./.exec(currentLineText);
            if (result) {
                lastProcedureCopyLine = i;
                break;
            }
        }
        if (lastProcedureCopyLine > 0) {
            return lastProcedureCopyLine;
        }
        return lastGeneralCopyLine;
    }

    /**
     * Creates a TextEdit related to Close Programs call (fecarq)
     *
     * @param lines buffer lines
     */
    private createCloseProgramsTextEdit(subprogramName: string, lines: string[]): TextEdit | undefined {
        const command = SubprogramUtils.generateParagraphPerform(subprogramName + "-cancel");
        let declarationLine = this.findParagraphPerform("\\w\\w\\w\\w\\w\\w-cancel", lines);
        if (declarationLine == 0) {
            declarationLine = this.findParagraphDeclaration("fecha-programas", lines);
        }
        return this.createTextEdit(declarationLine, command);
    }

    /**
     * Creates a TextEdit related to Cancel call (cancel)
     *
     * @param lines buffer lines
     */
    private createCancelTextEdit(subprogramName: string, lines: string[]): TextEdit | undefined {
        const command = SubprogramUtils.generateParagraphPerform(subprogramName + "-fecarq");
        let declarationLine = this.findParagraphPerform("\\w\\w\\w\\w\\w\\w-fecarq", lines);
        if (declarationLine == 0) {
            declarationLine = this.findParagraphPerform("arq-close-all", lines);
        }
        if (declarationLine == 0) {
            declarationLine = this.findParagraphDeclaration("fecha-arquivos", lines);
        }
        return this.createTextEdit(declarationLine, command);
    }

    /**
     * Returns the line where the specified paragraph is declared.
     * This method starts searching from the end of the file.
     *
     * @param name paragraph name
     * @param lines buffer lines
     */
    private findParagraphDeclaration(name: string, lines: string[]): number {
        let declarationLine: number = 0;
        const regExText = "\\s+" + name + ".";
        const declaratioRegEx = new RegExp(regExText);
        const maxBottomSearch = this.getBottomSearchIterations(lines);
        for (let i = lines.length - 1; i > maxBottomSearch; i--) {
            const currentLineText = lines[i];
            const result = declaratioRegEx.exec(currentLineText);
            if (result) {
                declarationLine = i;
                break;
            }
        }
        return declarationLine;
    }

    /**
     * Returns the line where the specified paragraph is performed.
     * This method starts searching from the end of the file.
     *
     * @param name paragraph regex name
     * @param lines buffer lines
     */
    private findParagraphPerform(name: string, lines: string[]): number {
        let declarationLine: number = 0;
        const regExText = "\\s+perform\\s+" + name + "\\.";
        const declaratioRegEx = new RegExp(regExText);
        const maxBottomSearch = this.getBottomSearchIterations(lines);
        for (let i = lines.length - 1; i > maxBottomSearch; i--) {
            const currentLineText = lines[i];
            const result = declaratioRegEx.exec(currentLineText);
            if (result) {
                declarationLine = i;
                break;
            }
        }
        return declarationLine;
    }

    /**
     * Creates a TextEdit on the specified line with the specified text
     *
     * @param line line where TextEdit will be created
     * @param newText new text
     */
    private createTextEdit(declarationLine: number, newText: string): TextEdit | undefined {
        if (declarationLine > 0) {
            return {
                newText: newText,
                range: Range.create(
                    Position.create(declarationLine + 1, 0),
                    Position.create(declarationLine + 1, 0)
                )
            };
        }
        return undefined;
    }
}
