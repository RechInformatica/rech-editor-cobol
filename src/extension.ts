// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands } from 'vscode';
import GeradorCobol from './cobol/gerador-cobol';
import Editor from './editor/editor';
import FonGrep from './fongrep/fongrep';
import * as TasksProvider from './tasks/tasks-provider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    // Register tasks provider
    TasksProvider.activate(context);
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "rech-test-vscode" is now active!');
    //
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    //
    context.subscriptions.push(commands.registerCommand('extension.cobolMove', () => {
        var gerador = new GeradorCobol();
        gerador.move();
    }));
    context.subscriptions.push(commands.registerCommand('extension.cobolTo', () => {
        var gerador = new GeradorCobol();
        gerador.to();
    }));
    context.subscriptions.push(commands.registerCommand('extension.copyLine', () => {
        var gerador = new GeradorCobol();
        gerador.copyLine();
    }));
    context.subscriptions.push(commands.registerCommand('extension.pasteLine', () => {
        var gerador = new GeradorCobol();
        gerador.pasteLine();
    }));
    context.subscriptions.push(commands.registerCommand('extension.cobolInsertCommentLine', () => {
        var gerador = new GeradorCobol();
        gerador.insertCommentLine();
    }));
    context.subscriptions.push(commands.registerCommand('extension.newLineAbove', () => {
        var gerador = new GeradorCobol();
        gerador.newLineAbove();
    }));
    context.subscriptions.push(commands.registerCommand('extension.fonGrep', () => {
        var fongrep = new FonGrep();
        fongrep.fonGrep();
    }));
    context.subscriptions.push(commands.registerCommand('extension.findNextParagraph', () => {
        var findNextParagraph = new Editor();
        findNextParagraph.findNextParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('extension.findPreviousParagraph', () => {
        var findPreviousParagraph = new Editor();
        findPreviousParagraph.findPreviousParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('extension.indent', () => {
        var indent = new Editor();
        indent.indent();
    }));
    context.subscriptions.push(commands.registerCommand('extension.findWordForward', () => {
        commands.executeCommand("editor.action.addSelectionToNextFindMatch");
        commands.executeCommand("editor.action.nextMatchFindAction");
    }));
    context.subscriptions.push(commands.registerCommand('extension.findWordBackward', () => {
        commands.executeCommand("editor.action.addSelectionToNextFindMatch");
        commands.executeCommand("editor.action.previousMatchFindAction");
    }));
    context.subscriptions.push(commands.registerCommand('extension.copyWordUnderCursor', () => {
        commands.executeCommand("cursorWordRight");
        commands.executeCommand("cursorWordLeftSelect");
        commands.executeCommand("editor.action.clipboardCopyAction");
    }));
    context.subscriptions.push(commands.registerCommand('extension.replaceWordUnderCursor', () => {
        commands.executeCommand("cursorWordRight");
        commands.executeCommand("cursorWordLeftSelect");
        commands.executeCommand("editor.action.clipboardPasteAction");
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
    TasksProvider.deactivate;
}

export * from "./editor/editor";