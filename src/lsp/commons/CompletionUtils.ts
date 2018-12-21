/** Maximum number of interpreted lines */
const MAX_INTERPRETED_LINES = 50;

/**
 * Utili class for Cobol code completion and formatting
 */
export class CompletionUtils {
  /**
   * Returns the number of spaces in the beginning of the specified string
   *
   * @param lineText line text
   */
  public static countSpacesAtBeginning(lineText: string) {
    for (let index = 0; index < lineText.length; index++) {
      if (lineText.charAt(index) !== " ") {
        return index;
      }
    }
    return lineText.length;
  }

  /**
   * Fills missing spaces between the current cursor column and the target final
   * column.
   *
   * Example:
   * CompletionUtils.fillMissingSpaces(10, 5) -> generates "    " (four spaces)
   * CompletionUtils.fillMissingSpaces(5, 1) -> generates "   " (three spaces)
   *
   * If the cursor column is equal or greater than the target final column, a single
   * space is added so the completion will not be attached to previous text in the line.
   *
   * Example:
   * CompletionUtils.fillMissingSpaces(10, 10) -> generates " " (single space)
   * CompletionUtils.fillMissingSpaces(10, 12) -> generates " " (single space)
   *
   * @param targetFinalColumn final column until where spaces should be inserted
   * @param currentCursorColumn column where cursor is currently positioned
   */
  public static fillMissingSpaces(targetFinalColumn: number, currentCursorColumn: number): string {
    let missingSpaces = targetFinalColumn - currentCursorColumn;
    let text = "";
    for (var i = 1; i < missingSpaces; i++) {
      text = text.concat(" ");
    }
    if (text.length === 0) {
      text = " ";
    }
    return text;
  }

  /**
   * Returns the Cobol command separator for the specified column
   *
   * @param column target column
   */
  public static separatorForColumn(column: number): string {
    if (column <= 12) {
      return ".";
    }
    return ",";
  }

  /**
   * Returns {@code true} if the source is lower case
   *
   * @param sourceBuffer
   */
  public static isLowerCaseSource(sourceBuffer: string[]) {
    for (let i = 0; i < sourceBuffer.length && i < MAX_INTERPRETED_LINES; i++) {
      // Dismiss comments
      if (sourceBuffer[i].trim().startsWith("*>")) {
        continue;
      }
      // Test header clauses
      if (/\s+(identification|program-id|copy|working-storage|procedure)(\s|.|,)/g.exec(sourceBuffer[i])) {
        return true;
      }
      // Test procedure clauses
      if (/\s+(perform|exit|evaluate|move)(\s|.|,)/g.exec(sourceBuffer[i])) {
        return true;
      }
      // Test working-storage clauses
      if (/.*\s(pic|value|values|class)(\s|.|,)/g.exec(sourceBuffer[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns the number of the first character on the specified line
   */
  public static getFirstCharacterColumn(lineText: string): number {
    for (let i = 0; i < lineText.length; i++) {
      if (lineText.charAt(i) !== " ") {
        return i;
      }
    }
    return 0;
  }

  /**
   * Returns true if the lineText is the paragraph declaration
   *
   * @param lineText
   */
  public static isTheParagraphDeclaration(lineText: string): boolean {
    if (/^\s{7}[\w\-\(\)\@\#]+\.(?!.*[a-zA-Z])/g.exec(lineText)) {
      return true;
    }
    return false;
  }

}
