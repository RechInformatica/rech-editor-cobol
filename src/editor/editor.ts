import { Path } from '../commons/path';
import { TextEditor, window, Range, Selection, Position, OpenDialogOptions, Uri, commands, TextDocumentShowOptions, ViewColumn, workspace } from 'vscode';
import { RechPosition } from '../commons/rechposition';
import { Indenta } from '../indent/indent';
import { GenericExecutor } from '../commons/genericexecutor';
import * as path from 'path';
import * as fs from 'fs';
import { PositionFinder } from './PositionFinder';

/**
 * Class to manipulate vscode editor
 */
export class Editor {
  /** Text editor */
  private editor: TextEditor;
  /** Source expander function */
  private static sourceExpander: GenericExecutor;
  /** function to return the copy hierarchy */
  private static copyHierarchy: GenericExecutor;
  /** Source preprocessor function */
  private static preprocessor: GenericExecutor;
  /** Special class puller */
  private static specialClassPuller: GenericExecutor;
  /** Copy usage locator command */
  private static copyUsageLocator: string;
  /** External Method completion */
  private static externalMethodCompletion: string;

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
    const buffer: string[] = new Array();
    this.editor.selections.forEach(element => {
      buffer.push(this.getRangeBuffer(new Range(element.start, element.end)));
    });
    return buffer;
  }

  /**
   * Returns the range of the current selection
   */
  private getSelectionRange() {
    const range: Range[] = new Array();
    this.editor.selections.forEach(element => {
      range.push(new Range(element.start, element.end));
    });
    return range;
  }

  /**
   * Defines and editor multi selections
   */
  private setSelectionsRange(ranges: Range[]) {
    const selects: Selection[] = new Array();
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
   * Select a range in the text
   *
   * @param start
   * @param end
   */
  public selectRange(start: RechPosition, end: RechPosition) {
    this.editor.selection = new Selection(
      new Position(start.line, start.column),
      new Position(end.line, end.column)
    );
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
  selectWholeLineFromSelection(selection: Selection) {
    if (selection.end.character != 0) {
      const range = new Range(new Position(selection.start.line, 0), new Position(selection.end.line + 1, 0));
      this.setSelectionRange(range);
    } else {
      const range = new Range(new Position(selection.start.line, 0), selection.end);
      this.setSelectionRange(range);
    }
  }

  /**
   * Adjusts selection to select the whole line
   */
  selectWholeLines() {
    const ranges: Range[] = new Array();
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
    const range = this.editor.document.getWordRangeAtPosition(this.editor.selection.start, /([a-zA-Z0-9ÇéâäàçêëèïîÄôöòûùÖÜáíóúñÑÞÂÀãÃÊËÈÞÞÞÌÓÔÒõÕÚÛÙüÉì_\-])+/g);
    if (range === undefined) {
      return '';
    }
    return this.getRangeBuffer(range);
  }

  /**
   * Selects the current word. If the cursor is at the end of the word with active selection, it selects the word to the left. If the cursor is at the beginning of the word or withou active selection, it selects the word to the right.
   */
  selectCurrentWord() {
    let copyWordRight = true;

    const cursor = this.getCursors()[0];
    const range = this.getSelectionRange()[0];

    // If cursor is after word and word is selected
    if (range.start.character != range.end.character &&
      this.getRangeBuffer(range).trim().length > 0 &&
      cursor.column > range.start.character) {
      copyWordRight = false;
    }

    // If cursor is exactly on word's right position (blank character at right)
    if (range.start.character == range.end.character &&
      this.getCurrentLine().charAt(cursor.column) == ' ' &&
      this.getCurrentLine().charAt(cursor.column - 1) != ' ') {
      copyWordRight = false;
    }

    // If cursor is at the end of the line and word is selected
    if (cursor.column == this.getLine(cursor.line).length) {
      copyWordRight = false;
    }

    if (copyWordRight) {
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
   * Return current line
   */
  getCurrentColumn() {
    return this.editor.selection.start.character;
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
   * Returns the text of specified line
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
    const ranges: Range[] = new Array();
    positions.forEach(position => {
      const p = new Position(position.line, position.column);
      ranges.push(new Range(p, p));
    });
    this.setSelectionsRange(ranges);
    this.editor.revealRange(ranges[0], 2);
  }

  /**
   * Define a selection in a given range
   *
   * @param startPos Initial position
   * @param endPos End position
   */
  setSelection(startPos: RechPosition, endPos: RechPosition) {
    const range = new Range(startPos.line, startPos.column, endPos.line - 1, endPos.column)
    this.setSelectionRange(range);
  }

  /**
   * Defines the cursor position for internal usage since it depends on VSCode API
   */
  setCursorPosition(position: RechPosition) {
    const cursor = new Position(position.line, position.column);
    const range = new Range(cursor, cursor);
    this.editor.revealRange(range, 2);
    return this.setSelectionRange(range);
  }

  /**
   * Returns positions of each existing cursors
   * PS: works with multiple cursors
   */
  getCursors() {
    const cursors: RechPosition[] = new Array();
    this.editor.selections.forEach(cursor => {
      cursors.push(new RechPosition(cursor.active.line, cursor.active.character));
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
        const size = this.getLine(selection.start.line).length;
        const diff = column - size;
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
   * Inserts a line break based on the file's line ending (CRLF or LF)
   */
  insertLineBreak() {
    const eol = this.editor.document.eol === 1 ? '\n' : '\r\n';
    return this.insertText(eol);
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
    const options: OpenDialogOptions = {
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
   * Returns an array with the name of all documents currently open in editor
   */
  public getOpenDocumentsNames(): string[] {
    const names: string[] = [];
    workspace.textDocuments.forEach(currentTextEditor => {
      names.push(currentTextEditor.fileName);
    });
    return names;
  }

  /**
   * Opens the specified file ignoring case
   *
   * @param file file to be opened
   * @param callback callback function executed after the file is opened
   */
  public openFileInsensitive(file: string, callback?: () => any) {
    let alreadyOpen = false;
    const names = this.getOpenDocumentsNames();
    names.forEach(currentFile => {
      if (!alreadyOpen && currentFile.toUpperCase() === file.toUpperCase()) {
        this.openFile(currentFile, callback);
        alreadyOpen = true;
      }
    });
    if (!alreadyOpen) {
      this.openFile(file, callback);
    }
  }

  /**
   * Opens the specificied file and set the cursor position
   *
   * @param position
   */
  public openFileAndSetPosition(position: RechPosition) {
    if (position.file) {
      this.openFile(position.file, () => {
        new Editor().setCursor(position.line, position.column);
      });
    } else {
      this.setCursor(position.line, position.column);
    }
  }

  /**
   * Opens the specified file
   *
   * @param file file to be opened
   * @param callback callback function executed after the file is opened
   */
  public openFile(file: string, callback?: () => any) {
    const options: TextDocumentShowOptions = {
      viewColumn: ViewColumn.Active,
      preview: false
    }
    commands.executeCommand('vscode.open', Uri.file(file), options).then(() => {
      if (callback) {
        callback()
      }
    });
  }

  /**
   * Opens the specified folder
   *
   * @param folder folder to be opened
   * @param callback callback function executed after the folder is opened
   */
  public addFolderToWorkspace(folder: string) {
    let index = 0;
    if (workspace.workspaceFolders) {
      index = workspace.workspaceFolders.length
    }
    workspace.updateWorkspaceFolders(index, 0, { uri: Uri.file(folder) });
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
   * Copies the current selection to clipboard, replacing the current selection with the copied text
   */
  copyLines() {
    const currentCursors = this.getCursors();
    const ranges = this.getSelectionRange();
    const cursors: RechPosition[] = [];
    for (let i = 0; i < ranges.length; i++) {
      const range = ranges[i];
      for (let j = range.start.line; j <= range.end.line; j++) {
        cursors.push(new RechPosition(j, range.start.character, this.getCurrentFileName()));
      }
    }

    this.setCursors(cursors);
    commands.executeCommand("editor.action.clipboardCopyAction");
    this.setCursors(currentCursors);
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
    const positionsToReturn = new PositionFinder(this.editor).findPositions(/^ {7}[\w\-\(\)\@\#]+\.(?!.*[a-zA-Z])/g, PositionFinder.FindNext, this.getCurrentLineNumber(1), true);
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
    const positionsToReturn = new PositionFinder(this.editor).findPositions(/^ {7}[\w\-\(\)\@\#]+\.(?!.*[a-zA-Z])/g, PositionFinder.FindPrevious, this.getCurrentLineNumber(-1), true);
    if (positionsToReturn) {
      this.setCursorPosition(new RechPosition(positionsToReturn[0].line, 7));
    } else {
      this.showInformationMessage("Previous paragraph not found");
    }
  }

  /**
   * Get next paragraph position
   */
  getNextParagraphPosition() {
    const positionsToReturn = new PositionFinder(this.editor).findPositions(/^ {7}[\w\-\(\)\@\#]+\.(?!.*[a-zA-Z])/g, PositionFinder.FindNext, this.getCurrentLineNumber(1), true);
    if (positionsToReturn) {
      return new RechPosition(positionsToReturn[0].line, 7);
    } else {
      return new RechPosition(this.editor.document.lineCount, 0)
    }
  }

  /**
   * Go to the previous paragraph
   */
  getPreviousParagraphPosition() {
    const positionsToReturn = new PositionFinder(this.editor).findPositions(/^ {7}[\w\-\(\)\@\#]+\.(?!.*[a-zA-Z])/g, PositionFinder.FindPrevious, this.getCurrentLineNumber(-1), true);
    if (positionsToReturn) {
      return new RechPosition(positionsToReturn[0].line, 7);
    } else {
      return new RechPosition(0, 0);
    }
  }

  /**
   * Go to the next blank line
   */
  findNextBlankLine() {
    // Find a next blank line
    let positionsToReturn = new PositionFinder(this.editor).findPositions(/^ *$/g, PositionFinder.FindNext, this.getCurrentLineNumber(1), true);
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
    let positionsToReturn = new PositionFinder(this.editor).findPositions(/^ *$/g, PositionFinder.FindPrevious, this.getCurrentLineNumber(-1), true);
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
  async indent(alignment: string) {
    const selections = this.editor.selections;
    const cursors = this.getCursors();

    for (let i = 0; i < selections.length; i++) {
      const selection = selections[i];

      this.selectWholeLineFromSelection(selection);

      const indenter = new Indenta();
      const selectionBuffer = this.getSelectionBuffer();

      if (indenter.isAllCommentaryLines(selectionBuffer)) {
        // Asynchronous process for comment indentation
        await new Promise<void>((resolve) => {
          indenter.indentCommentary(selectionBuffer, (buffer) => {
            this.replaceSelection(buffer.toString())
              .then(() => resolve());
          });
        });
        continue;
      }

      // Asynchronous process for normal indentation
      await new Promise<void>((resolve, reject) => {
        indenter.indenta(
          alignment,
          selectionBuffer,
          this.getPath().toString(),
          this.editor.selection.start.line,
          async (buffer) => {
            try {
              await this.replaceSelection(buffer.toString());

              // Adjusts the selection to the new buffer size
              const linesDiff = buffer.join().split(/\n/).length
                - selectionBuffer.join().split(/\n/).length;

              for (let j = i; j < selections.length; j++) {
                const newStartLine = selections[j].start.line + linesDiff;
                const newEndLine = selections[j].end.line + linesDiff;
                selections[j] = new Selection(
                  new Position(newStartLine, selections[j].start.character),
                  new Position(newEndLine, selections[j].end.character)
                );
              }

              resolve();
            } catch (error) {
              reject(error);
            }
          },
          (bufferErr) => {
            this.showWarningMessage(bufferErr);
            reject(bufferErr);
          }
        );
      });
    }

    // Restore the cursor position
    this.setCursors(cursors);
  }

  /**
   * Replace buffer content
   *
   * @param buffer
   * @param restoreCursor
   */
  private replaceBuffer(buffer: string[], restoreCursor: RechPosition) {
    this.replaceSelection(buffer.toString());
    // Restore original cursor if necessary. This won't keep selection on entire line after a single line indentation
    if (restoreCursor != null) {
      this.setCursorPosition(restoreCursor);
    }

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
   * Returns the basename of the file currently open in editor without the extension
   */
  getCurrentFileBaseNameWithoutExtension() {
    const fileName = this.getCurrentFileBaseName();
    return fileName.substr(0, fileName.length - 4);
  }

  /**
   * Returns the extension of the file currently open in editor
   */
  getCurrentFileBaseNameExtension() {
    const fileName = this.getCurrentFileBaseName();
    return fileName.substr(fileName.length - 3, fileName.length);
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
    Editor.sourceExpander = sourceExpander
  }

  /**
   * Returns the source expander function
   *
   * @param sourceExpander
   */
  public static getSourceExpander() {
    return Editor.sourceExpander
  }

  /**
   * Define the function to return the copy hierarchy
   *
   * @param copyHierarchy
   */
  public static setCopyHierarchy(copyHierarchy: GenericExecutor) {
    Editor.copyHierarchy = copyHierarchy
  }

  /**
   * Returns the function to return the copy hierarchy
   *
   * @param copyHierarchy
   */
  public static getCopyHierarchy() {
    return Editor.copyHierarchy
  }

  /**
   * Define the function to return the available classes
   *
   * @param specialClassPuller
   */
  public static setSpecialClassPuller(specialClassPuller: GenericExecutor) {
    Editor.specialClassPuller = specialClassPuller
  }

  /**
   * Define the function to return the available classes
   */
  public static getSpecialClassPuller() {
    return Editor.specialClassPuller;
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
   */
  public static getPreprocessor() {
    return this.preprocessor
  }

  /**
   * Define the copy usage locator function
   *
   * @param copyUsageLocator
   */
  public static setCopyUsageLocator(copyUsageLocator: string) {
    this.copyUsageLocator = copyUsageLocator
  }

  /**
   * Returns the copy usage locator function
   */
  public static getCopyUsageLocator() {
    return this.copyUsageLocator
  }

  /**
   * Define the external method completion
   *
   * @param externalMethodCompletion
   */
  public static setExternalMethodCompletion(externalMethodCompletion: string) {
    this.externalMethodCompletion = externalMethodCompletion
  }

  /**
   * Returns the external method completion
   */
  public static getExternalMethodCompletion() {
    return this.externalMethodCompletion
  }

  /**
   * Returns true if the source is readOnly
   */
  public isReadOnly() {
    return ((fs.statSync(this.editor.document.uri.fsPath).mode & 146) == 0)
  }

}
