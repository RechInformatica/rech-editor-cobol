import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { IfFormatter } from "./IfFormatter";
import { FormatterUtils } from "./FormatterUtils";

/** End Cobol column */
const END_COBOL_COLUMN = 120;

/**
 * Class to format Cobol 'else'
 */
export class ElseFormatter implements FormatterInterface {

  /** RegExp that identifies if it is the WHEN clause*/
  public static ELSE_REGEXP = /\s+(ELSE|else).*/;

  /**
   * Generates an array of Text Edits for source code formatting
   *
   * @param line line number where cursor is positioned
   * @param column column number where cursor is positioned
   * @param lines document lines
   */
  public generate(line: number, _column: number, lines: string[]): TextEdit[] {
    let startColumn = this.findStartColumn(line, lines);
    return [this.createElseTextEdit(line, startColumn)];
  }

  /**
   * Find the 'if' column
   *
   * @param line current line
   * @param lines document lines
   */
  private findStartColumn(line: number, lines: string[]) {
    for (let i = line; i > 0; i--) {
      if (IfFormatter.IF_REGEXP.exec(lines[i])) {
        return CompletionUtils.countSpacesAtBeginning(lines[i]);
      }
    }
    return CompletionUtils.countSpacesAtBeginning(lines[line]);
  }

  /**
     * Creates a TextEdit with the 'when' clause already formatted
     *
     * @param line line where the 'when' clause will be inserted
     * @param column column where the 'when' clause will be inserted
     */
  public createElseTextEdit(line: number, column: number): TextEdit {
    let text = CompletionUtils.fillMissingSpaces(column, 0) + " ELSE,";
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
      newText: text
    };
  }
}
