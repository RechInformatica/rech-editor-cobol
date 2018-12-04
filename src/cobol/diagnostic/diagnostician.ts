"use babel";
import { TextDocument, Diagnostic } from "vscode-languageserver";
import { CobolDiagnostic } from "./cobolDiagnostic";
import { Path } from "../../commons/path";
import { File } from "../../commons/file";
import { CobolDiagnosticParser } from "./cobolDiagnosticParser";

/* Time in millis representing an old file */
const OLD_FILE_IN_MILLIS: number = 7000;

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
  public diagnose(
    textDocument: TextDocument,
    PreprocessCallback: (uri: string) => Thenable<string>,
    externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean>
  ): Promise<Diagnostic[]> {
    return new Promise((resolve, reject) => {
      this.findErrorsAndWarnings(
        textDocument,
        PreprocessCallback,
        externalDiagnosticFilter
      ).then(cobolDiagnostic => {
          if (!cobolDiagnostic) {
            reject();
            return
          }
          this.extractDiagnostics(cobolDiagnostic).then(diagnostics => {
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
  private findErrorsAndWarnings(
    textDocument: TextDocument,
    PreprocessCallback: (uri: string) => Thenable<string>,
    externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean>): Promise<CobolDiagnostic | undefined> {
    return new Promise<CobolDiagnostic>((resolve, reject) => {
      // If not a cobol processable source
      if (new Path(textDocument.uri).extension().toUpperCase() != ".CBL") {
        reject();
      }
      let tmpFile = new File(
        "C:\\TMP\\" + new Path(textDocument.uri).fileName()
      );
      if (tmpFile.exists()) {
        if (this.isFileOld(tmpFile)) {
          tmpFile.delete();
        }
        resolve(undefined);
        return;
      }
      tmpFile.saveBuffer([textDocument.getText()]).then(() => {
          PreprocessCallback(tmpFile.fileName).then(buffer => {
            let fileName = new Path(textDocument.uri).fullPath();
            new CobolDiagnosticParser().parser(buffer, fileName, externalDiagnosticFilter).then(cobolDiagnostic => {
                tmpFile.delete();
                resolve(cobolDiagnostic);
              }).catch(() => {
                tmpFile.delete();
                reject();
              })
          });
        }).catch(() => {
          reject();
        })
    });
  }

  /**
   * Return {@code true} if is a old file
   * 
   * @param file 
   */
  private isFileOld(file: File): boolean {
    let fileLastModified = file.lastModified().getTime();
      let currentTime = new Date().getTime()
      let resultTime = currentTime - fileLastModified;
      return (resultTime > OLD_FILE_IN_MILLIS)
  }
  /**
   * Returns an array containing the diagnostics
   *
   * @param cobolDiagnostic
   */
  private extractDiagnostics(cobolDiagnostic: CobolDiagnostic): Promise<Diagnostic[]> {
    return new Promise(resolve => {
      let diagnostics: Diagnostic[] = [];
      cobolDiagnostic.errors.forEach(diagnostic => {
        diagnostics.push(diagnostic);
      });
      cobolDiagnostic.warnings.forEach(diagnostic => {
        diagnostics.push(diagnostic);
      });
      resolve(diagnostics);
    });
  }
}
