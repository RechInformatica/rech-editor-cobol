import { Path } from '../commons/path';
import { File } from '../commons/file';
import { Scan } from '../commons/Scan';
import { Preproc } from '../commons/preproc';
import { TextEditor, TextLine, TextDocument } from 'vscode';
import { ParserCobol } from '../cobol/parsercobol'
import { RechPosition } from './rechposition'

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
 * Find the declaration of the term
 * 
 * @param term 
 */
  public findDeclaration(term: string, path: Path): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      // Busca declaração no próprio documento
      let document = this.editor.document;
      let result = this.findDeclarationInBuffer(term, document.getText());
      if (result) {
        resolve(result);
        return;
      }
      this.findDeclarationWithPreproc(term, path, true).then((result) => {
        resolve(result);
      }).catch(() => {
        reject();  
      });
    });
  }


  private findDeclarationInBuffer(term: string, buffer: string): RechPosition | undefined {
    let parser = new ParserCobol();
    let result = undefined;
    new Scan(buffer).scan(new RegExp(term, 'gi'), (iterator: any) => {
      if (parser.isDeclaration(term, iterator.lineContent)) {
        result = new RechPosition(iterator.row, iterator.column);
        iterator.stop();
      }
    });
    return result;
  }
  /**
   * Find the declaration of term with preprocessed source
   * 
   * @param term
   * @param path 
   * @param cache 
   */
  private findDeclarationWithPreproc(term: string, path: Path, cache: boolean): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      let cacheFileName = "c:\\tmp\\PREPROC\\" + path.fileName();
      // Se o arquivo de cache não existe, não tenta ler dele
      if (!new File(cacheFileName).exists()) {
        cache=false;
      }
      // Se deve usar o cache
      if (cache) {
        this.findDeclarationInPreprocessedSource(term, path, cacheFileName).then((result) => {
          resolve(result);
        }).catch(() => {
          reject()
        });
      } else {
        // Run preprocess and load the output buffet
        let preproc = new Preproc();
        preproc.setPath(path);
        preproc.addOptions(["-scc", "-sco", "-" + "is", "-as=" + cacheFileName]);
        preproc.exec().then(() => {
          this.findDeclarationWithPreproc(term, path, true).then((result) => {
            resolve(result);
          }).catch(() => {
            reject();
          });
        });
      }
    }); 
  }

  /**
   * Find the declaration in the preprocessed source
   * 
   * @param term
   * @param path 
   * @param tmpFile 
   */
  private findDeclarationInPreprocessedSource(term: string, path: Path, tmpFile: string): Promise<RechPosition> {
    let parser = new ParserCobol();
    return new Promise((resolve, reject) => {
      new File(tmpFile).loadBuffer().then((buffers: string[]) => {
        let result = null;
        let buffer = buffers.toString();
        new Scan(buffer).scan(new RegExp(term, 'gi'), (iterator: any) => {
          if (parser.isDeclaration(term, iterator.lineContent)) {
            let match = <RegExpMatchArray> /.*\*\>\s+\d+\s+(\d+)(?:\s+(.+\....)\s+\(\d+\))?/.exec(iterator.lineContent);
            let line = parseInt(match[1]) - 1;
            let file = path.fullPath();
            if (match[2] != undefined) {
              file = match[2];
            }
            let column = iterator.column;
            // build the result
            result = new RechPosition(<number>line, <number>column, this.getFullPath(file, path.directory()));
            iterator.stop();
          }
        });
        if (result != null) {
          resolve(<RechPosition>result);
        } else {
          reject();
        }
      }).catch(() => {
        reject();
      });
    });
  }
  
  /**
   * Return the full path of a file
   */
  private getFullPath(file: string, preferredDirectory: string): string {
    if (new File(preferredDirectory + file).exists()) {
      return preferredDirectory + file;
    }
    return "F:\\SIGER\\DES\\FON\\" + file;
  }

  /**
   * Find the line positions of the regex
   * 
   * @param regex 
   * @param startLineToFind 
   */
  public findPositions(regex: RegExp, direction: number, startLineToFind?:TextLine, returnFrst?: boolean): RechPosition[] | undefined {
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
  private findNextPositions(regex: RegExp, startLine: number, document: TextDocument, returnFrst?: boolean): RechPosition[] | undefined {
    let positionsToReturn = new Array<RechPosition>();
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
  private findPreviousPositions(regex: RegExp, startLine: number, document: TextDocument, returnFrst?: boolean): RechPosition[] | undefined {
    let positionsToReturn = new Array<RechPosition>();
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
  private findMacherAtLine(regex: RegExp, lineNumber: number, document: TextDocument): RechPosition | undefined {
    let lineText = document.lineAt(lineNumber);
    let matcher = lineText.text.match(regex);
    if (matcher) {
      //Temporariamente está retornando apenas a posição inicial da linha onde encontrou o conteúdo
      return new RechPosition(lineText.lineNumber, 1);
    }
  }
}