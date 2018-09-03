'use babel';
import { Editor } from './editor';
import * as Colunas from '../identa/colunas';

export default class GeradorCobol {
  editor: Editor;

  constructor() {
    this.editor = new Editor();
  }

  /**
   * Insert a command "MOVE"
   */
  move() {
    this.typewithcolumn("MOVE", Colunas.COLUNA_A);
  }

  /**
   * Digita Spaces
   */
  spaces() {
    this.type("SPACES");
  }

  /**
   * Digita Zeros
   */
  zeros() {
    this.type("ZEROS");
  }

  /**
   * Digita LowValues
   */
  lowvalues() {
    this.type("LOWVALUES");
  }

  /**
   * Digita To
   */
  to() {
    this.gotoColTo();
    this.type("TO");
    this.gotoCol(Colunas.COLUNA_C);
  }


  /**
   * Insert a text and move the cursor to coumn
   */
  typewithcolumn(text: string, column: number){
    this.type(text + " ".repeat(this.gotoCol(column - text.length)));
  }

  /**
   * Insert a text
   */
  type(text: string) {
    this.editor.type(text);
  }
  

  /**
   * Adiciona um comentário
   */
  // comment(commentText: string) {
  //   this.editor.insertSnippetAboveCurrentLineNoIdent("      *>-> ");
  //   this.type(commentText);
  // }

  /**
   * Go to a defined column
   */
  gotoColTo() {
    let position = this.editor.getCursor().character;
    if (position < Colunas.COLUNA_B) {
      return Colunas.COLUNA_B - position - 1;
    } else {
      if (position >= 31) {
        return Colunas.COLUNA_C - position - 1;
      } else {
        return 1;
      }
    }
  }

  /**
   * Vai para uma coluna
   */
  gotoCol(coluna: number) {
    let position = this.editor.getCursor().character;
    if (position < coluna) {
      return coluna - position - 1;
    } else {
      return 1;
    }
  }

};