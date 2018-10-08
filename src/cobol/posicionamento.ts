'use babel';
import { Editor } from '../editor/editor';

/**
 * Módulo responsável pela identação de fontes Cobol
 */
export class Posicionamento {

  /**
   * Posiciona na área A
   */
  posicionaAreaA() {
    this.posicionaColuna(8);
  }

  /**
   * Posiciona na área B
   */
  posicionaAreaB() {
    this.posicionaColuna(12);
  }

  /**
   * Posiciona na coluna A
   */
  posicionaColunaA() {
    this.posicionaColuna(20);
  }

  /**
   * Posiciona na coluna B
   */
  posicionaColunaB() {
    this.posicionaColuna(30);
  }

  /**
   * Posiciona na coluna C
   */
  posicionaColunaC() {
    this.posicionaColuna(35);
  }

  /**
   * Posiciona na coluna do VALUE
   */
  posicionaColunaValue() {
    this.posicionaColuna(51);
  }

  /**
   * Posiciona na coluna especificada
   */
  posicionaColuna(coluna: number) {
    let editor = new Editor();
    editor.setColumn(coluna - 1);
  }

};
