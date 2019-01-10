// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands } from 'vscode';
import { GeradorCobol } from './cobol/gerador-cobol';
import { Editor } from './editor/editor';
import { COLUNA_VALUE, AREA_B, COLUNA_B, COLUNA_A, COLUNA_C, AREA_A } from './cobol/colunas';
import { TabStopper } from './cobol/TabStopper';
import { Client } from './lsp/client';
import { CustomDecorator } from './decoration/CustomDecorator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(_context: any) {
    let context = <ExtensionContext>_context;
    // Starts the LSP Client
    Client.startServerAndEstablishCommunication(_context);
    // Custom decorators beyond language syntax highlight
    CustomDecorator.activate(_context);
    //
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    //
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolLineEndDot', () => {
        new GeradorCobol().endLineToggle('.');
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolLineEndComma', () => {
        new GeradorCobol().endLineToggle(',');
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolInvertMoveOperators', () => {
        new GeradorCobol().invertMoveOperators();
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
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.insertTodo', () => {
        new GeradorCobol().insertCommentLineTodo();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.centralizeComment', () => {
        new GeradorCobol().centralizeComment();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.cobolInsertLineSeparator', () => {
        new GeradorCobol().insertLineSeparator();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findNextParagraph', () => {
        new Editor().findNextParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.findPreviousParagraph', () => {
        new Editor().findPreviousParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.tab', () => {
        new TabStopper().processTabKey(true);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.vscode.revtab', () => {
        new TabStopper().processTabKey(false);
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
}

// this method is called when your extension is deactivated
export function deactivate() {
    Client.stopClient();
}

export * from "./commons/executor";
export * from "./commons/CobolWordFinder";
export * from "./commons/file";
export * from "./commons/path";
export * from "./commons/Process";
export * from "./commons/Scan";
export * from "./editor/editor";
export * from "./editor/SourceExpander";
export * from "./commons/rechposition";
export * from "./commons/genericexecutor";
export * from "./indent/indent";
export * from "./cobol/parsercobol";
export * from "./cobol/gerador-cobol";
export * from "./cobol/compiler";
export * from "./cobol/rechdoc/ParagraphDocumentationExtractor"
export * from "./cobol/rechdoc/CobolDocParser"
export * from "./lsp/declaration/CobolDeclarationFinder";