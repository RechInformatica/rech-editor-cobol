"use babel";
import { TextDocument, Diagnostic } from 'vscode-languageserver';
import { CobolDiagnostic } from './cobolDiagnostic';
import { Path } from '../../commons/path';
import { File } from '../../commons/file';
import { CobolDiagnosticParser } from './cobolDiagnosticParser';

/**
 * Class to diagnose sources
 */
export class Diagnostician {

    /**
     * Diagnoses the source
     * 
     * @param textDocument 
     * @param preprocessorResultFileName 
     * @param PreprocessCallback 
     */
    public diagnose(textDocument: TextDocument, PreprocessCallback: (uri: string) => Thenable<string>): Promise<Diagnostic[]> {
        return new Promise((resolve, reject) => {
            this.findErrorsAndWarnings(textDocument, PreprocessCallback).then((cobolDiagnostic) => {
                this.extractDiagnostics(cobolDiagnostic).then((diagnostics) => {
                    resolve(diagnostics);
                }).catch(() => {
                    reject();
                });
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Find errors or/and warnings
     * 
     * @param textDocument 
     * @param preprocessorResultFileName 
     * @param PreprocessCallback 
     */
    private findErrorsAndWarnings(textDocument: TextDocument, PreprocessCallback: (uri: string) => Thenable<string>) {
        return new Promise<CobolDiagnostic>((resolve, reject) => {
            let tmpFile = new File("C:\\TMP\\" + new Path(textDocument.uri).fileName());
            tmpFile.saveBuffer([textDocument.getText()]).then( () => {
                PreprocessCallback(tmpFile.fileName).then((buffer) => {
                    let fileName = new Path(textDocument.uri).fileName();
                    resolve(new CobolDiagnosticParser().parser(buffer, fileName));
                });
            }).catch(() => {
                reject();
            })
        })
    }

    /**
     * Returns an array containing the diagnostics
     * 
     * @param cobolDiagnostic 
     */
    private extractDiagnostics(cobolDiagnostic: CobolDiagnostic): Promise<Diagnostic[]> {
        return new Promise((resolve) => {
            let diagnostics: Diagnostic[] = [];
            cobolDiagnostic.errors.forEach((diagnostic) => {
                diagnostics.push(diagnostic);
            });
            cobolDiagnostic.warnings.forEach((diagnostic) => {
                diagnostics.push(diagnostic);
            });
            resolve(diagnostics);
        })
    }

}