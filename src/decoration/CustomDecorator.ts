import { ExtensionContext, TextEditor, window, workspace } from 'vscode';
import { Parser } from './Parser';

export class CustomDecorator {

    public static activate(context: ExtensionContext) {
        let activeEditor: TextEditor | undefined;
        let parser: Parser = new Parser();

        // Called to handle events below
        let updateDecorations = function () {
            // If active window is open and language is supported
            if (activeEditor && activeEditor.document.languageId == "COBOL") {
                parser.FindRechDocComments(activeEditor);
                parser.ApplyDecorations(activeEditor);
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

        // This timer waits 200ms before updating decorations, avoiding calling update too often
        var timeout: NodeJS.Timer;
        function triggerUpdateDecorations() {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(updateDecorations, 200);
        }
    }

}