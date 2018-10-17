// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands } from 'vscode';
import { GeradorCobol } from './cobol/gerador-cobol';
import { Editor } from './editor/editor';
import { Executor } from './commons/executor';
import Compiler from './cobol/compiler';
import { COLUNA_VALUE, AREA_B, COLUNA_B, COLUNA_A, COLUNA_C, AREA_A } from './cobol/colunas';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(_context: any) {
    let context = <ExtensionContext> _context;
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "rech-test-vscode" is now active!');
    //
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    //
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolMove', () => {
        new GeradorCobol().move();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolTo', () => {
        new GeradorCobol().to();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.flagGenerator', () => {
        new GeradorCobol().flagGenerator();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.copyLine', () => {
        commands.executeCommand("editor.action.clipboardCopyAction");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.pasteLine', () => {
        new GeradorCobol().pasteLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.replaceLine', () => {
        commands.executeCommand("editor.action.deleteLines");
        new GeradorCobol().pasteLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolInsertStartComment', () => {
        new GeradorCobol().insertStartComment();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolInsertEndComment', () => {
        new GeradorCobol().insertStartEndComment();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolInsertCommentLine', () => {
        new GeradorCobol().insertCommentLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolInsertLineSeparator', () => {
        new GeradorCobol().insertLineSeparator();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolUpdateLineDots', () => {
        new GeradorCobol().updateLineDots();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.newLineAbove', () => {
        new GeradorCobol().newLineAbove();
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
        new Compiler().compileCurrentFile();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findNextParagraph', () => {
        new Editor().findNextParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findPreviousParagraph', () => {
        new Editor().findPreviousParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findNextBlankLine', () => {
        new Editor().findNextBlankLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findPreviousBlankLine', () => {
        new Editor().findPreviousBlankLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.indent', () => {
        new Editor().indent("N");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.indentLeft', () => {
        new Editor().indent("E");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.indentRight', () => {
        new Editor().indent("D");
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
        new Editor().clipboardCopyWord();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.replaceWordUnderCursor', () => {
        commands.executeCommand("cursorWordRight");
        commands.executeCommand("cursorWordLeftSelect");
        commands.executeCommand("editor.action.clipboardPasteAction");
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos51', () => {
        new Editor().setColumn(COLUNA_VALUE - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos12', () => {
        new Editor().setColumn(AREA_B - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos30', () => {
        new Editor().setColumn(COLUNA_B - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos20', () => {
        new Editor().setColumn(COLUNA_A - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos35', () => {
        new Editor().setColumn(COLUNA_C - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cursorPos08', () => {
        new Editor().setColumn(AREA_A - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.goToDeclaration', () => {
        new Editor().goToDeclaration();
    }));
}

export * from "./commons/executor";
export * from "./commons/file";
export * from "./commons/path";
export * from "./commons/Process";
export * from "./editor/editor";
export * from "./indent/indent";