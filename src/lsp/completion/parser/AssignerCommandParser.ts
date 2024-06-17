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
    const elements = this.splitCommandElements(lineText);
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
    const lineContainsClause = lineText.toUpperCase().includes(" " + clause + " ");
    if (lineContainsClause) {
      return false;
    }
    const elements = this.splitCommandElements(lineText);
    if (elements == undefined) {
      return false;
    }
    if (elements[2] == undefined) {
      return false;
    }
    if (elements[2] != undefined && elements[3] == undefined) {
      return lineText.endsWith(" ");
    }
    const clauseUpper = clause.toUpperCase();
    const splittedUpper = elements[3].toUpperCase().trim();
    const startsWith = clauseUpper.startsWith(splittedUpper);
    return startsWith;
  }

  /**
   * Splits the assigner command into elements
   *
   * @param lineText current line text
   */
  private splitCommandElements(lineText: string): RegExpExecArray | null {
    const trimmedLine = lineText.trim();
    return /(MOVE|SET|SUBTRACT|ADD)(\s+(?:".*"|'.*'|[A-Za-z0-9-\(\)]+))?(\s+(?:[A-Za-z]+))?/gi.exec(trimmedLine);
  }

}
