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
    this.editor.type("MOVE", Colunas.COLUNA_A);
  }

  /**
   * Digita Spaces
   */
  spaces() {
    this.editor.type("SPACES");
  }

  /**
   * Digita Zeros
   */
  zeros() {
    this.editor.type("ZEROS");
  }

  /**
   * Digita LowValues
   */
  lowvalues() {
    this.editor.type("LOWVALUES");
  }

  /**
   * Digita To
   */
  to() {
    this.editor.type("TO", Colunas.COLUNA_C, this.gotoColTo());
  }


  /**
   * Adiciona um comentário
   */
  // comment(commentText: string) {
  //   this.editor.insertSnippetAboveCurrentLineNoIdent("      *>-> ");
  //   this.type(commentText);
  // }

  /**
   * Adjust the position of command "TO"
   */
  gotoColTo() {
    let position = this.editor.getCursor().character;
    if (position < Colunas.COLUNA_B) {
      return Colunas.COLUNA_B;
    } else {
      if (position >= 31) {
        return Colunas.COLUNA_C;
      } else {
        return 1;
      }
    }
  }


};