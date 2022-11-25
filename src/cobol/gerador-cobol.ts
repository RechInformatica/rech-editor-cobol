'use babel';
import { Editor } from '../editor/editor';
import { RechPosition } from '../commons/rechposition';
import * as Colunas from './colunas';
import * as os from 'os';
import { isNull } from 'util';
import { MoveInverter } from './MoveInverter';

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
    const replacedBuffer = new MoveInverter().invertOperators(selectedBuffer[0]);
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
    await this.insertCommentLineWithText("");
  }

  /**
   * Insert a comment line above with the specified text
   *
   * @param commentText comment text to be inserted
   */
  async insertCommentLineWithText(commentText: string) {
    await this.editor.insertLineAbove();
    await this.editor.type("      *>-> " + commentText);
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
   * Centralize a cobol comment
   */
  async centralizeComment() {
    let lineText = this.editor.getCurrentLine();
    let regexComment = /^ *\*>.*/;
    let commentContent = lineText.match(regexComment);
    let regexCommentType = /\*>(->)*/;
    let startComment = lineText.match(regexCommentType);
    if (isNull(commentContent) || isNull(startComment)) return;
    let startCommentDelimiter = startComment[0];
    let endCommentDelimiter = startCommentDelimiter.split("").reverse().join("").replace(/>/g, "<");
    let regexCommentContent = /[^\>]*\b.*(\b|\B)/;
    commentContent = regexCommentContent.exec(commentContent[0].toString().replace(endCommentDelimiter, ""));
    if (isNull(commentContent)) return;
    let comment = commentContent[0].toString().trim();
    let commentSizeMax = (Colunas.COLUNA_FIM - Colunas.AREA_A - startCommentDelimiter.length - endCommentDelimiter.length + 2);

    if (!/[a-z]/.exec(commentContent.toString())) {
      comment = this.removeHighlight(comment);
      comment = this.addHighlight(comment);
    }
    comment = `      ${startCommentDelimiter}${" ".repeat((commentSizeMax - comment.length) / 2)}${comment}${" ".repeat(Math.ceil((commentSizeMax - comment.length) / 2))}${endCommentDelimiter}`;
    await this.editor.setCurrentLine(comment);
  }


  /**
    * Add Highlight from text
    */
  private addHighlight(comment: string): string {
    // Percent of comment size to limit the size of highlight
    let commentUpper = comment;
    if (comment.length < 26) {
        commentUpper = comment.split('').join('  ').toUpperCase();
    } else {
        if (comment.length < 46) {
            commentUpper = comment.split('').join(' ').toUpperCase();
        }
    }
    return commentUpper;
  }

  /**
    * Remove Highlight from text
    */
  private removeHighlight(comment: string): string {
    let spaces = /\s+/.exec(comment);
    if (isNull(spaces)) return comment;
    let spaceLengthGreater = spaces.reduce((p, v) => (p.length > v.length ? v : p)).length;
    let spaceLengthLesser = spaces.reduce((p, v) => (p.length < v.length ? v : p)).length;
    if (spaceLengthGreater === 1) return comment;
    let spaceLength = spaceLengthGreater === spaceLengthLesser ? spaceLengthGreater : spaceLengthGreater - 1;
    let spaceRegex = new RegExp(`\\s{${spaceLength}}`, "g");
    comment = comment.replace(spaceRegex, "");
    return comment;
  }

  /**
   * Inserts or removes dots in the end of the current line
   */
  async updateLineDots() {
    let originalPosotion = this.editor.getCursors()[0];
    let lineText = this.editor.getCurrentLine().trimRight();
    switch (true) {
      case lineText.length > Colunas.COLUNA_FIM: {
        this.removeExceedingDots(lineText).then().catch();
        break;
      }
      case lineText.length == Colunas.COLUNA_FIM: {
        this.removeDotsAtEnd(lineText).then().catch();
        break;
      }
      default: {
        this.fillLineWithDots(lineText).then().catch();
      }
    }
    await this.editor.setCursorPosition(originalPosotion);
  }

  /**
   * Removes exceeding dots at the end of the line
   *
   * @param lineText line text
   */
  private async removeExceedingDots(lineText: string) {
    while (lineText.endsWith(".") && lineText.length > Colunas.COLUNA_FIM) {
      lineText = lineText.slice(0, -1);
    }
    await this.editor.setCurrentLine(lineText);
  }

  /**
   * Removes dots in the end of the current line
   *
   * @param lineText line text
   */
  private async removeDotsAtEnd(lineText: string) {
    while (lineText.endsWith(".")) {
      lineText = lineText.slice(0, -1);
    }
    await this.editor.setCurrentLine(lineText);
  }

  /**
   * Fills the end of the current line with dots
   *
   * @param lineText line text
   */
  private async fillLineWithDots(lineText: string) {
    let dots = "";
    let missingDotsNumber = Colunas.COLUNA_FIM - lineText.length;
    if (missingDotsNumber > 0) {
      for (var i = 1; i <= missingDotsNumber; i++) {
        dots = dots.concat(".");
      }
      await this.editor.setCurrentLine(lineText + dots);
    }
  }

};