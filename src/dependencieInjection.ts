// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands} from 'vscode';
import { Editor } from './editor/editor';
import { GenericExecutor } from './commons/genericexecutor';
import { cobolDiagnosticFilter, CobolDiagnosticFilter } from './cobol/diagnostic/cobolDiagnosticFilter';
import { Configuration } from './helpers/configuration';

/**
 * Sets the global source expander which is responsible for executing Cobol Preprocessor
 */
export function defineSourceExpander() {
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
export function definePreprocessor() {
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
export function defineDianosticConfigs() {
    const commandToConfigSourceExpander = new Configuration("rech.editor.cobol.callback").get<string>("dianosticProperties");
    commands.executeCommand(commandToConfigSourceExpander).then((cobolDiagnosticFilterProperties) => {
        if (cobolDiagnosticFilterProperties) {
            cobolDiagnosticFilter.setAutoDiagnostic((<CobolDiagnosticFilter>cobolDiagnosticFilterProperties).autoDiagnostic);
            cobolDiagnosticFilter.setNoShowWarnings((<CobolDiagnosticFilter>cobolDiagnosticFilterProperties).noShowWarnings);
        }
    });
}

/**
 * Sets configurations for Cobol source diagnostic
 */
export function defineCopyHierarchyFunction() {
    const commandToConfigSourceExpander = new Configuration("rech.editor.cobol.callback").get<string>("copyHierarchy");
    commands.executeCommand(commandToConfigSourceExpander).then((copyHierarchy) => {
        if (copyHierarchy) {
            Editor.setCopyHierarchy(<GenericExecutor>copyHierarchy);
        }
    });
}