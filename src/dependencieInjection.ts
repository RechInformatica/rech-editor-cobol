// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands } from 'vscode';
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
            cobolDiagnosticFilter.setDeprecatedWarning((<CobolDiagnosticFilter>cobolDiagnosticFilterProperties).deprecatedWarning);
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

/**
 * Sets special Class puller for Cobol source
 */
export function defineSpecialClassPullerFunction() {
    const commandToConfigSourceExpander = new Configuration("rech.editor.cobol.callback").get<string>("specialClassPuller");
    commands.executeCommand(commandToConfigSourceExpander).then((specialClassPuller) => {
        if (specialClassPuller) {
            Editor.setSpecialClassPuller(<GenericExecutor>specialClassPuller);
        }
    });
}

/**
 * Sets copy usage locator
 */
export function defineCopyUsageLocatorFunction() {
    const commandForCopyUsageLocator = new Configuration("rech.editor.cobol.callback").get<string>("copyUsageLocator");
    if (commandForCopyUsageLocator) {
        Editor.setCopyUsageLocator(commandForCopyUsageLocator);
    }
}

/**
 * Sets external Method completion
 */
export function defineExternalMethodCompletionFunction() {
    const commandToConfigExternalMethodCompletion = new Configuration("rech.editor.cobol.callback").get<string>("externalMethodCompletion");
    if (commandToConfigExternalMethodCompletion) {
        Editor.setExternalMethodCompletion(commandToConfigExternalMethodCompletion);
    }
}
