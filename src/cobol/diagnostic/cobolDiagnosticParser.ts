"use babel";
import {
  Diagnostic,
  DiagnosticSeverity,
} from "vscode-languageserver";
import { CobolDiagnostic } from "./cobolDiagnostic";

/**
 * Class conteiner of diagnostcs of cobol language
 */
export class CobolDiagnosticParser {

  /**
   * Parses the preprocessor results
   * 
   * @param preprocResult 
   * @param fileName 
   */
  parser(preprocResult: string, fileName: string): CobolDiagnostic {
    return this.extractDiagnostic(preprocResult, fileName);
  }

  /**
   * Extract the diagnostic in the result of preproc
   * 
   * @param preprocResult 
   * @param fileName 
   */
  private extractDiagnostic(preprocResult: string, fileName: string): CobolDiagnostic {
    let errors: Diagnostic[] = [];
    let warnings: Diagnostic[] = [];
    let lines = preprocResult.split("\n");
    lines.forEach(currentLine => {
      let pattern = /\*\*\*\sWarning:\s(.*);\sfile\s=\s([A-Za-z0-9.]+),\sline\s=\s(\d+)\s?(\(Erro\))?/;
      let match = pattern.exec(currentLine);
      if (match) {
        if (this.isDiagnosticValid(fileName, match[2], match[1])) {
          // If the error is in the current source  
          if (match[4]) {
            errors.push(
              this.createDiagnostic(
                DiagnosticSeverity.Error,
                new TextRange(
                  new TextPosition(Number.parseInt(match[3]) - 1, 1),
                  new TextPosition(Number.parseInt(match[3]) - 1, 120)
                ),
                match[1],
                match[2]
              )
            );
          } else {
            warnings.push(this.createDiagnostic(DiagnosticSeverity.Warning,
              new TextRange(
                new TextPosition(Number.parseInt(match[3]) - 1, 1),
                new TextPosition(Number.parseInt(match[3]) - 1, 120)
              ),
              match[1],
              match[2]
            ));
          }
        }
      }
    });
    return new CobolDiagnostic(errors, warnings);
  }

  /**
   * Create a diagnostic
   *
   * @param severity
   * @param range
   * @param message
   * @param source
   */
  private createDiagnostic(severity: DiagnosticSeverity, range: TextRange, message: string, source: string): Diagnostic {
    
    let diagnostic: Diagnostic = {
      severity: severity,
      range: {
        start: {
          line: range.start.line,
          character: range.start.character
        },
        end: {
          line: range.end.line,
          character: range.end.character
        }
      },
      message: message,
      source: source
    };
    return diagnostic;
  }

  /**
   * Return if the diagnostic is valided
   */
  private isDiagnosticValid(fileName: string, source: string, message: string): boolean {
    // Is invalid if found the error in other file
    if (source != fileName) {
      return false;
    }
    // Not show warning of blank line out of working copy
    if (message.trim().startsWith("[W003]")) {
      return false;
    }
    // Not show warning of 120 character exceeded
    if (message.trim().startsWith("[W002]")) {
      return false;
    }
    return true;
  }
}

/**
 * Position in text
 */
class TextPosition {
  /** Line */
  private _line: number;
  /** Character */
  private _character: number;

  constructor(line: number, character: number) {
    this._line = line;
    this._character = character;
  }

  /**
   * Return the line
   */
  public get line() {
    return this._line;
  }

  /**
   * Return the character
   */
  public get character() {
    return this._character;
  }
}

/**
 * Position in text
 */
class TextRange {
  /** Start position of range */
  private _start: TextPosition;
  /** End position of range */
  private _end: TextPosition;

  constructor(start: TextPosition, end: TextPosition) {
    this._start = start;
    this._end = end;
  }

  /**
   * Return the start position of range
   */
  public get start() {
    return this._start;
  }

  /**
   * Return the end position of range
   */
  public get end() {
    return this._end;
  }
}

// The validator creates diagnostics for all uppercase words length 2 and more
// let text = textDocument.getText();
// let pattern = /\b[A-Z]{2,}\b/g;
// let m: RegExpExecArray | null;

// let problems = 0;
// let diagnostics: Diagnostic[] = [];
// while ((m = pattern.exec(text)) && problems < 1) {
//     problems++;
//     let diagnosic: Diagnostic = {
//         severity: DiagnosticSeverity.Warning,
//         range: {
//             start: textDocument.positionAt(m.index),
//             end: textDocument.positionAt(m.index + m[0].length)
//         },
//         message: `${m[0]} is all uppercase.`,
//         source: 'ex'
//     };
//     if (hasDiagnosticRelatedInformationCapability) {
//         diagnosic.relatedInformation = [
//             {
//                 location: {
//                     uri: textDocument.uri,
//                     range: Object.assign({}, diagnosic.range)
//                 },
//                 message: 'Spelling matters'
//             },
//             {
//                 location: {
//                     uri: textDocument.uri,
//                     range: Object.assign({}, diagnosic.range)
//                 },
//                 message: 'Particularly for names'
//             }
//         ];
//     }
//     diagnostics.push(diagnosic);
// }
