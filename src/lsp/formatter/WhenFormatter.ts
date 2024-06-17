import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { EvaluateFormatter } from "./EvaluateFormatter";

/** End Cobol column */
const END_COBOL_COLUMN = 120;

/**
 * Class to format Cobol 'evaluate'
 */
export class WhenFormatter implements FormatterInterface {

  /** RegExp that identifies if it is the WHEN clause*/
  public static WHEN_REGEXP = /^ +(WHEN|when).*/;
  /** RegExp that identifies if it is the WHEN clause with parameters*/
  public static WHEN_WITH_PARAM_REGEXP = /^ +(WHEN|when)\s+.+/;

  /**
   * Generates an array of Text Edits for source code formatting
   *
   * @param line line number where cursor is positioned
   * @param column column number where cursor is positioned
   * @param lines document lines
   */
  public generate(line: number, _column: number, lines: string[]): TextEdit[] {
    // If enter is typed subtract it from line number
    const lineText = lines[line];
    const match = WhenFormatter.WHEN_WITH_PARAM_REGEXP.exec(lineText);
    if (!match) {
      const whenStartColumn = this.evaluateColumn(line, lines) + 3;
      return [this.createWhenTextEdit(line, whenStartColumn)];
    }
    return [];
  }

  /**
   * Find the evaluate column for the
   *
   * @param lineNumber
   * @param lines
   */
  private evaluateColumn(lineNumber: number, lines: string[]) {
    for (let i = lineNumber; i > 0; i--) {
      if (EvaluateFormatter.EVALUATE_REGEXP.exec(lines[i])) {
        return CompletionUtils.countSpacesAtBeginning(lines[i]);
      }
    }
    return CompletionUtils.countSpacesAtBeginning(lines[lineNumber]);
  }

  /**
   * Creates a TextEdit with the 'when' clause already formatted
   *
   * @param line line where the 'when' clause will be inserted
   * @param column column where the 'when' clause will be inserted
   */
  public createWhenTextEdit(line: number, column: number): TextEdit {
    const textToInsert = "when";
    let whenText = "";
    whenText = CompletionUtils.fillSpacesBetween(0, column) + textToInsert;
    return {
      range: {
        start: {
          line: line,
          character: 0
        },
        end: {
          line: line,
          character: END_COBOL_COLUMN
        }
      },
      newText: whenText
    };
  }
}
