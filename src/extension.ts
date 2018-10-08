// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands } from 'vscode';
import GeradorCobol from './cobol/gerador-cobol';
import Editor from './editor/editor';
import FonGrep from './fongrep/fongrep';
import * as TasksProvider from './tasks/tasks-provider';
import Executor from './commons/executor';
import Compiler from './cobol/compiler';

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
        var editor = new Editor();
        var fongrep = new FonGrep();
        var text = editor.getSelectionBuffer()[0];
        if (text == '')
            text = editor.getCurrentWord();
        fongrep.fonGrep(text);
    }));
    context.subscriptions.push(commands.registerCommand('extension.update', () => {
        new Editor().showInformationMessage("Executando Update...")
        new Executor().runAsync("start cmd.exe /c F:\\BAT\\Update.bat");
    }));
    context.subscriptions.push(commands.registerCommand('extension.commit', () => {
        new Editor().showInformationMessage("Executando Commit...")
        new Executor().runAsync("start cmd.exe /c F:\\BAT\\Commit.bat");
    }));
    context.subscriptions.push(commands.registerCommand('extension.checkout', () => {
        let baseName = new Editor().getCurrentFileBaseName();
        let editor = new Editor();
        editor.showInformationMessage("Executando Checkout de " + baseName + "...");
        editor.closeActiveEditor();
        new Executor().runAsync("start cmd.exe /c F:\\BAT\\Checkout.bat  " + baseName);
    }));
    context.subscriptions.push(commands.registerCommand('extension.compile', () => {
        new Editor().showInformationMessage("Compilando " + new Editor().getCurrentFileBaseName() + "...");
        new Compiler().compileCurrentFile();
    }));
    context.subscriptions.push(commands.registerCommand('extension.findNextParagraph', () => {
        var findNextParagraph = new Editor();
        findNextParagraph.findNextParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('extension.findPreviousParagraph', () => {
        var findPreviousParagraph = new Editor();
        findPreviousParagraph.findPreviousParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('extension.findNextBlankLine', () => {
        var findNextParagraph = new Editor();
        findNextParagraph.findNextBlankLine();
    }));
    context.subscriptions.push(commands.registerCommand('extension.findPreviousBlankLine', () => {
        var findPreviousParagraph = new Editor();
        findPreviousParagraph.findPreviousBlankLine();
    }));
    context.subscriptions.push(commands.registerCommand('extension.indent', () => {
        var indent = new Editor();
        indent.indent("N");
    }));
    context.subscriptions.push(commands.registerCommand('extension.indentLeft', () => {
        var indent = new Editor();
        indent.indent("E");
    }));
    context.subscriptions.push(commands.registerCommand('extension.indentRight', () => {
        var indent = new Editor();
        indent.indent("D");
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