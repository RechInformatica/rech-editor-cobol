// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { extensions } from 'vscode';
import { Editor } from './editor/editor';
import { GenericExecutor } from './commons/genericexecutor';
import { cobolDiagnosticFilter, CobolDiagnosticFilter } from './cobol/diagnostic/cobolDiagnosticFilter';

/**
 * Sets the global source expander which is responsible for executing Cobol Preprocessor
 */
export async function defineSourceExpander() {
    const rechInternal = extensions.getExtension('rechinformatica.rech-editor-internal');
    if (rechInternal) {
        await rechInternal.activate();
        const sourceExpander: GenericExecutor = rechInternal.exports.getSourceExpander();
        if (sourceExpander) {
            Editor.setSourceExpander(<GenericExecutor>sourceExpander)
        }
    }
}

/**
 * Sets the global source compile which is responsible for executing Cobol Compile
*/
export async function definePreprocessor() {
    const rechInternal = extensions.getExtension('rechinformatica.rech-editor-internal');
    if (rechInternal) {
        await rechInternal.activate();
        const preproc: GenericExecutor = rechInternal.exports.getPreprocessor();
        if (preproc) {
            Editor.setPreprocessor(<GenericExecutor>preproc);
        }
    }
}

/**
 * Sets configurations for Cobol source diagnostic
 */
export async function defineDianosticConfigs() {
    const rechInternal = extensions.getExtension('rechinformatica.rech-editor-internal');
    if (rechInternal) {
        await rechInternal.activate();
        const cobolDiagnosticFilterProperties: CobolDiagnosticFilter = rechInternal.exports.getDianosticConfigs();
        if (cobolDiagnosticFilterProperties) {
            cobolDiagnosticFilter.setAutoDiagnostic((<CobolDiagnosticFilter>cobolDiagnosticFilterProperties).autoDiagnostic);
            cobolDiagnosticFilter.setNoShowWarnings((<CobolDiagnosticFilter>cobolDiagnosticFilterProperties).noShowWarnings);
            cobolDiagnosticFilter.setDeprecatedWarning((<CobolDiagnosticFilter>cobolDiagnosticFilterProperties).deprecatedWarning);
        }
    }
}

/**
 * Sets configurations for Cobol source diagnostic
*/
export async function defineCopyHierarchyFunction() {
    const rechInternal = extensions.getExtension('rechinformatica.rech-editor-internal');
    if (rechInternal) {
        await rechInternal.activate();
        const copyHierarchy: GenericExecutor = rechInternal.exports.getCopyHierarchyFunction();
        if (copyHierarchy) {
            Editor.setCopyHierarchy(<GenericExecutor>copyHierarchy);
        }
    }
}

/**
 * Sets special Class puller for Cobol source
*/
export async function defineSpecialClassPullerFunction() {
    const rechInternal = extensions.getExtension('rechinformatica.rech-editor-internal');
    if (rechInternal) {
        await rechInternal.activate();
        const specialClassPuller: GenericExecutor = rechInternal.exports.getSpecialClassPullerFunction();
        if (specialClassPuller) {
            Editor.setSpecialClassPuller(<GenericExecutor>specialClassPuller);
        }
    }
}

/**
 * Sets copy usage locator
*/
export async function defineCopyUsageLocatorFunction() {
    const rechInternal = extensions.getExtension('rechinformatica.rech-editor-internal');
    if (rechInternal) {
        await rechInternal.activate();
        const commandForCopyUsageLocator = rechInternal.exports.getAutogrepRunner();
        if (commandForCopyUsageLocator) {
            Editor.setCopyUsageLocator(commandForCopyUsageLocator);
        }
    }
}

/**
 * Sets external Method completion
*/
export async function defineExternalMethodCompletionFunction() {
    const rechInternal = extensions.getExtension('rechinformatica.rech-editor-internal');
    if (rechInternal) {
        await rechInternal.activate();
        const commandToConfigExternalMethodCompletion = rechInternal.exports.getExternalMethodCompletionFunction();
        if (commandToConfigExternalMethodCompletion) {
            Editor.setExternalMethodCompletion(commandToConfigExternalMethodCompletion);
        }
    }
}
