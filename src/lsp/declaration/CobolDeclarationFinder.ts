import { Path } from '../../commons/path';
import { File } from '../../commons/file';
import { Scan } from '../../commons/Scan';
import { ParserCobol } from '../../cobol/parsercobol'
import { RechPosition } from '../../commons/rechposition'
import { ExpandedSourceManager } from '../../cobol/ExpandedSourceManager';

/** Minimum word size */
const MIN_WORD_SIZE = 3;

/**
 * Class to find Cobol declarations
 */
export class CobolDeclarationFinder {

  /** Editor text*/
  private text: string;

  /**
   * Constructor of Find
   *
   * @param editor
   */
  constructor(text: string) {
    this.text = text;
  }

  /**
   * Find the declaration of the term
   *
   * @param term Term to find
   */
  public findDeclaration(term: string, uri: string): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      // If the word is too small
      if (term.length < MIN_WORD_SIZE) {
        reject();
        return;
      }
      // Busca declaração no próprio documento
      const result = this.findDeclarationInBuffer(term, this.text);
      if (result) {
        return resolve(result);
      }
      this.findDeclarationWithPreproc(term, uri, true).then((result) => {
        return resolve(result)
      }).catch(() => {
        return reject();
      });
    });
  }

  /**
   * Find the declaration of term with preprocessed source
   *
   * @param term term to find
   * @param uri uri of the file
   * @param expandSource can expand the source?
   */
  private findDeclarationWithPreproc(term: string, uri: string, expandSource: boolean): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      ExpandedSourceManager.getExpandedSource(uri).then((expandedSource) => {
        const path = new Path(uri);
        this.findDeclarationInPreprocessedSource(term, path, expandedSource).then((result) => {
          if (result) {
            return resolve(result);
          } else {
            if (expandSource) {
              new ExpandedSourceManager(uri).expandSource().then(()=>{}).catch(() => {});
              this.findDeclarationWithPreproc(term, uri, false).then((result) => {
                return resolve(result);
              }).catch(() => {
                return reject();
              })
            } else {
              return reject();
            }
          }
        }).catch(() => {
          return reject();
        });
      }).catch(() => {
        return reject();
      })
    });
  }

  /**
   * Find the declaration in atual buffer
   *
   * @param term
   * @param buffer
   */
  private findDeclarationInBuffer(term: string, buffer: string): RechPosition | undefined {
    const parser = new ParserCobol();
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
   * Find the declaration in the preprocessed source
   *
   * @param term
   * @param path
   * @param buffer
   */
  private findDeclarationInPreprocessedSource(term: string, path: Path, buffer: string): Promise<RechPosition> {
    const parser = new ParserCobol();
    return new Promise((resolve, reject) => {
      let result = undefined;
      let file = path.fileName();
      new Scan(buffer).scan(/\s+\*\>\sOpções:.*/gi, (iterator: any) => {
        const match = /^\s+\*\>\sOpções:\s([A-Za-z0-9\\:]+\.CBL)/gm.exec(iterator.lineContent)
        if (match) {
          file = new Path(match[1]).fileName();
          iterator.stop();
        }
      });
      new Scan(buffer).scan(new RegExp(term, 'gi'), (iterator: any) => {
        if (parser.isDeclaration(term, iterator.lineContent)) {
          const match = <RegExpMatchArray>/.*\*\>\s+\d+\s+(\d+)(?:\s+(.+\....)\s+\(\d+\))?/.exec(iterator.lineContent);
          const line = parseInt(match[1]) - 1;
          const filePositionGroup = 2;
          if (match[filePositionGroup]) {
            file = match[filePositionGroup];
          }
          const column = iterator.column;
          // build the result
          result = new RechPosition(<number>line, <number>column, this.getFullPath(file, path));
          iterator.stop();
        }
      });
      if (result) {
        resolve(<RechPosition>result);
      } else {
        reject();
      }
    });
  }

  /**
   * Return the full path of a file
   */
  private getFullPath(file: string, path: Path): string {
    const preferredDirectory = new Path(path.fullPathWin()).directory().toUpperCase();
    if (new File(preferredDirectory + file).exists()) {
      return preferredDirectory + file;
    }
    return "F:\\SIGER\\DES\\FON\\" + file;
  }


}