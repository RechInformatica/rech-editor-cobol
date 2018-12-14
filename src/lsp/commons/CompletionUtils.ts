/** Maximum number of interpreted lines */
const MAX_INTERPRETED_LINES = 20;

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
   * Fills missing spaces for clauses declaration considering the column
   * where the cursor is currently positioned
   *
   * @param startColumn initial column
   * @param initialColumn cursor column
   */
  public static fillMissingSpaces(
    startColumn: number,
    initialColumn: number
  ): string {
    let missingSpaces = startColumn - initialColumn;
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
      // Test header clauses
      if (/\s+(identification|program-id|copy|working-storage|procedure)\s/g.exec(sourceBuffer[i])) {
        return true;
      }
      // Test procedure clauses
      if (/\s+(perform|exit|evaluate|move)\s/g.exec(sourceBuffer[i])) {
        return true;
      }
      // Test working-storage clauses
      if (/.*\s(pic|value|values|class)\s/g.exec(sourceBuffer[i])) {
        return true;
      }
    }
    return false;
  }
}
