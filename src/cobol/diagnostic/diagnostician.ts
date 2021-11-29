"use babel";
import { TextDocument, Diagnostic, DiagnosticRelatedInformation } from "vscode-languageserver";
import { CobolDiagnostic } from "./cobolDiagnostic";
import { Path } from "../../commons/path";
import { File } from "../../commons/file";
import { CobolDiagnosticParser } from "./cobolDiagnosticParser";
import { CobolDiagnosticPreprocManager } from "./cobolDiagnosticPreprocManager";
import { Log } from "../../commons/Log";

/** Root directory from diagnostic files */
const DIAGNOSTIC_ROOT_DIR = "C:\\TMP\\Diagnostic\\";


/**
 * Class to diagnose sources
 */
export class Diagnostician {

  /** Lines of the source */
  private sourceLines: string;

  constructor(sourceLines: string) {
    this.sourceLines = sourceLines;
  }

  /**
   * Diagnoses the source
   *
   * @param textDocument
   * @param preprocessorResultFileName
   * @param preprocessCallback
   */
  public diagnose(textDocument: TextDocument,
    preprocessCallback: (uri: string, documentPath: string) => Thenable<string>,
    externalGetCopyHierarchy: (uri: string) => Thenable<string>,
    externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean>,
    isDeprecatedWarning?: (diagnosticMessage: string) => Thenable<boolean>,
    copyUsageLocator?: (copys: string[]) => Thenable<string[]>
  ): Promise<Diagnostic[]> {
    return new Promise((resolve, reject) => {
      this.findErrorsAndWarnings(textDocument, preprocessCallback, externalGetCopyHierarchy, externalDiagnosticFilter, isDeprecatedWarning, copyUsageLocator).then(cobolDiagnostic => {
          this.extractDiagnostics(cobolDiagnostic).then(diagnostics => {
            return resolve(diagnostics);
          }).catch(() => {
            return reject();
          });
        }).catch(() => {
          return reject();
        });
    });
  }

  /**
   * Find errors or/and warnings
   *
   * @param textDocument
   * @param preprocessorResultFileName
   * @param preprocessCallback
   */
  private findErrorsAndWarnings(
    textDocument: TextDocument,
    preprocessCallback: (uri: string, documentPath: string) => Thenable<string>,
    externalGetCopyHierarchy: (uri: string) => Thenable<string>,
    externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean>,
    isDeprecatedWarning?: (diagnosticMessage: string) => Thenable<boolean>,
    copyUsageLocator?: (copys: string[]) => Thenable<string[]>
  ): Promise<CobolDiagnostic> {
    return new Promise<CobolDiagnostic>((resolve, reject) => {
      // If not a cobol processable source
      const documentPath = new Path(textDocument.uri);
      Log.get().info("FindErrorsAndWarnings from " + documentPath);
      let text = textDocument.getText();
      const dir = new File(DIAGNOSTIC_ROOT_DIR + require("os").userInfo().username + "\\");
      if (!dir.exists()) {
        dir.mkdir();
      }
      if (documentPath.extension().toUpperCase() != ".CBL" && documentPath.extension().toUpperCase() != ".COB") {
        const tmpFile = new File(dir.fileName + "copys\\" + documentPath.fileName());
        this.findErrorsAndWarningsInCopyFile(text, documentPath, dir, tmpFile, preprocessCallback, externalGetCopyHierarchy, externalDiagnosticFilter, isDeprecatedWarning, copyUsageLocator).then((result) => {
          return resolve(result);
        }).catch((error) => {
          Log.get().info("Rejected because: " + error + ". extension: " + documentPath.extension().toUpperCase());
          return reject(error);
        }).finally(() => {
          tmpFile.delete();
        });
      } else {
        this.findErrorsAndWarningsRunningPreproc(text,
          documentPath,
          dir,
          (uri: string) => {
            return preprocessCallback(uri, new Path(documentPath.fullPathWin()).directory())
          },
          externalGetCopyHierarchy,
          externalDiagnosticFilter,
          isDeprecatedWarning).then((result) => {
            return resolve(result);
          }).catch((error) => {
            return reject(error);
        });
      }
    });
  }

  /**
   * Find all errors and warnings on copy files
   *
   * @param documentPath
   * @param dir
   * @param preprocessCallback
   * @param externalGetCopyHierarchy
   * @param externalDiagnosticFilter
   * @param isDeprecatedWarning
   */
  private findErrorsAndWarningsInCopyFile (
    text: string,
    copyPath: Path,
    dir: File,
    tmpFile: File,
    preprocessCallback: (uri: string, documentPath: string) => Thenable<string>,
    externalGetCopyHierarchy: (uri: string) => Thenable<string>,
    externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean>,
    isDeprecatedWarning?: (diagnosticMessage: string) => Thenable<boolean>,
    copyUsageLocator?: (copys: string[]) => Thenable<string[]>
  ): Promise<CobolDiagnostic> {
    return new Promise((resolve, reject) => {
      const directory = new File(new Path(tmpFile.fileName).directory());
      if (!directory.exists()) {
        directory.mkdir();
      }
      tmpFile.saveBuffer(Buffer.from(text), "latin1").then(() => {
        if (copyUsageLocator) {
          copyUsageLocator([copyPath.fileName()]).then((programs) => {
            if (programs.length < 1) {
              return reject("The copy usage locator canot find results from " + copyPath.fullPathWin());
            }
            const program = programs[0].trim();
            new File(program).loadBuffer("latin1").then((buffer) => {
              this.findErrorsAndWarningsRunningPreproc(
                buffer,
                copyPath,
                dir,
                (uri: string) => {
                  return preprocessCallback(uri, directory.fileName)
                },
                externalGetCopyHierarchy,
                externalDiagnosticFilter,
                isDeprecatedWarning).then((result) => {
                  this.filterErrorsAndWarningsFromCopyFile(result, copyPath).then((diagnostic) => {
                    return resolve(diagnostic);
                  }).catch((error) => {
                    return reject(error);
                  });
                }).catch((error) => {
                  return reject(error);
                });

              }).catch((error) => {
                return reject(error);
              });
            }, (err) => {
              return reject(err);
            })
        } else {
          return reject("copyUsageLocator is not defined!");
        }
      }).catch((error) => {
        return reject(error);
      });
    });
  }


  /**
   * Filter errors and warnings from copy file in full diagnostic
   *
   * @param diagnostic
   * @param copyPath
   * @returns
   */
  private filterErrorsAndWarningsFromCopyFile(diagnostic: CobolDiagnostic, copyPath: Path): Promise<CobolDiagnostic> {
    return new Promise((resolve, reject) => {
      let errors = this.adjustDiagnostic(diagnostic.errors, copyPath);
      let warnings = this.adjustDiagnostic(diagnostic.warnings, copyPath);
      if (warnings.length == 0 && errors.length == 0) {
        return reject("Erros and warnings of " + copyPath.baseName() + " not found!");
      }
      return resolve(new CobolDiagnostic(errors, warnings));
    });
  }

  /**
   * Adjust diagnostic group to copy file
   *
   * @param diagnostic
   * @param copyPath
   */
  private adjustDiagnostic(diagnostic: Diagnostic[], copyPath: Path): Diagnostic[] {
    let result = diagnostic.filter((d) => {
      if (!d.relatedInformation) {
        return new Path(d.source).baseName().toUpperCase() == copyPath.baseName().toUpperCase();
      }
      let relatedInformation: DiagnosticRelatedInformation = d.relatedInformation[0];
      return new Path(relatedInformation.location.uri).baseName().toUpperCase() == copyPath.baseName().toUpperCase();
    });
    result = result.map((d) => {
      if (!d.relatedInformation) {
        return d;
      }
      let relatedInformation: DiagnosticRelatedInformation = d.relatedInformation[0];
      d.source = relatedInformation.location.uri;
      d.range = relatedInformation.location.range;
      return d;
    });
    return result;
  }

  /**
   * Find all errors and warnings on text running proprocessor
   *
   * @param text
   * @param documentPath
   * @param dir
   * @param preprocessCallback
   * @param externalGetCopyHierarchy
   * @param externalDiagnosticFilter
   * @param isDeprecatedWarning
   */
  private findErrorsAndWarningsRunningPreproc(
    text: string,
    documentPath: Path,
    dir: File,
    preprocessCallback: (uri: string) => Thenable<string>,
    externalGetCopyHierarchy: (uri: string) => Thenable<string>,
    externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean>,
    isDeprecatedWarning?: (diagnosticMessage: string) => Thenable<boolean>
  ): Promise<CobolDiagnostic> {
    return new Promise((resolve, reject) => {
      const tmpFile = new File(dir.fileName + documentPath.fileName());
      CobolDiagnosticPreprocManager.runWhenPossible(preprocessCallback, tmpFile, Buffer.from(text), (buffer) => {
        Log.get().info("Diagnostician buffer recived for " + dir.fileName);
        const fileName = documentPath.fullPath();
        new CobolDiagnosticParser(this.sourceLines)
          .parser(buffer, fileName, externalGetCopyHierarchy, externalDiagnosticFilter, isDeprecatedWarning)
          .then(cobolDiagnostic => {
            Log.get().info("FindErrorsAndWarnings from " + documentPath + " has correctly finished.");
            return resolve(cobolDiagnostic);
          })
          .catch((error) => {
            Log.get().info("FindErrorsAndWarnings from " + documentPath + " has finished with error. Error: " + error);
            return reject(error);
          });
      },
      () => {
        Log.get().info("FindErrorsAndWarnings from " + documentPath + " has finished with error on runWhenPossible from PreprocManager");
        return reject();
      }
    );
    });

  }

  /**
   * Returns an array containing the diagnostics
   *
   * @param cobolDiagnostic
   */
  private extractDiagnostics(cobolDiagnostic: CobolDiagnostic): Promise<Diagnostic[]> {
    return new Promise((resolve, reject) => {
      const diagnostics: Diagnostic[] = [];
      cobolDiagnostic.errors.forEach(diagnostic => {
        diagnostics.push(diagnostic);
      });
      cobolDiagnostic.warnings.forEach(diagnostic => {
        diagnostics.push(diagnostic);
      });
      if (diagnostics) {
        return resolve(diagnostics);
      } else {
        return reject()
      }
    });
  }
}
