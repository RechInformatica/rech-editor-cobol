import { TextEditor, TextLine, TextDocument } from 'vscode';
import { RechPosition } from '../commons/rechposition'

/**
 * Class to scan and find thing in editor
 */
export class PositionFinder {

  /** Busca próximos */
  public static readonly FindNext = 1
  /** Busca Anteriores */
  public static readonly FindPrevious = 2
  /** Editor */
  private editor: TextEditor;

  /**
   * Constructor of Find
   *
   * @param editor
   */
  constructor(editor: TextEditor) {
    this.editor = editor;
  }

  /**
   * Find the line positions of the regex
   *
   * @param regex
   * @param direction
   * @param startLineToFind
   * @param returnFrst
   */
  public findPositions(regex: RegExp, direction: number, startLineToFind?: TextLine, returnFrst?: boolean): RechPosition[] | undefined {
    let startLine = 0;
    if (startLineToFind) {
      startLine = startLineToFind.lineNumber;
    }
    const document = this.editor.document;
    // If direction next
    if (direction == PositionFinder.FindNext) {
      return this.findNextPositions(regex, startLine, document, returnFrst);
    } else {
      // If direction previous
      return this.findPreviousPositions(regex, startLine, document, returnFrst);
    }
  }

  /**
   * Find the next positions
   *
   * @param regex
   * @param startLine
   * @param document
   * @param returnFrst
   */
  private findNextPositions(regex: RegExp, startLine: number, document: TextDocument, returnFrst?: boolean): RechPosition[] | undefined {
    let positionsToReturn = new Array<RechPosition>();
    // If the start lina is greater than the last line of the document
    if (startLine > document.lineCount) {
      return;
    }
    for (let lineNumber = startLine; lineNumber < document.lineCount; lineNumber++) {
      let p = this.findMacherAtLine(regex, lineNumber, document);
      if (p) {
        positionsToReturn = positionsToReturn.concat(p)
        if (returnFrst) {
          break;
        }
      }
    }
    if (positionsToReturn.length > 0) {
      return (positionsToReturn);
    }
  }

  /**
   * * Find the previous positions
   *
   * @param regex
   * @param startLine
   * @param document
   * @param returnFrst
   */
  private findPreviousPositions(regex: RegExp, startLine: number, document: TextDocument, returnFrst?: boolean): RechPosition[] | undefined {
    let positionsToReturn = new Array<RechPosition>();
    for (let lineNumber = startLine; lineNumber > 0; lineNumber--) {
      let p = this.findMacherAtLine(regex, lineNumber, document);
      if (p) {
        positionsToReturn = positionsToReturn.concat(p)
        if (returnFrst) {
          break;
        }
      }
    }
    if (positionsToReturn.length > 0) {
      return (positionsToReturn);
    }
  }

  /**
   * Find the macher position at line
   *
   * @param regex
   * @param lineNumber
   * @param document
   */
  private findMacherAtLine(regex: RegExp, lineNumber: number, document: TextDocument): RechPosition[] | undefined {
    let result: RechPosition[] = [];
    let lineText = document.lineAt(lineNumber);
    let matcher = lineText.text.match(regex);
    if (matcher) {
      matcher.forEach((match) => {
        let column = lineText.text.indexOf(match);
        if (!(column > 0)) {
          column = 1;
        }
        result.push(new RechPosition(lineText.lineNumber, column));
      })
      return result;
    }
  }

}