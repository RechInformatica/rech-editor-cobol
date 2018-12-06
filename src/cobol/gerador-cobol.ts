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
   * Insert a command "To"
   */
  async to() {
    await this.gotoColTo();
    await this.editor.type("TO");
    await this.gotoCol(Colunas.COLUNA_C);
  }

  /**
   * Insert a command "Else" in a new line below
   */
  async else() {
    let indentColumn = this.currentIndentLevel();
    await this.editor.cursorLineEnd();
    // Mount text to insert, filling with spaces to reach correct indent level before and after ELSE statement
    await this.editor.type("\n" + " ".repeat(indentColumn - 3) + "ELSE,\n" + " ".repeat(indentColumn));
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
   * Generate the SIM and NAO flag declaration
   */
  async flagGenerator() {
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
   * Return indentation level (column) of current line
   */
  private currentIndentLevel() {
    // Get the line in focous
    return this.editor.getCurrentLine().search(/\S|$/);
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