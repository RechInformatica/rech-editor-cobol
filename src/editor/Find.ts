import { TextEditor, Position, TextLine, TextDocument } from 'vscode';
import { ParserCobol } from '../cobol/parsercobol'

/**
 * Class to scan and find thing in editor
 */
export class Find {
  /** Busca próximos */
  static readonly FindNext = 1
  /** Busca Anteriores */
  static readonly FindPrevious = 2
  
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
 * Find position of the declaration of the term
 * 
 * @param term 
 */
  findPositionOfDeclaration(term: string): Position | undefined {
    let parse = new ParserCobol();
    let document = this.editor.document;
    for (let lineNumber = 0; lineNumber < document.lineCount; lineNumber++) {
      if (parse.isDeclaration(term, document.lineAt(lineNumber).text)) {
        let match = <RegExpMatchArray> document.lineAt(lineNumber).text.match(/[a-zA-Z]/);
        return new Position(lineNumber, <number>match.index);
      }
    }
  }

  /**
   * Find the line positions of the regex
   * 
   * @param regex 
   * @param startLineToFind 
   */
  findPositions(regex: RegExp, direction: number, startLineToFind?:TextLine, returnFrst?: boolean): Position[] | undefined {
    let startLine = 0;
    if (startLineToFind) {
      startLine = startLineToFind.lineNumber;
    }
    let document = this.editor.document;
    // If direction next
    if (direction == Find.FindNext){
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
  private findNextPositions(regex: RegExp, startLine: number, document: TextDocument, returnFrst?: boolean): Position[] | undefined {
    let positionsToReturn = new Array<Position>();
    // If the start lina is greater than the last line of the document
    if (startLine > document.lineCount){
      return;
    }
    for (let lineNumber = startLine; lineNumber < document.lineCount; lineNumber++) {
      let p = this.findMacherAtLine(regex, lineNumber, document);
      if (p) {
        positionsToReturn.push(p)
        if (returnFrst){
          break;
        }
      } 
    }
    if (positionsToReturn.length > 0) {
      return(positionsToReturn);
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
  private findPreviousPositions(regex: RegExp, startLine: number, document: TextDocument, returnFrst?: boolean): Position[] | undefined {
    let positionsToReturn = new Array<Position>();
    for (let lineNumber = startLine; lineNumber > 0; lineNumber--) {
      let p = this.findMacherAtLine(regex, lineNumber, document);
      if (p) {
        positionsToReturn.push(p)
        if (returnFrst){
          break;
        }
      } 
    }
    if (positionsToReturn.length > 0) {
      return(positionsToReturn);
    }
  }

  /**
   * Find the macher position at line
   * 
   * @param regex 
   * @param lineNumber 
   * @param document 
   */
  private findMacherAtLine(regex: RegExp, lineNumber: number, document: TextDocument): Position | undefined {
    let lineText = document.lineAt(lineNumber);
    let matcher = lineText.text.match(regex);
    if (matcher) {
      //Temporariamente está retornando apenas a posição inicial da linha onde encontrou o conteúdo
      return new Position(lineText.lineNumber, 1);
    }
  }
}