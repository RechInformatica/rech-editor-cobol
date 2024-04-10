import { StatusBarItem, window, StatusBarAlignment } from "vscode";

/** Literals from paragraph and variables sources */
const PARAGRAPH_SOURCE_EXPANDED_FILE = "ParagraphSource - Expanded File";
const PARAGRAPH_SOURCE_LOCAL_FILE = "ParagraphSource - Local File";
const VARIABLE_SOURCE_EXPANDED_FILE = "VariableSource - Expanded File";
const VARIABLE_SOURCE_LOCAL_FILE = "VariableSource - Local File";
/** Paragraph status bar priority */
const PARAGRAPHSTATUSBARPRIORITY = 200;
/** Variable status bar priority */
const VARIABLESTATUSBARPRIORITY = 199;
/** Variable status bar priority */
const CLASSSTATUSBARPRIORITY = 198;

export class SourceOfCompletions {

    private static paragraphStatusBar: StatusBarItem | undefined;
    private static variableStatusBar: StatusBarItem | undefined;
    private static paragraphSource: "local" | "expanded" = "expanded";
    private static variableSource: "local" | "expanded" = "expanded";
    private static isVisible: boolean = false;

    /**
     * Build the statusBar to controll the source of completions
     */
    public static buildStatusBar() {
        SourceOfCompletions.paragraphStatusBar = window.createStatusBarItem(StatusBarAlignment.Right, PARAGRAPHSTATUSBARPRIORITY)
        SourceOfCompletions.paragraphStatusBar.command = "rech.editor.cobol.changeParagraphSource"
        SourceOfCompletions.paragraphStatusBar.text = PARAGRAPH_SOURCE_EXPANDED_FILE
        //
        SourceOfCompletions.variableStatusBar = window.createStatusBarItem(StatusBarAlignment.Right, VARIABLESTATUSBARPRIORITY)
        SourceOfCompletions.variableStatusBar.command = "rech.editor.cobol.changeVariableSource"
        SourceOfCompletions.variableStatusBar.text = VARIABLE_SOURCE_EXPANDED_FILE
    }

    /**
     * Show the statusBar to the source of completions
     */
    public static show() {
        if (SourceOfCompletions.isVisible) {
            return;
        }
        SourceOfCompletions.isVisible = true;
        if (SourceOfCompletions.paragraphStatusBar) {
            SourceOfCompletions.paragraphStatusBar.show()
        }
        if (SourceOfCompletions.variableStatusBar) {
            SourceOfCompletions.variableStatusBar.show()
        }
    }

    /**
     * Toggle the paragraph source
     */
    public static toggleTheParagraphSource() {
        if (SourceOfCompletions.paragraphSource == "local") {
            SourceOfCompletions.paragraphSource = "expanded";
            SourceOfCompletions.paragraphStatusBar!.text = PARAGRAPH_SOURCE_EXPANDED_FILE
        } else {
            SourceOfCompletions.paragraphSource = "local";
            SourceOfCompletions.paragraphStatusBar!.text = PARAGRAPH_SOURCE_LOCAL_FILE
        }
    }

    /**
     * Toggle the variable source
     */
    public static toggleTheVariableSource() {
        if (SourceOfCompletions.variableSource == "local") {
            SourceOfCompletions.variableSource = "expanded";
            SourceOfCompletions.variableStatusBar!.text = VARIABLE_SOURCE_EXPANDED_FILE
        } else {
            SourceOfCompletions.variableSource = "local";
            SourceOfCompletions.variableStatusBar!.text = VARIABLE_SOURCE_LOCAL_FILE
        }
    }

    /**
     * Returns the selected source of paragraphs completions
     */
    public static getSourceOfParagraphCompletions() {
        return SourceOfCompletions.paragraphSource;
    }

    /**
     * Returns the selected source of variabless completions
     */
    public static getSourceOfVariableCompletions() {
        return SourceOfCompletions.variableSource;
    }

}
