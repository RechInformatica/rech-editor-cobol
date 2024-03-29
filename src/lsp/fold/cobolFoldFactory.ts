import { FoldingRange } from "vscode-languageserver";
import { CopyFolding } from "./CopyFolding";
import Q from "q";
import { VariableFolding } from "./VariableFolding";
import { IfFolding } from "./IfFolding";
import { ElseFolding } from "./ElseFolding";
import { CobolFoldInterface } from "./cobolFoldInterface";
import { EvaluateFolding } from "./EvaluateFolding";
import { WhenFolding } from "./WhenFolding";
import { ParagraphFolding } from "./ParagraphFolding";
import { PerformUntilFolding } from "./PerformUntilFolding";
import { PerformWithTest } from "./PerformWithTest";

/**
 * Class to fold Cobol source code
 */
export class CobolFoldFactory {

  /** Folding cache */
  public static foldingCache: Map<string, FoldingRange[]> = new Map()

  public fold(uri: string, buffer: string[], requestToShowFoldStatusBar?: () => void, requestToHideFoldStatusBar?: () => void): Promise<FoldingRange[]> {
    if (requestToShowFoldStatusBar) {
      requestToShowFoldStatusBar();
    }
    return new Promise((resolve, reject) => {
      this.breakBlocks(buffer).then((result) => {
        CobolFoldFactory.foldingCache.set(uri, result);
        if (requestToHideFoldStatusBar) {
          requestToHideFoldStatusBar();
        }
        resolve(result);
      }).catch((e) => {
        if (requestToHideFoldStatusBar) {
          requestToHideFoldStatusBar();
        }
        return reject(e);
      });
    });
  }

  /**
   * Break the text in blocks and returns the foldingRanger
   *
   * @param text
   */
  private breakBlocks(text: string[]): Promise<FoldingRange[]> {
    return new Promise((resolve, reject) => {
      const promiseFoldings: Promise<FoldingRange>[] = [];
      const foldings: FoldingRange[] = [];
      for (let index = 0; index < text.length; index++) {
        promiseFoldings.push(this.foldingRange(index, text));
      }
      Q.allSettled(promiseFoldings).then((results) => {
        results.forEach((result) => {
          if (result.state === "fulfilled") {
            foldings.push(result.value!);
          }
        });
        resolve(foldings);
      }).catch((e) => {
        reject(e);
      })
    })
  }

  /**
   * find the foldinRanger of the line term
   *
   * @param line
   */
  private foldingRange(line: number, lines: string[]): Promise<FoldingRange> {
    return new Promise((resolve, reject) => {
      const currentLine = lines[line];
      const cobolFolders: CobolFoldInterface[] = [
        new CopyFolding(),
        new VariableFolding(),
        new IfFolding(),
        new ElseFolding(),
        new EvaluateFolding(),
        new WhenFolding(),
        new ParagraphFolding(),
        new PerformUntilFolding(),
        new PerformWithTest()
      ];
      let folded = false;
      cobolFolders.forEach((cobolFold) => {
        if (cobolFold.mustFolding(currentLine)) {
          folded = true;
          resolve(cobolFold.fold(line, lines));
        }
      });
      if (!folded) {
        return reject("invalid folded");
      }
    });
  }

}
