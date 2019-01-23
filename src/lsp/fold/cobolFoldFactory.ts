import { FoldingRange } from "vscode-languageserver";
import { CopyFolding } from "./CopyFolding";
import Q from "q";
import { VariableFolding } from "./VariableFolding";

/**
 * Class to fold Cobol source code
 */
export class cobolFoldFactory {
  public fold(text: string): Thenable<FoldingRange[]> {
    return new Promise(resolve => {
      let buffer = text.split("\n");
      let result = this.breakBlocks(buffer);
      resolve(result);
    });
  }

  /**
   * Break the text in blocks and returns the foldingRanger
   *
   * @param text
   */
  private breakBlocks(text: string[]): Promise<FoldingRange[]> {
    return new Promise((resolve, reject) => {
      let promiseFoldings: Promise<FoldingRange>[] = [];
      let foldings: FoldingRange[] = [];
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
      }).catch(() => {
        reject();
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
      let copy = new CopyFolding();
      let variable = new VariableFolding();
      let currentLine = lines[line];
      switch(true) {
        case copy.mustFolding(currentLine):
          resolve(copy.fold(line, lines))
          return;
        case variable.mustFolding(currentLine):
          resolve(variable.fold(line, lines))
          return;
      }
      reject();
    });
  }
}
