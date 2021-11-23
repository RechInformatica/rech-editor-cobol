import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { IfFormatter } from "./IfFormatter";

/** End Cobol column */
const END_COBOL_COLUMN = 120;

/**
 * Class to format Cobol 'catch'
 */
export class CatchFormatter implements FormatterInterface {

  /** RegExp that identifies if it is the CATCH clause*/
  public static CATCH_REGEXP = /\s+(CATCH|catch).*/;

  /**
   * Generates an array of Text Edits for source code formatting
   *
   * @param line line number where cursor is positioned
   * @param column column number where cursor is positioned
   * @param lines document lines
   */
  public generate(line: number, _column: number, lines: string[]): TextEdit[] {
    let startColumn = this.findStartColumn(line, lines);
    return [this.createCatchTextEdit(line, startColumn)];
  }

  /**
   * Find the 'try' column
   *
   * @param line current line
   * @param lines document lines
   */
  public findStartColumn(line: number, lines: string[]) {
    let depth = 0;
    for (let i = line; i > 0; i--) {
      if (CompletionUtils.isTheParagraphOrMethodDeclaration(lines[i])) {
        break
      }
      if (lines[i].trim().toLowerCase().startsWith("end-try")) {
        depth++;
      } else {
        if (lines[i].trim().toLowerCase().startsWith("try")) {
          depth--;
        }
      }
      if (depth < 0) {
        return CompletionUtils.countSpacesAtBeginning(lines[i]);
      }
    }
    return CompletionUtils.countSpacesAtBeginning(lines[line]);
  }

  /**
     * Creates a TextEdit with the 'catch' clause already formatted
     *
     * @param line line where the 'catch' clause will be inserted
     * @param column column where the 'catch' clause will be inserted
     */
  public createCatchTextEdit(line: number, column: number): TextEdit {
    let text = CompletionUtils.fillSpacesBetween(0, column) + "catch";
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
