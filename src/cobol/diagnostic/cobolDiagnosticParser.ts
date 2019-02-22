"use babel";
import { Diagnostic, DiagnosticSeverity, Range } from "vscode-languageserver";
import { CobolDiagnostic } from "./cobolDiagnostic";
import { TextRange } from "./textRange";
import { TextPosition } from "./textPosition";
import { File } from "../../commons/file";
import { Path } from "../../commons/path";
import { Scan } from "../../commons/Scan";

/**
 * Class conteiner of diagnostcs of cobol language
 */
export class CobolDiagnosticParser {

  /** Lines of the source */
  private sourceLines: string;

  constructor(sourceLines: string) {
    this.sourceLines = sourceLines;
  }

  /**
   * Parses the preprocessor results
   *
   * @param preprocResult
   * @param fileName
   */
  parser(preprocResult: string, fileName: string, externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean>): Promise<CobolDiagnostic> {
    return this.extractDiagnostic(preprocResult, fileName, externalDiagnosticFilter);
  }

  /**
   * Extract the diagnostic in the result of preproc
   *
   * @param preprocResult
   * @param fileName
   */
  private extractDiagnostic(preprocResult: string, fileName: string, externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean> ): Promise<CobolDiagnostic> {
    return new Promise((resolve, reject) => {
      let interpreters: Array<Promise<Diagnostic>> = [];
      let lines = preprocResult.split("\n");
      let pattern = /\*\*\*\sWarning:\s(.*);\sfile\s=\s([A-Za-z0-9.]+),\sline\s=\s(\d+)\s?(\(Erro\))?/;
      lines.forEach(currentLine => {
        interpreters.push(this.interpretsTheErrorMessage(fileName, pattern, currentLine, externalDiagnosticFilter));
      });
      Promise.all(interpreters).then((diagnostics) => {
        resolve(this.buildCobolDiagnostic(diagnostics));
      }).catch(() => {
        reject();
      })
    });
  }

  /**
   * Returns a CobolDiagnostic with diagnostics found
   *
   * @param diagnostics
   */
  private buildCobolDiagnostic(diagnostics: Diagnostic[]): CobolDiagnostic {
    let errors: Diagnostic[] = [];
    let warnings: Diagnostic[] = [];
    diagnostics.forEach((diagnostic) => {
      if (diagnostic) {
        if (diagnostic.severity == DiagnosticSeverity.Error) {
          errors.push(diagnostic);
        } else {
          warnings.push(diagnostic);
        }
      }
    });
    return new CobolDiagnostic(errors, warnings);
  }

  /**
   * Interpret the error message and insert the diagnostic
   *
   * @param fileName
   * @param pattern
   * @param currentLine
   * @param externalDiagnosticFilter
   */
  private interpretsTheErrorMessage(fileName: string, pattern: RegExp, currentLine: string, externalDiagnosticFilter?: (diagnosticMessage: string) => Thenable<boolean>): Promise<Diagnostic> {
    return new Promise((resolve, reject) => {
      let match = pattern.exec(currentLine);
      if (!match) {
        reject();
        return;
      }
      let fullError, message: any, file: any, line: any, error: any;
      [fullError, message, file, line, error] = match;
      if (externalDiagnosticFilter) {
        externalDiagnosticFilter(message).then((result) => {
          if (result) {
            this.buildDiagnosticOfError(fileName, message, file, line, error);
            resolve(this.buildDiagnosticOfError(fileName, message, file, line, error));
          } else {
            resolve();
          }
        });
      } else {
        resolve(this.buildDiagnosticOfError(fileName, message, file, line, error));
      }
    });
  }

  /**
   * Build the diagnostic of error and insert the result in the {@code errors} or {@code warnings} array
   *
   * @param fileName
   * @param message
   * @param file
   * @param line
   * @param error
   */
  private buildDiagnosticOfError(fileName: string, message: string, file: string, line: string, error: boolean) {
    let nLine = Number.parseInt(line) - 1
    let diagnosticSeverity: DiagnosticSeverity;
    if (error) {
      diagnosticSeverity = DiagnosticSeverity.Error;
    } else {
      diagnosticSeverity = DiagnosticSeverity.Warning;
    }
    let diagnostic = this.createDiagnostic(
      fileName,
      diagnosticSeverity,
      new TextRange(
        new TextPosition(nLine, 1),
        new TextPosition(nLine, 120)
      ),
      message,
      file
    )
    return diagnostic;
  }

  /**
   * Create a diagnostic
   *
   * @param fileName
   * @param severity
   * @param range
   * @param message
   * @param source
   */
  private createDiagnostic(fileName: string, severity: DiagnosticSeverity, range: TextRange, message: string, source: string): Diagnostic {
    let diagnosticRange = this.diagnosticPosition(fileName, source, range)
    let fullFileName = this.fullFileName(new Path(fileName).fullPathWin(), source);
    let diagnostic: Diagnostic = {
      severity: severity,
      range: {
        start: {
          line: diagnosticRange.start.line,
          character: diagnosticRange.start.character
        },
        end: {
          line: diagnosticRange.end.line,
          character: diagnosticRange.end.character
        }
      },
      message: message,
      source: fullFileName
    };
    diagnostic.relatedInformation = [
      {
        location: {
          uri: new Path(fullFileName).fullPathVscode(),
          range: Object.assign({}, {
            start: {
              line: range.start.line,
              character: range.start.character
            },
            end: {
              line: range.end.line,
              character: range.end.character
            }
          })
        },
        message: message
      },
    ];
    return diagnostic;
  }

  /**
   * Find the diagnostic position
   *
   * @param fileName
   * @param source
   * @param range
   */
  private diagnosticPosition(fileName: string, source: string, range: TextRange): Range {
    if (new Path(fileName).fileName() == source) {
      return range;
    }
    let result: any = undefined;
    let regexp = new RegExp(".*" + source.replace(".", "\\.") + ".*", "gmi");
    new Scan(this.sourceLines).scan(regexp, (iterator: any) => {
      result =  {
        start: {
          line: iterator.row,
          character: 0
        },
        end: {
          line: iterator.row,
          character: 120
        }
      }
    });
    if (result) {
      return result;
    }
    let length = this.sourceLines.split("\n").length
    return {
      start: {
        line: length,
        character: 0
      },
      end: {
        line: length,
        character: 120
      }
    };
  }

  /**
   * Returns the full file name
   *
   * @param fileName
   * @param source
   */
  private fullFileName(fileName: string, source: string): string {
    let file = new File(new Path(fileName).directory() + source);
    if (file.exists()) {
      return file.fileName;
    } else {
      return "F:\\Fontes\\" + source;
    }
  }

}
