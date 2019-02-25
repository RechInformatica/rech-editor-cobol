/**
 * Class to parse Cobol commands that assign content to the specified variable
 */
export class AssignerCommandParser {

  /**
   * Returns the first content element (tipically a variable) used in the assigner command
   *
   * @param lineText current line text
   */
  public getFirstContentElement(lineText: string): string {
    let elements = this.splitCommandElements(lineText);
    if (elements == undefined) {
      return "";
    }
    return elements[2] == undefined ? "" : elements[2];
  }

  /**
   * Returns true if the assigner clause (tipically TO or FROM) should be suggested
   *
   * @param lineText current line text
   * @param clause clause to be tested
   */
  public shouldSuggestClause(lineText: string, clause: string): boolean {
    let lineContainsClause = lineText.toUpperCase().includes(" " + clause + " ");
    if (lineContainsClause) {
      return false;
    }
    let elements = this.splitCommandElements(lineText);
    if (elements == undefined) {
      return false;
    }
    if (elements[2] == undefined) {
      return false;
    }
    if (elements[2] != undefined && elements[3] == undefined) {
      return this.removeEnters(lineText).endsWith(" ");
    }
    let clauseUpper = clause.toUpperCase();
    let splittedUpper = elements[3].toUpperCase().trim();
    let startsWith = clauseUpper.startsWith(splittedUpper);
    return startsWith;
  }

  /**
   * Splits the assigner command into elements
   *
   * @param lineText current line text
   */
  private splitCommandElements(lineText: string): RegExpExecArray | null {
    let trimmedLine = this.removeEnters(lineText).trim();
    return /(MOVE|SET|SUBTRACT|ADD)(\s+(?:".*"|'.*'|[A-Za-z0-9-\(\)]+))?(\s+(?:[A-Za-z]+))?/gi.exec(trimmedLine);
  }

  /**
   * Remove enters from the specified line text
   *
   * @param lineText current line text
   */
  private removeEnters(lineText: string) {
    return lineText.replace("\n", "").replace("\r", "");
  }

}
