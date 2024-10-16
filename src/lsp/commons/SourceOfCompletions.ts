import { StatusBarItem, window, StatusBarAlignment, ExtensionContext } from "vscode";
import { getConfig } from "../server";

/** Literals from paragraph and variables sources */
const PARAGRAPH_SOURCE_EXPANDED_FILE = "ParagraphSource - Expanded File";
const PARAGRAPH_SOURCE_LOCAL_FILE = "ParagraphSource - Local File";
const VARIABLE_SOURCE_EXPANDED_FILE = "VariableSource - Expanded File";
const VARIABLE_SOURCE_LOCAL_FILE = "VariableSource - Local File";
/** Configuration as literal */
const SOURCE_LOCAL = "local";
const SOURCE_EXPANDED = "expanded";
/** Key to store config on global state */
const PARAGRAPH_SOURCE_KEY = 'paragraphSource';
const VARIABLE_SOURCE_KEY = 'variableSource';
/** Paragraph status bar priority */
const PARAGRAPHSTATUSBARPRIORITY = 200;
/** Variable status bar priority */
const VARIABLESTATUSBARPRIORITY = 199;

export class SourceOfCompletions {

    private static paragraphStatusBar: StatusBarItem | undefined;
    private static variableStatusBar: StatusBarItem | undefined;
    private static paragraphSource: Map<string, string>;
    private static variableSource: Map<string, string>;
    private static isVisible: boolean = false;

    /**
     * Builds the status bar to control the source of completions.
     *
     * @param context - The extension context used to access global state and subscriptions.
     */
    public static buildStatusBar(context: ExtensionContext) {
        SourceOfCompletions.loadState(context);
        SourceOfCompletions.paragraphStatusBar = window.createStatusBarItem(StatusBarAlignment.Right, PARAGRAPHSTATUSBARPRIORITY)
        SourceOfCompletions.paragraphStatusBar.command = "rech.editor.cobol.changeParagraphSource"
        SourceOfCompletions.paragraphStatusBar.text = PARAGRAPH_SOURCE_EXPANDED_FILE
        //
        SourceOfCompletions.variableStatusBar = window.createStatusBarItem(StatusBarAlignment.Right, VARIABLESTATUSBARPRIORITY)
        SourceOfCompletions.variableStatusBar.command = "rech.editor.cobol.changeVariableSource"
        SourceOfCompletions.variableStatusBar.text = VARIABLE_SOURCE_EXPANDED_FILE
    }


    /**
     * Loads the state from the global configuration into the source of completions.
     *
     * @param context - The extension context used to access global state.
     */
    public static loadState(context: ExtensionContext) {
        const paragraphData = context.globalState.get<[string, string][]>(PARAGRAPH_SOURCE_KEY, []);
        const variableData = context.globalState.get<[string, string][]>(VARIABLE_SOURCE_KEY, []);

        this.paragraphSource = new Map(paragraphData);
        this.variableSource = new Map(variableData);
    }

    /**
     * Saves the state to the global configuration for the source of completions.
     *
     * @param context - The extension context used to update global state.
     */
    public static saveState(context: ExtensionContext) {
        const paragraphData = Array.from(this.paragraphSource.entries());
        const variableData = Array.from(this.variableSource.entries());

        context.globalState.update(PARAGRAPH_SOURCE_KEY, paragraphData);
        context.globalState.update(VARIABLE_SOURCE_KEY, variableData);
    }

    /**
     * Shows the status bar for the source of completions.
     *
     * @param fileName - The name of the file currently being edited.
     */
    public static show(fileName: string) {
        if (SourceOfCompletions.isVisible) {
            return;
        }
        SourceOfCompletions.isVisible = true;
        SourceOfCompletions.updateText(fileName)
    }

    /**
     * Updates the status bar text based on the source of completions for the given file.
     *
     * @param fileName - The name of the file currently being edited.
     */
    public static updateText(fileName: string) {
        if (SourceOfCompletions.paragraphStatusBar) {
            if (SourceOfCompletions.getSourceOfParagraphCompletions(fileName) == SOURCE_LOCAL) {
                SourceOfCompletions.paragraphStatusBar!.text = PARAGRAPH_SOURCE_LOCAL_FILE;
            } else {
                SourceOfCompletions.paragraphStatusBar!.text = PARAGRAPH_SOURCE_EXPANDED_FILE;
            }
            SourceOfCompletions.paragraphStatusBar.show();
        }
        if (SourceOfCompletions.variableStatusBar) {
            if (SourceOfCompletions.getSourceOfVariableCompletions(fileName) == SOURCE_LOCAL) {
                SourceOfCompletions.variableStatusBar!.text = VARIABLE_SOURCE_LOCAL_FILE;
            } else {
                SourceOfCompletions.variableStatusBar!.text = VARIABLE_SOURCE_EXPANDED_FILE;
            }
            SourceOfCompletions.variableStatusBar.show();
        }
    }

    /**
     * Toggles the paragraph source between "local" and "expanded" for the given file.
     *
     * @param fileName - The name of the file currently being edited.
     * @param context - The extension context used to save the updated state.
     */
    public static toggleTheParagraphSource(fileName: string, context: ExtensionContext) {
        if (SourceOfCompletions.getSourceOfParagraphCompletions(fileName) == SOURCE_LOCAL) {
            SourceOfCompletions.paragraphSource.set(fileName, SOURCE_EXPANDED);
            SourceOfCompletions.paragraphStatusBar!.text = PARAGRAPH_SOURCE_EXPANDED_FILE
        } else {
            SourceOfCompletions.paragraphSource.set(fileName, SOURCE_LOCAL);
            SourceOfCompletions.paragraphStatusBar!.text = PARAGRAPH_SOURCE_LOCAL_FILE
        }
        SourceOfCompletions.saveState(context);
    }

    /**
     * Toggles the variable source between "local" and "expanded" for the given file.
     *
     * @param fileName - The name of the file currently being edited.
     * @param context - The extension context used to save the updated state.
     */
   public static toggleTheVariableSource(fileName: string, context: ExtensionContext) {
       if (SourceOfCompletions.getSourceOfVariableCompletions(fileName) == SOURCE_LOCAL) {
           SourceOfCompletions.variableSource.set(fileName, SOURCE_EXPANDED);
           SourceOfCompletions.variableStatusBar!.text = VARIABLE_SOURCE_EXPANDED_FILE
        } else {
            SourceOfCompletions.variableSource.set(fileName, SOURCE_LOCAL);
            SourceOfCompletions.variableStatusBar!.text = VARIABLE_SOURCE_LOCAL_FILE
        }
        SourceOfCompletions.saveState(context);
    }

    /**
     * Returns the selected source of paragraph completions for the given file.
     *
     * @param fileName - The name of the file for which to get the source.
     * @returns The source of paragraph completions ("local" or "expanded").
     */
    public static getSourceOfParagraphCompletions(fileName: string) {
        const config = SourceOfCompletions.paragraphSource.get(fileName);
        if (config) {
            return config
        }
        return SOURCE_LOCAL;
    }

    /**
     * Returns the selected source of variable completions for the given file.
     *
     * @param fileName - The name of the file for which to get the source.
     * @returns The source of variable completions ("local" or "expanded").
     */
   public static getSourceOfVariableCompletions(fileName: string) {
        const config = SourceOfCompletions.variableSource.get(fileName);
        if (config) {
            return config
        }
        return SOURCE_LOCAL;
    }

}
