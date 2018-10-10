'use babel';
import { Editor } from '../editor/editor';
import { RechPosition } from '../editor/rechposition';
import * as Colunas from './colunas';

export class GeradorCobol {
  editor: Editor;

  constructor() {
    this.editor = new Editor();
  }

  /**
   * Insert a command "MOVE"
   */
  async move() {
    await this.editor.type("MOVE");
    await this.gotoCol(Colunas.COLUNA_A);
  }

  /**
   * Insert a command "SPACES"
   */
  spaces() {
    this.editor.type("SPACES");
  }

  /**
   * Insert a command "ZEROS"
   */
  zeros() {
    this.editor.type("ZEROS");
  }

  /**
   * Insert a command "LOW-VALUES"
   */
  lowvalues() {
    this.editor.type("LOW-VALUES");
  }

  /**
   * Insert a command "To"
   */
  async to() {
    await this.gotoColTo();
    await this.editor.type("TO");
    await this.gotoCol(Colunas.COLUNA_C);
  }

  /**
   * Copy entire line to clipboard wherever the cursor is
   */
  copyLine() {
    let originalCursors: RechPosition[] = this.editor.getCursors();
    this.editor.selectWholeLines();
    this.editor.clipboardCopy();
    this.editor.setCursors(originalCursors);
  }

  /**
   * Paste clipboard in a new line wherever the cursor is
   */
  pasteLine() {
    let cursor = this.editor.getCursors()[0];
    this.editor.cursorLineStart();
    this.editor.clipboardPaste();
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

  /**
   * Vai para a coluna do TO
   */
  gotoColTo() {
    if (this.editor.getCurrentLineSize() < Colunas.COLUNA_B) {
      return this.gotoCol(Colunas.COLUNA_B);
    } else {
      if (this.editor.getCurrentLineSize() >= 31) {
        return this.gotoCol(Colunas.COLUNA_C);
      } else {
        return this.editor.type(" ");
      }
    }
  }

  /**
   * Vai para uma coluna
   */
  gotoCol(coluna: number) {
    if (this.editor.getCurrentLineSize() < coluna - 1) {
      return this.editor.setColumn(coluna - 1);
    } else {
      return this.editor.type(" ");
    }
  }
};