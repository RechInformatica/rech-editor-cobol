'use babel';
import Path from '../commons/path';

import {window, Range, Selection, Position} from 'vscode';

/**
 * Class to manipulate vscode editor
 */
export default class Editor {

  /**
   * Return file path
   */
  getPath() {
    return new Path(this.getActiveEditor().document.fileName).toString();
  }

   /**
   * Return the document text
   */
  getEditorBuffer() {
    return this.getActiveEditor().document.getText();
  }

  /**
   * Return the text selected
   */
  getSelectionBuffer() {
    let editor = this.getActiveEditor();
    let buffer: string[] = new Array();
    editor.selections.forEach(element => { 
      buffer.push(this.getRangeBuffer(new Range(element.start, element.end)));
    });
    return buffer;
  }

  /**
   * Return range of selection
   */
  getSelectionRange() {
    let editor = this.getActiveEditor();
    let range: Range[] = new Array();
    editor.selections.forEach(element => {
      range.push(new Range(element.start, element.end));
    });
    return range;
  }

   /**
   * Define a editor selection
   */
  setSelectionRange(range: Range) {
    this.getActiveEditor().selection = new Selection(range.start, range.end);
  }

   /**
   * Define multiple editor selections
   */
  setSelectionRanges(range: Range[]) {
    let editor = this.getActiveEditor();
    let selections: Selection[] = [];
    range.forEach(element => {
      selections.push(new Selection(element.start, element.end));
    });
    editor.selections = selections;
  }

   /**
   * Return the text of a range
   */
  getRangeBuffer(range: Range) {
    return this.getActiveEditor().document.getText(range);
  }

  /**
   * Change text of selection
   */
  replaceSelection(buffer: string) {
    let editor = this.getActiveEditor();
    editor.edit(editBuilder => {
      editor.selections.forEach(element => {
        editBuilder.replace(element, buffer);
      });
    });
  }
  
  /**
   * Adjust selection to select the whole line
   */
  selectWholeLines() {
    let editor = this.getActiveEditor();
    let range = new Range (new Position(editor.selection.start.line, 0), new Position(editor.selection.end.line + 1, 0));
    this.setSelectionRange(range);
  }

  /**
   * Return current word
   */
  getCurrentWord() {
    let editor = this.getActiveEditor();
    let pattern = /([\w\-]|\(@\)|\(#\))+/g;
    let range = editor.document.getWordRangeAtPosition(editor.selection.start, pattern);
    if(range === undefined){
      return '';
    }
    return this.getRangeBuffer(range);
  }

  /**
   * Select the current word
   */
  selectCurrentWord() {
    let editor = this.getActiveEditor();
    let pattern = /([\w\-]|\(@\)|\(#\))+/g;
    let range = editor.document.getWordRangeAtPosition(editor.selection.start, pattern);
    if(range === undefined){
      return;
    }
    this.setSelectionRange(range);
  }

  /**
   * Return current line
   */
  getCurrentRow() {
    return this.getActiveEditor().selection.start.line;
  }

  /**
   * Replace current line with a string
   */
  setCurrentLine(text: String) {
    let editor = this.getActiveEditor();
    editor.edit(editBuilder => {
      editBuilder.replace(new Range(new Position(editor.selection.start.line, 0), new Position(editor.selection.end.line + 1, 0)), text + "\n");
    });    
  }
  
   /**
   * Return length of current line
   */
  getCurrentLineSize() {
    return this.getCurrentLine().replace(/ +$/, '').length;
  }

  /**
   * Return current line text
   */
  getCurrentLine() {
    return this.getLine(this.getActiveEditor().selection.start.line);
  }

  /**
   * Return the text of current line
   */
  getLine(lineIndex: number) {
    let editor = this.getActiveEditor();
    return editor.document.lineAt(lineIndex).text;
  }

  /**
   * Define the cursor position
   */
  setCursor(cursor: Position) {
    return this.setSelectionRange(new Range(cursor, cursor));
  }

  /**
   * Return the cursor position
   */
  getCursor() {
    return new Position(this.getActiveEditor().selection.start.line, this.getActiveEditor().selection.start.character);
  }  

  /**
   * Set the cursor to a column
   * OBS: works with multiple cursors
   */
  gotoColumn(column: number) {
    let editor = this.getActiveEditor();
    let range: Range[] = [];
    editor.selections.forEach(element => {
      let size = this.getLine(element.start.line).length;
      let diff = column - size;
      if (diff > 0) {
        this.setTextPosition(new Position(element.end.line, size), " ".repeat(diff));
      }
      range.push(new Range(new Position(element.start.line, column), new Position(element.start.line, column)));
    });
    this.setSelectionRanges(range);
  }

  /**
   * Insert text in a position
   */
  setTextPosition(Position: Position, text: string) {
    let editor = this.getActiveEditor();
    editor.edit(editBuilder => {
      editBuilder.insert(Position, text);
    });    
  }

   /**
   * Return if this file is a bat file
   */
  isBat() {
    return this.getPath().toLowerCase().endsWith(".bat");
  }
  
  /**
   * Return if this file is a ruby file
   */
  isRuby() {
    return this.getPath().toLowerCase().endsWith(".rb");
  } 
  
  /**
   * Type a text in editor
   */
  type(text: string) {
    this.insertText(text);
  }

  /**
   * Insert a text in current selection
   * OBS: works with multiple cursors
   */
  insertText(text: string) {
    let editor = this.getActiveEditor();
    editor.edit(editBuilder => {
      editor.selections.forEach(element => {
        editBuilder.insert(element.start, text);
      });
    });
  }  
  
  /**
   * Move down the cursor
   */
  moveDown() {
    this.move(1);
  } 
  
  /**
   * Move up the cursor
   */
  moveUp() {
    this.move(-1);
  }

  /**
   * Move the cursor up/down n times
   */
  move(num: number){
    let editor = this.getActiveEditor();
    let newselection: Selection[] = [];
    editor.selections.forEach(element => {
      newselection.push(new Selection(new Position(element.start.line + num, element.start.character),new Position(element.end.line + num, element.end.character)));
    });
    editor.selections = newselection;
  }

  /**
   * TODO:
   * findFilePath
   * insertSnippetAboveCurrentLine
   * insertSnippetAboveCurrentLineNoIdent
   * scan
   * paste
   * gotoLineStart
   * gotoLineEnd
   * showFindAndReplaceDialog
   * findNext
   * findPrevious
   * backspace
   * currentLineReplace
   */

   /**
   * Return active editor
   */
  getActiveEditor() {
    return window.activeTextEditor;
  }

}