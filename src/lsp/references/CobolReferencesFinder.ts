import { Scan } from "rech-ts-commons";
import { RechPosition } from '../../commons/rechposition'
import { CobolRegexUtils } from '../../cobol/CobolRegexUtils';

/** Minimum word size */
const MIN_WORD_SIZE = 3;

/**
 * Class to find Cobol references
 */
export class CobolReferencesFinder {

  /** Editor text*/
  private text: string;
  /** Chache from sources*/
  private cacheSources: Map<string, string>;

  /**
   * Constructor of Find
   *
   * @param editor
   */
  constructor(text: string) {
    this.text = text;
    this.cacheSources = new Map()
  }

  /**
   * Find the declaration of the term
   *
   * @param term Term to find
   */
  public findReferences(term: string): Promise<RechPosition[]> {
    return new Promise((resolve, reject) => {
      // If the word is too small
      if (term.length < MIN_WORD_SIZE) {
        reject();
        return;
      }
      const result : RechPosition[] = [];
      new Scan(this.text).scan(CobolRegexUtils.createRegexForVariableUsage(term), (iterator: any) => {
        result.push(new RechPosition(iterator.row, iterator.column + 1));
      });
      return resolve(result);
    });
  }

}
