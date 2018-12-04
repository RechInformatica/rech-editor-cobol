import { Path } from '../commons/path';
import { TextEditor, window, Range, Selection, Position, OpenDialogOptions, Uri, commands, TextDocumentShowOptions, ViewColumn } from 'vscode';
import { RechPosition } from './rechposition';
import { Indenta } from '../indent/indent';
import { GenericExecutor } from '../commons/genericexecutor';
import * as path from 'path';
import { PositionFinder } from './PositionFinder';

/**
 * Class to manipulate vscode editor
 */
export class Editor {
  /** Text editor */
  private editor: TextEditor;
  /** Source expander function */
  private static sourceExpander: GenericExecutor;
  /** Source preprocessor function */
  private static preprocessor: GenericExecutor;
  
  constructor() {
    this.editor = <TextEditor>this.getActiveEditor();
  }

  /**
   * Returns the file path
   */
  getPath(): Path {
    return new Path(this.editor.document.fileName);
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
  private getSelectionRange() {
    let range: Range[] = new Array();
    this.editor.selections.forEach(element => {
      range.push(new Range(element.start, element.end));
    });
    return range;
  }

  /**
   * Defines and editor multi selections
   */
  private setSelectionsRange(ranges: Range[]) {
    let selects: Selection[] = new Array();
    ranges.forEach(range => {
      selects.push(new Selection(range.start, range.end))
    });
    this.editor.selections = selects;
  }

  /**
  * Defines an editor selection
  */
  private setSelectionRange(range: Range) {
    this.editor.selection = new Selection(range.start, range.end);
  }

  /**
  * Returns the text of the specified range
  */
  private getRangeBuffer(range: Range) {
    return this.editor.document.getText(range);
  }

  /**
   * Changes the text found in the specified selection
   */
  replaceSelection(buffer: string) {
    return this.editor.edit(editBuilder => {
      this.editor.selections.forEach(element => {
        editBuilder.replace(element, buffer);
      });
    });
  }

  /**
   * Adjusts selection to select the whole line
   */
  selectWholeLines() {
    let ranges: Range[] = new Array();
    // Adjusts each range to fill whole line with selection
    this.getSelectionRange().forEach(range => {
      if (range.isEmpty || range.end.character != 0) {
        ranges.push(new Range(new Position(range.start.line, 0), new Position(range.end.line + 1, 0)));
      } else {
        ranges.push(new Range(new Position(range.start.line, 0), range.end));
      }
    });
    this.setSelectionsRange(ranges);
  }

  /**
   * Returns the current word
   */
  getCurrentWord() {
    let range = this.editor.document.getWordRangeAtPosition(this.editor.selection.start, /([a-zA-Z0-ÇéâäàçêëèïîÄôöòûùÖÜáíóúñÑÁÂÀãÃÊËÈÍÎÏÌÓÔÒõÕÚÛÙüÉì_\-])+/g);
    if (range === undefined) {
      return '';
    }
    return this.getRangeBuffer(range);
  }

  /**
   * Selects the current word
   */
  selectCurrentWord() {
    //
    // None of the functions below works in all cases. Testing where is the cursor can detect which one to use
    //
    // If cursor is exactly on word's left position (blank character at left)
    if (this.getCursors()[0].column == 0 ||
        this.getCurrentLine().charAt(this.getCursors()[0].column - 1) == ' ') {
      commands.executeCommand("cursorWordRight");
      commands.executeCommand("cursorWordLeftSelect");
    } else {
      commands.executeCommand('cursorWordStartLeft');
      commands.executeCommand('cursorWordEndRightSelect');
    }
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
    return this.editor.edit(editBuilder => {
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
   * Returns the current line text
   */
  private getCurrentLineNumber(add?: number) {
    if (add == undefined) {
      add = 0;
    }
    return this.editor.document.lineAt(this.editor.selection.start.line + add);
  }

  /**
   * Defines the cursor line and cloumn
   *
   * @param line
   * @param column
   */
  setCursor(line: number, column: number) {
    this.setCursorPosition(new RechPosition(line, column));
  }

  /**
   * Defines the cursor position
   * PS: works with multiple cursors
   *
   * @param Positions
   */
  setCursors(positions: RechPosition[]) {
    let ranges: Range[] = new Array();
    positions.forEach(position => {
      let p = new Position(position.line, position.column);
      ranges.push(new Range(p, p));
    });
    this.setSelectionsRange(ranges);
    this.editor.revealRange(ranges[0], 2);
  }

  /**
   * Defines the cursor position for internal usage since it depends on VSCode API
   */
  setCursorPosition(position: RechPosition) {
    let cursor = new Position(position.line, position.column);
    let range = new Range(cursor, cursor);
    this.editor.revealRange(range, 2);
    return this.setSelectionRange(range);
  }

  /**
   * Returns positions of each existing cursors
   * PS: works with multiple cursors
   */
  getCursors() {
    let cursors: RechPosition[] = new Array();
    this.editor.selections.forEach(cursor => {
      cursors.push(new RechPosition(cursor.start.line, cursor.start.character));
    });
    return cursors;
  }

  /**
   * Sets the cursor to a column, adding right spaces if necessary
   * PS: works with multiple cursors
   */
  async setColumn(column: number) {
    /* Insert the text into the selections from user */
    await this.editor.edit(editBuilder => {
      this.editor.selections.forEach(selection => {
        let size = this.getLine(selection.start.line).length;
        let diff = column - size;
        if (diff > 0) {
          editBuilder.insert(new Position(selection.start.line, size), " ".repeat(diff));
        }
      });
    });
    await this.cursorLineStart();
    await commands.executeCommand('cursorMove', { to: 'right', value: column });
  }

  /**
  * Returns true if this file is a bat file
  */
  isBat(): boolean {
    return this.getPath().toString().toLowerCase().endsWith(".bat");
  }

  /**
   * Returns true if this file is a ruby file
   */
  isRuby(): boolean {
    return this.getPath().toString().toLowerCase().endsWith(".rb");
  }

  /**
   * Returns true if this file is a copy COBOL file
   */
  isCopy(): boolean {
    return (this.getPath().toString().toLowerCase().endsWith(".cpy") || this.getPath().toString().toLowerCase().endsWith(".cpb"));
  }

  /**
   * Types a text in editor
   *
   * @param text Text to insert in editor
   */
  type(text: string) {
    return this.insertText(text);
  }

  /**
   * Inserts a text in the current selection
   * PS: works with multiple cursors
   */
  insertText(text: string) {
    /* Insert the text into the selections from user */
    return this.editor.edit(editBuilder => {
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
   * @param callback callback function executed after the file is opened
   */
  openFile(file: string, callback?: () => any) {
    let options: TextDocumentShowOptions = {
      viewColumn: ViewColumn.Active,
      preview: false
    }
    window.showTextDocument(Uri.file(file), options).then(() => {
      if (callback) {
        callback()
      }
    });
  }

  /**
   * Shows a warning message
   */
  showWarningMessage(message: string) {
    window.showWarningMessage(message);
  }

  /**
   * Shows an information message
   */
  showInformationMessage(message: string) {
    window.showInformationMessage(message);
  }

  /**
   * Copy word under the cursor to clipboard
   */
  clipboardCopyWord() {
    this.selectCurrentWord();
    this.clipboardCopy();
  }

  /**
   * Replace word under the cursor with clipboard content
   */
  clipboardReplaceWord() {
    this.selectCurrentWord();
    this.clipboardPaste();
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
    return commands.executeCommand('editor.action.clipboardPasteAction');
  }

  /**
   * Set cursor to start of line
   */
  cursorLineStart() {
    return commands.executeCommand('cursorLineStart')
  }

  /**
   * Set cursor to end of line
   */
  cursorLineEnd() {
    return commands.executeCommand('cursorLineEnd')
  }

  /**
   * Inserts a blank line below
   */
  insertLineBelow() {
    commands.executeCommand('editor.action.insertLineAfter');
    return commands.executeCommand('editor.action.trimTrailingWhitespace');
  }

  /**
   * Inserts a blank line above
   */
  insertLineAbove() {
    commands.executeCommand('editor.action.insertLineBefore');
    return commands.executeCommand('editor.action.trimTrailingWhitespace');
  }

  /**
   * Go to the next paragraph
   */
  findNextParagraph() {
    let positionsToReturn = new PositionFinder(this.editor).findPositions(/^\s{7}[\w\-]+\.(?!.*[a-zA-Z])/g, PositionFinder.FindNext, this.getCurrentLineNumber(1), true);
    if (positionsToReturn) {
      this.setCursorPosition(new RechPosition(positionsToReturn[0].line, 7));
    } else {
      this.showInformationMessage("Next paragraph not found");
    }
  }

  /**
   * Go to the previous paragraph
   */
  findPreviousParagraph() {
    let positionsToReturn = new PositionFinder(this.editor).findPositions(/^\s{7}[\w\-]+\.(?!.*[a-zA-Z])/g, PositionFinder.FindPrevious, this.getCurrentLineNumber(-1), true);
    if (positionsToReturn) {
      this.setCursorPosition(new RechPosition(positionsToReturn[0].line, 7));
    } else {
      this.showInformationMessage("Previous paragraph not found");
    }
  }

  /**
   * Go to the next blank line
   */
  findNextBlankLine() {
    // Find a next blank line
    let positionsToReturn = new PositionFinder(this.editor).findPositions(/^\s*$/g, PositionFinder.FindNext, this.getCurrentLineNumber(1), true);
    // If not found a blank line or the line found is the last line
    if (positionsToReturn == undefined || positionsToReturn[0].line >= (this.editor.document.lineCount - 1)) {
      this.showInformationMessage("Next blank line not found");
      return;
    }
    // Find the next line after a blank line with content
    positionsToReturn = new PositionFinder(this.editor).findPositions(/[^\s]/g, PositionFinder.FindNext, this.editor.document.lineAt(positionsToReturn[0].line), true);
    // If returned a position and the line found is not the last line from document
    if (positionsToReturn && positionsToReturn[0].line < (this.editor.document.lineCount - 1)) {
      this.setCursorPosition(new RechPosition(positionsToReturn[0].line, 0));
    } else {
      this.showInformationMessage("Next blank line not found");
    }
  }

  /**
   * Go to the previous blank line
   */
  findPreviousBlankLine() {
    // Find a previous blank line
    let positionsToReturn = new PositionFinder(this.editor).findPositions(/^\s*$/g, PositionFinder.FindPrevious, this.getCurrentLineNumber(-1), true);
    // If not found a blank line or the line found is the last line
    if (positionsToReturn == undefined) {
      this.showInformationMessage("Previous blank line not found");
      return;
    }
    // Find the previous line before a blank line with content
    positionsToReturn = new PositionFinder(this.editor).findPositions(/[^\s]/g, PositionFinder.FindPrevious, this.editor.document.lineAt(positionsToReturn[0].line), true);
    // If returned a position and the line found is not the last line from document
    if (positionsToReturn) {
      this.setCursorPosition(new RechPosition(positionsToReturn[0].line, 0));
    } else {
      this.showInformationMessage("Previous blank line not found");
    }
  }

  /**
  /**
   * Shows input box and executes the specified callback when Enter is pressed
   *
   * @param placeholder text placeholder to be shown when no text is typed
   * @param prompt prompt message
   * @param callback callback executed when Enter is pressed
   * @param valuedef a default value to prefill in the input box
   */
  showInputBox(placeholder: string, prompt: string, callback: (info: string | undefined) => any, valuedef?: string) {
    window.showInputBox({
      value: valuedef,
      placeHolder: placeholder,
      prompt: prompt
    }).then((info) => callback(info));
  }

  /**
   * Indent the selection Buffer
   */
  indent(alignment: string) {
    // If doesn't have selection, backup actual cursor to restore it later
    let restoreCursor: RechPosition;
    if (this.getSelectionRange().length == 1 && this.getSelectionRange()[0].isEmpty) {
      restoreCursor = this.getCursors()[0];
    }
    // Select whole lines of the selection range
    this.selectWholeLines();
    //Indent the selection range
    new Indenta().indenta(alignment, this.getSelectionBuffer(), this.getPath().toString(), (buffer) => {
      this.replaceSelection(buffer.toString());
      // Restore original cursor if necessary. This won't keep selection on entire line after a single line indentation
      if (restoreCursor != null) {
        this.setCursorPosition(restoreCursor);
      }
    }, (bufferErr) => { this.showWarningMessage(bufferErr); });
  }

  /**
   * Returns the basename of the file currently open in editor
   */
  getCurrentFileBaseName() {
    return path.basename(this.getCurrentFileName());
  }

  /**
   * Returns the directory of the file currently open in editor
   */
  getCurrentFileDirectory() {
    return new Path(this.getCurrentFileName()).directory();
  }

  /**
   * Returns the full name of the file currently open in editor including it's directory
   */
  getCurrentFileName() {
    return this.editor.document.fileName;
  }

  /**
   * Close the active editor
   */
  closeActiveEditor() {
    commands.executeCommand('workbench.action.closeActiveEditor');
  }

  /**
   * Save file on active editor
   */
  saveActiveEditor() {
    commands.executeCommand('workbench.action.files.save');
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
  private getActiveEditor() {
    return window.activeTextEditor;
  }

  
  /**
   * Define the source expander function
   * 
   * @param sourceExpander 
   */
  public static setSourceExpander(sourceExpander: GenericExecutor) {
    this.sourceExpander = sourceExpander
  }
  
  /**
   * Returns the source expander function
   * 
   * @param sourceExpander 
   */
  public static getSourceExpander() {
    return this.sourceExpander
  }

  /**
   * Define the preprocessor function
   * 
   * @param preprocessor 
   */
  public static setPreprocessor(preprocessor: GenericExecutor) {
    this.preprocessor = preprocessor
  }
  
  /**
   * Returns the preprocessor function
   * 
   * @param sourceExpander 
   */
  public static getPreprocessor() {
    return this.preprocessor
  }

}