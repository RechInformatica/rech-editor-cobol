// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, commands, StatusBarItem, window, StatusBarAlignment } from 'vscode';
import { GeradorCobol } from './cobol/gerador-cobol';
import { Editor } from './editor/editor';
import { COLUNA_VALUE, AREA_B, COLUNA_B, COLUNA_A, COLUNA_C, AREA_A } from './cobol/colunas';
import { TabStopper } from './cobol/TabStopper';
import { Client } from './lsp/client';
import { CustomDecorator } from './decoration/CustomDecorator';
import { SourceOfCompletions } from './lsp/commons/SourceOfCompletions';

/** Controll the sourceOfCompletions StatusBarItem */
var sourceOfCompletions: StatusBarItem;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(_context: any) {
    let context = <ExtensionContext>_context;
    // Starts the LSP Client
    Client.startServerAndEstablishCommunication(_context);
    // Custom decorators beyond language syntax highlight
    CustomDecorator.activate(_context);
    // Build the statusBar to control the source of completions suggested in the server side
    sourceOfCompletions = SourceOfCompletions.buildStatusBar();
    //
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    //
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolLineEndDot', () => {
        new GeradorCobol().endLineToggle('.');
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolLineEndComma', () => {
        new GeradorCobol().endLineToggle(',');
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolInvertMoveOperators', () => {
        new GeradorCobol().invertMoveOperators();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolInsertStartComment', () => {
        new GeradorCobol().insertStartComment();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolInsertEndComment', () => {
        new GeradorCobol().insertStartEndComment();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolInsertCommentLine', () => {
        new GeradorCobol().insertCommentLine();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.insertTodo', () => {
        new GeradorCobol().insertCommentLineTodo();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.centralizeComment', () => {
        new GeradorCobol().centralizeComment();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolInsertLineSeparator', () => {
        new GeradorCobol().insertLineSeparator();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.findNextParagraph', () => {
        new Editor().findNextParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.findPreviousParagraph', () => {
        new Editor().findPreviousParagraph();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.tab', () => {
        new TabStopper().processTabKey(true);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.revtab', () => {
        new TabStopper().processTabKey(false);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos51', () => {
        new Editor().setColumn(COLUNA_VALUE - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos12', () => {
        new Editor().setColumn(AREA_B - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos30', () => {
        new Editor().setColumn(COLUNA_B - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos20', () => {
        new Editor().setColumn(COLUNA_A - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos35', () => {
        new Editor().setColumn(COLUNA_C - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos08', () => {
        new Editor().setColumn(AREA_A - 1);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.changeSource', () => {
        SourceOfCompletions.toggleTheSource();
    }));

    sourceOfCompletions.show();
}

// this method is called when your extension is deactivated
export function deactivate() {
    Client.stopClient();
}

export * from "./commons/executor";
export * from "./commons/CobolWordFinder";
export * from "./commons/VariableUtils";
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
export * from "./cobol/rechdoc/ElementDocumentationExtractor"
export * from "./cobol/rechdoc/CobolDocParser"
export * from "./lsp/declaration/CobolDeclarationFinder";
export * from "./cobol/diagnostic/cobolDiagnosticFilter";
export * from "./cobol/ExpandedSourceManager";