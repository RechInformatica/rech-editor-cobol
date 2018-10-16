// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands } from 'vscode';
import { GeradorCobol } from './cobol/gerador-cobol';
import { Editor } from './editor/editor';
import * as TasksProvider from './tasks/tasks-provider';
import { Executor } from './commons/executor';
import Compiler from './cobol/compiler';
import { COLUNA_VALUE, AREA_B, COLUNA_B, COLUNA_A, COLUNA_C, AREA_A } from './cobol/colunas';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(_context: any) {
    let context = <ExtensionContext> _context;
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
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolMove', () => {
        var gerador = new GeradorCobol();
        gerador.move();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolTo', () => {
        var gerador = new GeradorCobol();
        gerador.to();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.flagGenerator', () => {
        var gerador = new GeradorCobol();
        gerador.flagGenerator();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.copyLine', () => {
        var gerador = new GeradorCobol();
        gerador.copyLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.pasteLine', () => {
        var gerador = new GeradorCobol();
        gerador.pasteLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolInsertCommentLine', () => {
        var gerador = new GeradorCobol();
        gerador.insertCommentLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolInsertLineSeparator', () => {
        var gerador = new GeradorCobol();
        gerador.insertLineSeparator();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolUpdateLineDots', () => {
        var gerador = new GeradorCobol();
        gerador.updateLineDots();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.newLineAbove', () => {
        var gerador = new GeradorCobol();
        gerador.newLineAbove();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.update', () => {
        new Editor().showInformationMessage("Executando Update...")
        new Executor().runAsync("start cmd.exe /c F:\\BAT\\Update.bat");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.commit', () => {
        new Editor().showInformationMessage("Executando Commit...")
        new Executor().runAsync("start cmd.exe /c F:\\BAT\\Commit.bat");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.checkout', () => {
        let baseName = new Editor().getCurrentFileBaseName();
        let editor = new Editor();
        editor.showInformationMessage("Executando Checkout de " + baseName + "...");
        editor.closeActiveEditor();
        new Executor().runAsync("start cmd.exe /c F:\\BAT\\Checkout.bat  " + baseName);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.compile', () => {
        new Editor().showInformationMessage("Compilando " + new Editor().getCurrentFileBaseName() + "...");
        new Compiler().compileCurrentFile();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findNextParagraph', () => {
        var findNextParagraph = new Editor();
        findNextParagraph.findNextParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findPreviousParagraph', () => {
        var findPreviousParagraph = new Editor();
        findPreviousParagraph.findPreviousParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findNextBlankLine', () => {
        var findNextParagraph = new Editor();
        findNextParagraph.findNextBlankLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findPreviousBlankLine', () => {
        var findPreviousParagraph = new Editor();
        findPreviousParagraph.findPreviousBlankLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.indent', () => {
        var indent = new Editor();
        indent.indent("N");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.indentLeft', () => {
        var indent = new Editor();
        indent.indent("E");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.indentRight', () => {
        var indent = new Editor();
        indent.indent("D");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findWordForward', () => {
        commands.executeCommand("editor.action.addSelectionToNextFindMatch");
        commands.executeCommand("editor.action.nextMatchFindAction");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findWordBackward', () => {
        commands.executeCommand("editor.action.addSelectionToNextFindMatch");
        commands.executeCommand("editor.action.previousMatchFindAction");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.copyWordUnderCursor', () => {
        commands.executeCommand("cursorWordRight");
        commands.executeCommand("cursorWordLeftSelect");
        commands.executeCommand("editor.action.clipboardCopyAction");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.replaceWordUnderCursor', () => {
        commands.executeCommand("cursorWordRight");
        commands.executeCommand("cursorWordLeftSelect");
        commands.executeCommand("editor.action.clipboardPasteAction");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos51', () => {
        var editor = new Editor();
        editor.setColumn(COLUNA_VALUE - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos12', () => {
        var editor = new Editor();
        editor.setColumn(AREA_B - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos30', () => {
        var editor = new Editor();
        editor.setColumn(COLUNA_B - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos20', () => {
        var editor = new Editor();
        editor.setColumn(COLUNA_A - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos35', () => {
        var editor = new Editor();
        editor.setColumn(COLUNA_C - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos08', () => {
        var editor = new Editor();
        editor.setColumn(AREA_A - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.goToDeclaration', () => {
        var editor = new Editor();
        editor.goToDeclaration();
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
    TasksProvider.deactivate;
}

export * from "./commons/executor";
export * from "./commons/file";
export * from "./commons/path";
export * from "./commons/Process";
export * from "./editor/editor";
export * from "./indent/indent";