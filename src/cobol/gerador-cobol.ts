'use babel';
import { Editor } from '../editor/editor';
import { RechPosition } from '../editor/rechposition';
import * as Colunas from './colunas';
import * as os from 'os';

export class GeradorCobol {
  editor: Editor;

  constructor() {
    this.editor = new Editor();
  }

  /**
   * Insert/toggle terminators dot/comma at end of line
   */
  endLineToggle(char: string) {
    let line = this.editor.getCurrentLine();
    let lastChar = line.charAt(line.length - 1);
    if (lastChar == char) {
      return;
    }
    // If line already ends with a terminator
    if (lastChar == '.' || lastChar == ',') {
      line = line.substr(0, line.length - 1) + char;
    } else {
      line = line + char;
    }
    // Replace current line with the new one mounted with the terminator
    this.editor.setCurrentLine(line);
  }

  /**
   * Invert operators of COBOL MOVE command in all selected lines
   */
  async invertMoveOperators() {
    this.editor.selectWholeLines();
    let selectedBuffer = this.editor.getSelectionBuffer();
    /**
     * Regex to find all COBOL MOVE commands in current selection. There are 4 elements between () used to replace
     *    1º - Spaces starting line. These keep the current indent level
     *    2º - 1st MOVE's operator. Used to invert with the 2nd MOVE's operator
     *    3º - 2nd MOVE's operator. Used to invert with the 1st MOVE's operator
     *    4º - Other elements endind line (dot/comma, inline comments and line break character)
     */
    let regex = /^( +)MOVE +([a-zA-Z0-9_\-\(\)]+) +TO +([a-zA-Z0-9_\-\(\)]+)(.*$)/gmi;
    let replacedBuffer = selectedBuffer[0].replace(regex, "$1MOVE $3 TO $2$4");
    await this.editor.replaceSelection(replacedBuffer);
    await this.editor.indent("N");
  }

  /**
   * Paste clipboard in a new line wherever the cursor is
   */
  async pasteLine() {
    let cursor = this.editor.getCursors()[0];
    await this.editor.clipboardPaste();
    this.editor.setCursor(cursor.line, cursor.column);
  }

  /**
   * Insert a new line above, keeping the cursor in the same position
   */
  async newLineAbove() {
    let position = this.editor.getCursors()[0].column;
    await this.editor.insertLineAbove();
    // Somente realoca o cursor se a coluna original já não era zero.
    // Obs: insertLineAbove() já deixa o cursor posicionado na coluna 0
    if (position != 0) {
      await this.editor.setColumn(position);
    }
  }

  /**
   * Insert a comment line above
   */
  async insertCommentLine() {
    await this.editor.insertLineAbove();
    await this.editor.type("      *>-> ");
  }

  /**
   * Insert a comment line above with "TODO: <username> <current date>"
   */
  async insertCommentLineTodo() {
    await this.editor.insertLineAbove();
    await this.editor.type(`      *>-> TODO:(${os.userInfo().username} ${new Date().toLocaleDateString()}): `);
  }

  /**
   * Insert a comment statement starting current line
   */
  async insertStartComment() {
    await this.editor.setColumn(Colunas.AREA_A - 2);
    await this.editor.type("*>-> ");
  }

  /**
   * Insert a comment statement ending current line
   */
  async insertStartEndComment() {
    await this.editor.setColumn(Colunas.COLUNA_FIM - 4);
    await this.editor.type("<-<*");
  }

  /**
   * Insert a Cobol line separator
   */
  async insertLineSeparator() {
    let position = this.editor.getCursors()[0];
    await this.editor.insertLineAbove();
    await this.editor.type("      *>--------------------------------------------------------------------------------------------------------------<*");
    await this.editor.setCursorPosition(new RechPosition(position.line + 1, position.column));
  }

  /**
   * Inserts or removes dots in the end of the current line
   */
  async updateLineDots() {
    let originalPosotion = this.editor.getCursors()[0];
    let lineText = this.editor.getCurrentLine();
    if (lineText.length == Colunas.COLUNA_FIM && lineText.endsWith(".")) {
      this.removeDotsAtEnd();
    } else {
      this.fillLineWithDots();
    }
    await this.editor.setCursorPosition(originalPosotion);
  }

  /**
   * Removes dots in the end of the current line
   */
  private async removeDotsAtEnd() {
    let lineText = this.editor.getCurrentLine();
    while (lineText !== "" && lineText.endsWith(".")) {
      lineText = lineText.slice(0, -1);
    }
    await this.editor.setCurrentLine(lineText);
  }

  /**
   * Fills the end of the current line with dots
   */
  private async fillLineWithDots() {
    let lineText = this.editor.getCurrentLine().replace(/\s+$/, ''); // Removes trailling spaces
    var dots: string = "";
    var missingDotsNumber = Colunas.COLUNA_FIM - lineText.length;
    if (missingDotsNumber > 0) {
      for (var i = 1; i <= missingDotsNumber; i++) {
        dots = dots.concat(".");
      }
      await this.editor.setCurrentLine(lineText + dots);
    }
  }

};