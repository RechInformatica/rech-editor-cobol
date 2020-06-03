import { Scan, BufferSplitter } from "rech-ts-commons";
import { ParserCobol } from '../../cobol/parsercobol'
import { RechPosition } from '../../commons/rechposition'
import { MethodDeclarationFinder } from './MethodDeclarationFinder';
import { PreprocDeclarationFinder } from './PreprocDeclarationFinder';
import { FindParameters, FindInterface } from './FindInterface';

/** Minimum word size */
const MIN_WORD_SIZE = 3;

/**
 * Class to find Cobol declarations
 */
export class CobolDeclarationFinder {

  private parser: ParserCobol;
  private splittedBuffer: string[];

  constructor(private text: string) {
    this.parser = new ParserCobol();
    this.splittedBuffer = BufferSplitter.split(this.text);
  }

  public findDeclaration(term: string, uri: string, referenceLine: number, referenceColumn: number): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      const findParams: FindParameters = {
        term: term,
        uri: uri,
        lineIndex: referenceLine,
        columnIndex: referenceColumn
      };
      this.findDeclarationInBuffer(findParams).then((result) => {
        if (result) {
          return resolve(result);
        }
        const preprocFinder = new PreprocDeclarationFinder(this.splittedBuffer);
        preprocFinder.findDeclaration(findParams).then((result) => {
          return resolve(result)
        }).catch(() => {
          return reject();
        });
      }).catch(() => {
        return reject();
      });
    });
  }

  private findDeclarationInBuffer(params: FindParameters): Promise<RechPosition | undefined> {
    return new Promise((resolve, reject) => {
      const currentLine = this.splittedBuffer[params.lineIndex];
      if (this.shouldIgnore(currentLine, params)) {
        return reject();
      }
      const methodFinder = new MethodDeclarationFinder(this.splittedBuffer);
      if (methodFinder.isMethodCall(currentLine, params.columnIndex)) {
        methodFinder.findDeclaration(params).then((result) => {
          return resolve(result);
        }).catch(() => {
          return reject();
        });
        return;
      }
      const declarationPosition = this.searchDeclarationBackwards(params);
      return resolve(declarationPosition);
    })
  }

  private shouldIgnore(currentLine: string, params: FindParameters): boolean {
    const empty = params.term === "";
    const smallWord = params.term.length < MIN_WORD_SIZE && this.parser.isCommentOrEmptyLine(currentLine);
    return empty || smallWord;
  }

  private searchDeclarationBackwards(params: FindParameters): RechPosition | undefined {
    let result: RechPosition | undefined = undefined;
    const term = params.term;
    const line = params.lineIndex;
    const termRegExp = new RegExp(term, 'gi');
    new Scan(this.text).reverseScan(termRegExp, line, (iterator: any) => {
      if (this.parser.isDeclaration(term, iterator.lineContent)) {
        result = new RechPosition(iterator.row, iterator.column);
        iterator.stop();
      }
    });
    return result;
  }

}
