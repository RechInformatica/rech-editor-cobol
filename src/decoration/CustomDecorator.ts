import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { Parser } from './Parser';

export class CustomDecorator {

    public static activate(context: ExtensionContext) {
        let activeEditor: vscode.TextEditor | undefined;
        let parser: Parser = new Parser();
    
        // Called to handle events below
        let updateDecorations = function () {
            // If active window is open and language is supported
            if (activeEditor && parser.supportedLanguage) {
                parser.FindSingleLineComments(activeEditor);
                parser.FindRechDocComments(activeEditor);
                parser.ApplyDecorations(activeEditor);
            }
        };
        // Get the active editor for the first time and initialize the regex
        if (vscode.window.activeTextEditor) {
            activeEditor = vscode.window.activeTextEditor;
            // Set the regex patterns for the specified language's comments
            parser.SetRegex(activeEditor.document.languageId);
            // Trigger first update of decorators
            triggerUpdateDecorations();
        }
        // Handle called when active editor was changed
        vscode.window.onDidChangeActiveTextEditor(editor => {
            activeEditor = editor;
            if (editor) {
                // Set regex for updated language
                parser.SetRegex(editor.document.languageId);
                // Trigger update to set decorations for newly active file
                triggerUpdateDecorations();
            }
        }, null, context.subscriptions);
    
        // Handle called when change text content of active editor
        vscode.workspace.onDidChangeTextDocument(event => {
    
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