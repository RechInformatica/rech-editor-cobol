import { StatusBarItem, window, StatusBarAlignment } from "vscode";

/** Paragraph status bar priority */
const PARAGRAPHSTATUSBARPRIORITY = 200;
/** Variable status bar priority */
const VARIABLESTATUSBARPRIORITY = 199;
/** Variable status bar priority */
const CLASSSTATUSBARPRIORITY = 198;

export class SourceOfCompletions {

    private static paragraphStatusBar: StatusBarItem | undefined;
    private static variableStatusBar: StatusBarItem | undefined;
    private static classStatusBar: StatusBarItem | undefined;
    private static paragraphSource: "local" | "expanded" = "local";
    private static variableSource: "local" | "expanded" = "local";
    private static classSource: "local" | "expanded" = "expanded";
    private static isVisible: boolean = false;

    /**
     * Build the statusBar to controll the source of completions
     */
    public static buildStatusBar() {
        SourceOfCompletions.paragraphStatusBar = window.createStatusBarItem(StatusBarAlignment.Right, PARAGRAPHSTATUSBARPRIORITY)
        SourceOfCompletions.paragraphStatusBar.command = "rech.editor.cobol.changeParagraphSource"
        SourceOfCompletions.paragraphStatusBar.text = "ParagraphSource - Local File"
        //
        SourceOfCompletions.variableStatusBar = window.createStatusBarItem(StatusBarAlignment.Right, VARIABLESTATUSBARPRIORITY)
        SourceOfCompletions.variableStatusBar.command = "rech.editor.cobol.changeVariableSource"
        SourceOfCompletions.variableStatusBar.text = "VariableSource - Local File"
        //
        SourceOfCompletions.classStatusBar = window.createStatusBarItem(StatusBarAlignment.Right, CLASSSTATUSBARPRIORITY)
        SourceOfCompletions.classStatusBar.command = "rech.editor.cobol.changeClassSource"
        SourceOfCompletions.classStatusBar.text = "ClassSource - Expanded File"
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
        if (SourceOfCompletions.classStatusBar) {
            SourceOfCompletions.classStatusBar.show()
        }
    }

    /**
     * Toggle the paragraph source
     */
    public static toggleTheParagraphSource() {
        if (SourceOfCompletions.paragraphSource == "local") {
            SourceOfCompletions.paragraphSource = "expanded";
            SourceOfCompletions.paragraphStatusBar!.text = "ParagraphSource - Expanded File"
        } else {
            SourceOfCompletions.paragraphSource = "local";
            SourceOfCompletions.paragraphStatusBar!.text = "ParagraphSource - Local File"
        }
    }

    /**
     * Toggle the variable source
     */
    public static toggleTheVariableSource() {
        if (SourceOfCompletions.variableSource == "local") {
            SourceOfCompletions.variableSource = "expanded";
            SourceOfCompletions.variableStatusBar!.text = "VariableSource - Expanded File"
        } else {
            SourceOfCompletions.variableSource = "local";
            SourceOfCompletions.variableStatusBar!.text = "VariableSource - Local File"
        }
    }

    /**
     * Toggle the class source
     */
    public static toggleTheClassSource() {
        if (SourceOfCompletions.classSource == "local") {
            SourceOfCompletions.classSource = "expanded";
            SourceOfCompletions.classStatusBar!.text = "classSource - Expanded File"
        } else {
            SourceOfCompletions.classSource = "local";
            SourceOfCompletions.classStatusBar!.text = "classSource - Local File"
        }
    }

    /**
     * Returns the selected source of paragraphs completions
     */
    public static getSourceOfParagraphCompletions() {
        return SourceOfCompletions.paragraphSource;
    }

    /**
     * Returns the selected source of paragraphs completions
     */
    public static getSourceOfClassCompletions() {
        return SourceOfCompletions.classSource;
    }

    /**
     * Returns the selected source of variabless completions
     */
    public static getSourceOfVariableCompletions() {
        return SourceOfCompletions.variableSource;
    }

}