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
   * Generate the SIM and NAO flag declaration
   */
  async flagGenerator(){
    // Verify if the current line is a variable declaration
    if (!await this.isVariableDeclaration()){
        this.editor.showInformationMessage("Isso não é uma declaração de variável!");
        return;
    }
    // Save original position
    let originalCursors: RechPosition[] = this.editor.getCursors();
    // Find the first word column
    let wordcolumn = await this.firstWordColumn();
    // Get the line in focous
    let line = await this.editor.getCurrentLine();
    // Remove left whitespace
    line = line.trimLeft();
    // Remove duplicate whitespaces
    line = line.replace(/\s+/g,' ');
    // Create a array with each word from the line
    let linesplitted = line.split(" ");
    // The variable name, the suffix of SIM value and the suffix of NAO value
    let varname, varsim, varnao = '';
    // Verify if is a FD file
    let regex = /.*(WREG)+.*/g;
    if(regex.test(this.editor.getCurrentFileBaseName())){
        // Return the variable name with the prefix
        varname = linesplitted[1];
        // Indicate that between value name and sufix has not a hyphen
        varsim = 'SIM';
        varnao = 'NAO';
    } else {
        // Find where the prefix
        let posprefixo = linesplitted[1].indexOf("-");
        // Return the variable name without the prefix
        varname = linesplitted[1].substring(posprefixo + 1);
        // Indicate that between value name and sufix has a hyphen
        varsim = '-SIM';
        varnao = '-NAO';
    }
    // Insert 88 SIM value
    await this.editor.insertLineBelow();
    await this.gotoCol(wordcolumn + 3);
    await this.editor.type("88 " + varname + varsim);
    await this.gotoCol(Colunas.COLUNA_VALUE);
    await this.editor.type("VALUE IS 1.");
    // Insert 88 NAO value
    await this.editor.insertLineBelow();
    await this.gotoCol(wordcolumn + 3);
    await this.editor.type("88 " + varname + varnao);
    await this.gotoCol(Colunas.COLUNA_VALUE);
    await this.editor.type("VALUE IS 2.");
    // Return to original position
    this.editor.setCursors(originalCursors);
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

  /**
   * Vai para a coluna do TO
   */
  private gotoColTo() {
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
  private gotoCol(coluna: number) {
    if (this.editor.getCurrentLineSize() < coluna - 1) {
      return this.editor.setColumn(coluna - 1);
    } else {
      return this.editor.type(" ");
    }
  }

  /**
   * Validate if the current line is a cobol variable declaration
   */
  private async isVariableDeclaration() {
    // Get the line in focous
    let line = await this.editor.getCurrentLine();
    // Create a array with each word from the line
    let linesplitted = line.split(" ");
    // Find if the line is a variable declaration
    let vardeclaration = false;
    linesplitted.forEach(element => {
        if (element.toUpperCase() === "PIC"){
            vardeclaration = true;
        }
    });
    return vardeclaration;
  }
  /**
   * 
   */
  private async firstWordColumn() {
    // Get the line in focous
    let line = await this.editor.getCurrentLine();
    // Find the first word column
    let firstWordColumn: number = line.search(/\S|$/) + 1;
    return firstWordColumn;
  }

};