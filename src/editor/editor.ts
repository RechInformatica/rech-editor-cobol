import { Path } from './../commons/path';

import {TextEditor, window, Range, Selection, Position, OpenDialogOptions, Uri, commands} from 'vscode';

/**
 * Class to manipulate vscode editor
 */
export default class Editor {
  editor: TextEditor;

  constructor() {
    this.editor = <TextEditor> this.getActiveEditor();
  }


  /**
   * Return file path
   */
  getPath() {
    return new Path(this.editor.document.fileName).toString();
  }

   /**
   * Return the document text
   */
  getEditorBuffer() {
    return this.editor.document.getText();
  }

  /**
   * Return the text selected
   */
  getSelectionBuffer() {
    let buffer: string[] = new Array();
    this.editor.selections.forEach(element => { 
      buffer.push(this.getRangeBuffer(new Range(element.start, element.end)));
    });
    return buffer;
  }

  /**
   * Return range of selection
   */
  getSelectionRange() {
    let range: Range[] = new Array();
    this.editor.selections.forEach(element => {
      range.push(new Range(element.start, element.end));
    });
    return range;
  }

   /**
   * Define a editor selection
   */
  setSelectionRange(range: Range) {
    this.editor.selection = new Selection(range.start, range.end);
  }

   /**
   * Define multiple editor selections
   */
  setSelectionRanges(range: Range[]) {
    let selections: Selection[] = [];
    range.forEach(element => {
      selections.push(new Selection(element.start, element.end));
    });
    this.editor.selections = selections;
  }

   /**
   * Return the text of a range
   */
  getRangeBuffer(range: Range) {
    return this.editor.document.getText(range);
  }

  /**
   * Change text of selection
   */
  replaceSelection(buffer: string) {
    this.editor.edit(editBuilder => {
      this.editor.selections.forEach(element => {
        editBuilder.replace(element, buffer);
      });
    });
  }
  
  /**
   * Adjust selection to select the whole line
   */
  selectWholeLines() {
    let range = new Range (new Position(this.editor.selection.start.line, 0), new Position(this.editor.selection.end.line + 1, 0));
    this.setSelectionRange(range);
  }

  /**
   * Return current word
   */
  getCurrentWord() {
    let range = this.editor.document.getWordRangeAtPosition(this.editor.selection.start);
    if(range === undefined){
      return '';
    }
    return this.getRangeBuffer(range);
  }

  /**
   * Select the current word
   */
  selectCurrentWord() {
    let range = this.editor.document.getWordRangeAtPosition(this.editor.selection.start);
    if(range === undefined){
      return;
    }
    this.setSelectionRange(range);
  }

  /**
   * Return current line
   */
  getCurrentRow() {
    return this.editor.selection.start.line;
  }

  /**
   * Replace current line with a string
   */
  setCurrentLine(text: String) {
    this.editor.edit(editBuilder => {
      editBuilder.replace(new Range(new Position(this.editor.selection.start.line, 0), new Position(this.editor.selection.end.line + 1, 0)), text + "\n");
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
    return this.getLine(this.editor.selection.start.line);
  }

  /**
   * Return the text of current line
   */
  getLine(lineIndex: number) {
    return this.editor.document.lineAt(lineIndex).text;
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
    return new Position(this.editor.selection.start.line, this.editor.selection.start.character);
  }  

  /**
   * Set the cursor to a column
   * OBS: works with multiple cursors
   */
  setColumn(column: number) {
    let range: Range[] = [];
    this.editor.selections.forEach(element => {
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
    this.editor.edit(editBuilder => {
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
   * Position the cursor on column, type a text in editor and go to specified column 
   * 
   * @param text Text to insert in editor
   * @param endcolumn Cursor position after the text insertion 
   * @param startcolumn Cursor position before the text insertion
   */
  type(text: string, endcolumn?: number, startcolumn?: number) {
    // Coluna inicial
    let stacol = 0;
    // Coluna final
    let endcol = 0;
    if (startcolumn != undefined){
      stacol = this.gotoCol(startcolumn);
    }
    if (endcolumn != undefined){
      endcol = this.gotoCol(endcolumn - stacol - text.length);
    }
    this.insertText(" ".repeat(stacol) + text + " ".repeat(endcol));
  }

  /**
   * Calculate the position to column after a text insertion
   */
  gotoCol(coluna: number) {
    let position = this.getCursor().character;
    if (position < coluna) {
      return coluna - position - 1;
    } else {
      return 1;
    }
  }


  /**
   * Insert a text in current selection
   * OBS: works with multiple cursors
   */
  insertText(text: string) {
    /* Insert the text into the selections from user */
    this.editor.edit(editBuilder => {
      this.editor.selections.forEach(element => {
        editBuilder.insert(element.start, text);
      });
    });
  }  
  
  /**
   * Move down the cursor
   */
  moveDown() {
    commands.executeCommand('cursorDown');
  } 
  
  /**
   * Move up the cursor
   */
  moveUp() {
    commands.executeCommand('cursorUp');
  }

  /**
   * Opens dialog for file selection
   */
  showOpenDialog(defaultDir?: string) {
    let options: OpenDialogOptions = {
      openLabel: 'Abrir arquivo'
    };
    if (defaultDir) {
      options.defaultUri = Uri.file(defaultDir);
    }
    return window.showOpenDialog(options);
  } 
  /**
   * Show a information message
   */
  showInformationMessage(message: string){
    window.showInformationMessage(message);
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
export {Editor};