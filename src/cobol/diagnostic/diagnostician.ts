"use babel";
import { TextDocument, Diagnostic } from "vscode-languageserver";
import { CobolDiagnostic } from "./cobolDiagnostic";
import { Path } from "../../commons/path";
import { File } from "../../commons/file";
import { CobolDiagnosticParser } from "./cobolDiagnosticParser";
import { CobolDiagnosticPreprocManager } from "./CobolDiagnosticPreprocManager";

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
      )
        .then(cobolDiagnostic => {
          if (!cobolDiagnostic) {
            reject();
            return;
          }
          this.extractDiagnostics(cobolDiagnostic)
            .then(diagnostics => {
              resolve(diagnostics);
            })
            .catch(() => {
              reject();
            });
        })
        .catch(() => {
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
    externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean>
  ): Promise<CobolDiagnostic | undefined> {
    return new Promise<CobolDiagnostic>((resolve, reject) => {
      // If not a cobol processable source
      if (new Path(textDocument.uri).extension().toUpperCase() != ".CBL") {
        reject();
      }
      let dir = new File("C:\\TMP\\Diagnostic\\" + require("os").userInfo().username + "\\");
      if (!dir.exists()) {
        dir.mkdir();
      }
      let tmpFile = new File(
        dir.fileName + new Path(textDocument.uri).fileName()
      );
      CobolDiagnosticPreprocManager.runWhenPossible(
        PreprocessCallback,
        tmpFile,
        [textDocument.getText()],
        (buffer) => {
          let fileName = new Path(textDocument.uri).fullPath();
          new CobolDiagnosticParser()
            .parser(buffer, fileName, externalDiagnosticFilter)
            .then(cobolDiagnostic => {
              resolve(cobolDiagnostic);
            })
            .catch(() => {
              reject();
            });
        },
        () => reject()
      );
    });
  }

  /**
   * Returns an array containing the diagnostics
   *
   * @param cobolDiagnostic
   */
  private extractDiagnostics(
    cobolDiagnostic: CobolDiagnostic
  ): Promise<Diagnostic[]> {
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
