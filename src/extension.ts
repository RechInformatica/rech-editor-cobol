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
import { ElementsDisplayerFactory } from './cobol/elementsdisplayer/ElementsDisplayerFactory';
import { Log } from './commons/Log';
import { configuration, Configuration } from './helpers/configuration';
import { GenericExecutor } from './commons/genericexecutor';
import { cobolDiagnosticFilter, CobolDiagnosticFilter } from './cobol/diagnostic/cobolDiagnosticFilter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(_context: any) {
    let context = <ExtensionContext>_context;
    // Starts the LSP Client
    Client.startServerAndEstablishCommunication(_context);
    // Custom decorators beyond language syntax highlight
    CustomDecorator.activate(_context);
    // Build the statusBar to control the source of completions suggested in the server side
    SourceOfCompletions.buildStatusBar();
    // Configures the Logging instance on client side
    Log.get().setActive(configuration.get<boolean>("log"));
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
        let editor = new Editor();
        let word = editor.getCurrentWord();
        let buffer = editor.getEditorBuffer();
        let uri = editor.getPath().fullPathVscode();
        let line = editor.getCurrentRow();
        new ElementsDisplayerFactory().show(word, buffer, uri, line);
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
    defineSourceExpander()
    definePreprocessor()
    defineDianosticConfigs()
    defineCopyHierarchyFunction()
}

/**
 * Sets the global source expander which is responsible for executing Cobol Preprocessor
 */
function defineSourceExpander() {
    const commandToConfigSourceExpander = new Configuration("rech.editor.cobol.callback").get<string>("sourceExpanderFunction");
    commands.executeCommand(commandToConfigSourceExpander).then((sourceExpander) => {
        if (sourceExpander) {
            Editor.setSourceExpander(<GenericExecutor>sourceExpander)
        }
    });
}

/**
 * Sets the global source compile which is responsible for executing Cobol Compile
 */
function definePreprocessor() {
    const commandToConfigSourceExpander = new Configuration("rech.editor.cobol.callback").get<string>("preprocessorFunction");
    commands.executeCommand(commandToConfigSourceExpander).then((preproc) => {
        if (preproc) {
            Editor.setPreprocessor(<GenericExecutor>preproc);
        }
    });
}

/**
 * Sets configurations for Cobol source diagnostic
 */
function defineDianosticConfigs() {
    const commandToConfigSourceExpander = new Configuration("rech.editor.cobol.callback").get<string>("dianosticProperties");
    commands.executeCommand(commandToConfigSourceExpander).then((cobolDiagnosticFilterProperties) => {
        if (cobolDiagnosticFilterProperties) {
            cobolDiagnosticFilter.setAutoDiagnostic((<CobolDiagnosticFilter>cobolDiagnosticFilterProperties).getAutoDiagnostic());
            cobolDiagnosticFilter.setNoShowWarnings((<CobolDiagnosticFilter>cobolDiagnosticFilterProperties).getNoShowWarnings());
        }
    });
}

/**
 * Sets configurations for Cobol source diagnostic
 */
function defineCopyHierarchyFunction() {
    const commandToConfigSourceExpander = new Configuration("rech.editor.cobol.callback").get<string>("copyHierarchy");
    commands.executeCommand(commandToConfigSourceExpander).then((copyHierarchy) => {
        if (copyHierarchy) {
            Editor.setCopyHierarchy(<GenericExecutor>copyHierarchy);
        }
    });
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
export * from "./commons/BufferSplitter";
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