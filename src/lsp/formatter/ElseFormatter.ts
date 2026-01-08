import { TextEdit } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { IfFormatter } from "./IfFormatter";

/** End Cobol column */
const END_COBOL_COLUMN = 120;

/**
 * Class to format Cobol 'else'
 */
export class ElseFormatter implements FormatterInterface {

  /** RegExp that identifies if it is the ELSE clause*/
  public static ELSE_REGEXP = /\s+(ELSE|else).*/;

  /**
   * Generates an array of Text Edits for source code formatting
   *
   * @param line line number where cursor is positioned
   * @param column column number where cursor is positioned
   * @param lines document lines
   */
  public generate(line: number, _column: number, lines: string[]): TextEdit[] {
    const startColumn = this.findStartColumn(line, lines);
    return [this.createElseTextEdit(line, startColumn)];
  }

  /**
   * Find the 'if' column
   *
   * @param line current line
   * @param lines document lines
   */
  public findStartColumn(line: number, lines: string[]) {
    let depth = 0;
    for (let i = line; i > 0; i--) {
      const trimLine = lines[i].trim();
      if (CompletionUtils.isTheParagraphOrMethodDeclaration(lines[i])) {
        break
      }
      if (lines[i].trim().toLowerCase().startsWith("end-if")) {
        depth++;
      } else {
        if (trimLine.toLowerCase().startsWith("if ") || trimLine.toLowerCase() == "if") {
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
     * Creates a TextEdit with the 'else' clause already formatted
     *
     * @param line line where the 'else' clause will be inserted
     * @param column column where the 'else' clause will be inserted
     */
  public createElseTextEdit(line: number, column: number): TextEdit {
    const text = CompletionUtils.fillSpacesBetween(0, column) + "else";
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
