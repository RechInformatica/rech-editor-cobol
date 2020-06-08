// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, window } from 'vscode';
import { GeradorCobol } from './cobol/gerador-cobol';
import { Editor } from './editor/editor';
import { COLUNA_VALUE, AREA_B, COLUNA_B, COLUNA_A, COLUNA_C, AREA_A } from './cobol/colunas';
import { TabStopper } from './cobol/TabStopper';
import { Client } from './lsp/client';
import { CustomDecorator } from './decoration/CustomDecorator';
import { SourceOfCompletions } from './lsp/commons/SourceOfCompletions';
import { ElementsDisplayerFactory } from './cobol/elementsdisplayer/ElementsDisplayerFactory';
import { Log } from './commons/Log';
import { configuration } from './helpers/configuration';
import { FoldStatusBar } from './lsp/fold/FoldStatusBar';
import { ExpandedSourceStatusBar } from './cobol/ExpandedSourceStatusBar';
import FlowProvider from './sourceflow/treeView/providers/FlowProvider';
import { IndentUtils } from './indent/indentUtils';
import { CobolRefactor } from './cobol/refactor/CobolRefactor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: any) {
    await _activate(context).catch(err => console.error(err));
}

/**
 * Function to activate the extension
 *
 * @param context
 */
async function _activate(context: any) {
    // Build the statusBar to control the source of completions suggested in the server side
    SourceOfCompletions.buildStatusBar();
    // Build the statusBar from folding
    FoldStatusBar.buildStatusBar();
    // Build the statusBar from SourceExpander
    ExpandedSourceStatusBar.buildStatusBar();
    // Configures the Logging instance on client side
    Log.get().setActive(configuration.get<boolean>("log"));
    // Starts the LSP Client
    Client.startServerAndEstablishCommunication(context);
    // Custom decorators beyond language syntax highlight
    CustomDecorator.activate(context);
    //
    SourceOfCompletions.show();

    // This register the provider from the Flow list view
    const flowProvider = new FlowProvider(context);
    window.registerTreeDataProvider("cobolflowview", flowProvider);

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
        new GeradorCobol().invertMoveOperators().then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolInsertStartComment', () => {
        new GeradorCobol().insertStartComment().then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolInsertEndComment', () => {
        new GeradorCobol().insertStartEndComment().then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolInsertCommentLine', () => {
        new GeradorCobol().insertCommentLine().then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.insertTodo', () => {
        new GeradorCobol().insertCommentLineTodo().then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.centralizeComment', () => {
        new GeradorCobol().centralizeComment().then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cobolInsertLineSeparator', () => {
        new GeradorCobol().insertLineSeparator().then().catch();
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
        new Editor().setColumn(COLUNA_VALUE - 1).then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.showElementProperties', () => {
        const editor = new Editor();
        const word = editor.getCurrentWord();
        const buffer = editor.getEditorBuffer();
        const uri = editor.getPath().fullPathVscode();
        const line = editor.getCurrentRow();
        const column = editor.getCurrentColumn();
        new ElementsDisplayerFactory().show(word, buffer, uri, line, column);
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos12', () => {
        new Editor().setColumn(AREA_B - 1).then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos30', () => {
        new Editor().setColumn(COLUNA_B - 1).then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos20', () => {
        new Editor().setColumn(COLUNA_A - 1).then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos35', () => {
        new Editor().setColumn(COLUNA_C - 1).then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cursorPos08', () => {
        new Editor().setColumn(AREA_A - 1).then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.changeParagraphSource', () => {
        SourceOfCompletions.toggleTheParagraphSource();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.changeVariableSource', () => {
        SourceOfCompletions.toggleTheVariableSource();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.definesSourceExpander', () => {
        SourceOfCompletions.toggleTheVariableSource();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.indent', () => {
        new Editor().indent("N").then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.indentLeft', () => {
        new Editor().indent("E").then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.indentRight', () => {
        new Editor().indent("D").then().catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.indentParagraph', () => {
        let cursors = new Editor().getCursors();
        IndentUtils.indentWholeParagraph().then(() => new Editor().setCursors(cursors)).catch();
    }));
    context.subscriptions.push(commands.registerCommand('rech.editor.cobol.extractParagraph', () => {
        new CobolRefactor().extractParagraph().then().catch();
    }));
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
export * from "./editor/editor";
export * from "./editor/SourceExpander";
export * from "./commons/rechposition";
export * from "./commons/genericexecutor";
export * from "./indent/indent";
export * from "./cobol/parsercobol";
export * from "./cobol/gerador-cobol";
export * from "./cobol/rechdoc/ElementDocumentationExtractor"
export * from "./cobol/rechdoc/CobolDocParser"
export * from "./lsp/declaration/CobolDeclarationFinder";
export * from "./lsp/declaration/FindInterface";
export * from "./cobol/diagnostic/cobolDiagnosticFilter";
export * from "./cobol/ExpandedSourceManager";
export * from "./cobol/TabStopper";
export * from "./commons/Log";