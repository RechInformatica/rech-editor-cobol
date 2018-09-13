import { Path } from './../commons/path';
import { TextEditor, window, Range, Selection, Position, OpenDialogOptions, Uri, commands, TextDocumentShowOptions, ViewColumn } from 'vscode';

/**
 * Class to manipulate vscode editor
 */
export default class Editor {
  editor: TextEditor;

  constructor() {
    this.editor = <TextEditor>this.getActiveEditor();
  }

  /**
   * Returns the file path
   */
  getPath() {
    return new Path(this.editor.document.fileName).toString();
  }

  /**
  * Returns the document's text
  */
  getEditorBuffer() {
    return this.editor.document.getText();
  }

  /**
   * Returns the selected text
   */
  getSelectionBuffer() {
    let buffer: string[] = new Array();
    this.editor.selections.forEach(element => {
      buffer.push(this.getRangeBuffer(new Range(element.start, element.end)));
    });
    return buffer;
  }

  /**
   * Returns the range of the current selection
   */
  getSelectionRange() {
    let range: Range[] = new Array();
    this.editor.selections.forEach(element => {
      range.push(new Range(element.start, element.end));
    });
    return range;
  }

  /**
  * Defines an editor selection
  */
  setSelectionRange(range: Range) {
    this.editor.selection = new Selection(range.start, range.end);
  }

  /**
  * Defines multiple editor selections
  */
  setSelectionRanges(range: Range[]) {
    let selections: Selection[] = [];
    range.forEach(element => {
      selections.push(new Selection(element.start, element.end));
    });
    this.editor.selections = selections;
  }

  /**
  * Returns the text of the specified range
  */
  getRangeBuffer(range: Range) {
    return this.editor.document.getText(range);
  }

  /**
   * Changes the text found in the specified selection
   */
  replaceSelection(buffer: string) {
    this.editor.edit(editBuilder => {
      this.editor.selections.forEach(element => {
        editBuilder.replace(element, buffer);
      });
    });
  }

  /**
   * Adjusts selection to select the whole line
   */
  selectWholeLines() {
    commands.executeCommand('cursorLineStart');
    commands.executeCommand('cursorEndSelect');
  }

  /**
   * Returns the current word
   */
  getCurrentWord() {
    let range = this.editor.document.getWordRangeAtPosition(this.editor.selection.start);
    if (range === undefined) {
      return '';
    }
    return this.getRangeBuffer(range);
  }

  /**
   * Selects the current word
   */
  selectCurrentWord() {
    commands.executeCommand('cursorWordStartLeft');
    commands.executeCommand('cursorWordEndRightSelect');
  }

  /**
   * Return current line
   */
  getCurrentRow() {
    return this.editor.selection.start.line;
  }

  /**
   * Replaces current line with a string
   */
  setCurrentLine(text: String) {
    this.editor.edit(editBuilder => {
      editBuilder.replace(new Range(new Position(this.editor.selection.start.line, 0), new Position(this.editor.selection.end.line + 1, 0)), text + "\n");
    });
  }

  /**
  * Returns the length of current line
  */
  getCurrentLineSize() {
    return this.getCurrentLine().replace(/ +$/, '').length;
  }

  /**
   * Returns the current line text
   */
  getCurrentLine() {
    return this.getLine(this.editor.selection.start.line);
  }

  /**
   * Returns the text of current line
   */
  getLine(lineIndex: number) {
    return this.editor.document.lineAt(lineIndex).text;
  }

  /**
   * Defines the cursor position
   */
  setCursor(cursor: Position) {
    return this.setSelectionRange(new Range(cursor, cursor));
  }

  /**
   * Returns the cursor position
   */
  getCursor() {
    return new Position(this.editor.selection.start.line, this.editor.selection.start.character);
  }

  /**
   * Sets the cursor to a column
   * PS: works with multiple cursors
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
   * Inserts text in a position
   */
  setTextPosition(Position: Position, text: string) {
    this.editor.edit(editBuilder => {
      editBuilder.insert(Position, text);
    });
  }

  /**
  * Returns true if this file is a bat file
  */
  isBat() {
    return this.getPath().toLowerCase().endsWith(".bat");
  }

  /**
   * Returns true if this file is a ruby file
   */
  isRuby() {
    return this.getPath().toLowerCase().endsWith(".rb");
  }

  /**
   * Sets the cursor on the specified column, types a text in editor and returns to the specified column 
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
    if (startcolumn != undefined) {
      stacol = this.gotoCol(startcolumn);
    }
    if (endcolumn != undefined) {
      endcol = this.gotoCol(endcolumn - stacol - text.length);
    }
    this.insertText(" ".repeat(stacol) + text + " ".repeat(endcol));
  }

  /**
   * Calculates the position to column after a text insertion
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
   * Inserts a text in the current selection
   * PS: works with multiple cursors
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
   * Moves the cursor down
   */
  moveDown() {
    commands.executeCommand('cursorDown');
  }

  /**
   * Moves the cursor up
   */
  moveUp() {
    commands.executeCommand('cursorUp');
  }

  /**
   * Shows open dialog for file selection
   * 
   * @param defaultDir default directory
   * @param callback callback function called for each selected file
   */
  showOpenDialog(defaultDir: string, callback: (file: string) => any) {
    let options: OpenDialogOptions = {
      openLabel: 'Abrir arquivo'
    };
    if (defaultDir) {
      options.defaultUri = Uri.file(defaultDir);
    }
    window.showOpenDialog(options).then(selectedFiles => {
      if (selectedFiles) {
        selectedFiles.forEach(currentFile => {
          callback(currentFile.fsPath);
        });
      }
    });
  }

  /**
   * Opens the specified file
   * 
   * @param file file to be opened
   */
  openFile(file: string) {
    let options: TextDocumentShowOptions = {
      viewColumn: ViewColumn.Active,
      preview: false
    }
    window.showTextDocument(Uri.file(file), options);
  }

  /**
   * Shows an information message
   */
  showInformationMessage(message: string) {
    window.showInformationMessage(message);
  }

  /**
   * Copies the current selection to clipboard
   */
  clipboardCopy() {
    commands.executeCommand('editor.action.clipboardCopyAction');
  }

  /**
   * Pastes clipboard 
   */
  clipboardPaste() {
    commands.executeCommand('editor.action.clipboardPasteAction');
  }

  /**
   * Inserts a blank line above
   */
  insertLineAbove() {
    commands.executeCommand('editor.action.insertLineBefore');
    return commands.executeCommand('deleteAllLeft');
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
  * Returns the active editor
  */
  getActiveEditor() {
    return window.activeTextEditor;
  }
}
export { Editor };