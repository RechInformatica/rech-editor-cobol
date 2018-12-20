import { Path } from '../../commons/path';
import { File } from '../../commons/file';
import { Scan } from '../../commons/Scan';
import { ParserCobol } from '../../cobol/parsercobol'
import { RechPosition } from '../../commons/rechposition'

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
   * @param path
   * @param term
   */
  public findDeclaration(term: string, sourceFileName: string, callbackSourceExpander?: (cacheFileName: string) => Thenable<any>): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      let path = new Path(sourceFileName);
      // If the word is too small
      if (term.length < 3) {
        reject();
        return;
      }
      // Busca declaração no próprio documento
      let result = this.findDeclarationInBuffer(term, this.text);
      if (result) {
        resolve(result);
        return;
      }
      let cacheFileName = this.buildCacheFileName(sourceFileName);
      this.findDeclarationWithPreproc(term, path, cacheFileName, true, callbackSourceExpander).then((result) => {
        resolve(result);
      }).catch(() => {
        reject();
      });
    });
  }

  /**
   * Find the declaration in atual buffer
   *
   * @param term
   * @param buffer
   */
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
   * Builds Cobol preprocessor cache filename
   *
   * @param uri current URI of the file open in editor
   */
  private buildCacheFileName(uri: string) {
    var path = new Path(uri).fullPathWin();
    return "c:\\tmp\\PREPROC\\" + new Path(path).fileName();
  }

  /**
   * Find the declaration of term with preprocessed source
   *
   * @param term
   * @param path
   * @param cache
   */
  private findDeclarationWithPreproc(term: string, path: Path, cacheFileName: string, cache: boolean, callbackSourceExpander?: (cacheFileName: string) => Thenable<any>): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      let processou = false;
      // Se o arquivo de cache não existe, não tenta ler dele
      if (!new File(cacheFileName).exists()) {
        cache = false;
      }
      // If must to use cache
      if (cache) {
        this.findDeclarationInPreprocessedSource(term, path, cacheFileName).then((result) => {
          resolve(result);
        }).catch(() => {
          // Try reprocess
          this.findDeclarationWithPreproc(term, path, cacheFileName, false, callbackSourceExpander).then((result) => {
            resolve(result);
          }).catch(() => {
            reject();
          });
        });
      } else {
        if (callbackSourceExpander && !processou) {
          callbackSourceExpander(cacheFileName).then(() => {
            processou = true;
            this.findDeclarationWithPreproc(term, path, cacheFileName, true).then((result) => {
              resolve(result);
            }).catch(() => {
              reject();
            });
          }, () => {
            reject();
          });
        } else {
          reject();
        }
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
            let match = <RegExpMatchArray>/.*\*\>\s+\d+\s+(\d+)(?:\s+(.+\....)\s+\(\d+\))?/.exec(iterator.lineContent);
            let line = parseInt(match[1]) - 1;
            let file = path.fullPath();
            if (match[2] != undefined) {
              file = match[2];
            }
            let column = iterator.column;
            // build the result
            result = new RechPosition(<number>line, <number>column, this.getFullPath(file, path));
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
  private getFullPath(file: string, path: Path): string {
    let preferredDirectory = new Path(path.fullPathWin()).directory().toUpperCase();
    if (new File(preferredDirectory + file).exists()) {
      return preferredDirectory + file;
    }
    return "F:\\SIGER\\DES\\FON\\" + file;
  }


}