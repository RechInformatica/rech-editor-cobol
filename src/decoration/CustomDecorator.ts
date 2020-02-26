import { ExtensionContext, TextEditor, window, workspace, debug } from 'vscode';
import { Parser } from './Parser';

export class CustomDecorator {

    public static activate(context: ExtensionContext) {
        let activeEditor: TextEditor | undefined;
        const parser: Parser = new Parser();

        // Called to handle events below
        const updateDecorations = function () {
            // If user is debugging then disable custom decoration to prevent UI freezing
            if (debug.activeDebugSession) {
                return;
            }
            // If active window is open and language is supported
            if (activeEditor && activeEditor.document.languageId == "COBOL") {
                parser.findLocalVariables(activeEditor).then(() => {
                    parser.findRechDocComments(activeEditor!).then(() => {
                        parser.applyDecorations(activeEditor!);
                    }).catch();
                }).catch();
            }
        };

        // Get the active editor for the first time and initialize the regex
        if (window.activeTextEditor) {
            activeEditor = window.activeTextEditor;
            // Trigger first update of decorators
            triggerUpdateDecorations();
        }
        // Handle called when active editor was changed
        window.onDidChangeActiveTextEditor(editor => {
            activeEditor = editor;
            if (editor) {
                // Trigger update to set decorations for newly active file
                triggerUpdateDecorations();
            }
        }, null, context.subscriptions);

        // Handle called when change text content of active editor
        workspace.onDidChangeTextDocument(event => {
            // Trigger updates if the text was changed in the same document
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations();
            }
        }, null, context.subscriptions);

        // This timer waits 50ms before updating decorations, avoiding calling update too often
        var timeout: NodeJS.Timer;
        function triggerUpdateDecorations() {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(updateDecorations, 50);
        }
    }

}