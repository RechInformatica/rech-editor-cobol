import { ElementsDisplayer } from "./ElementsDisplayer";
import { Client } from "../../lsp/client";
import { RechPosition } from "../../commons/rechposition";
import { File } from "../../commons/file";
import { ParserCobol } from "../parsercobol";
import { CobolVariable } from "../../lsp/completion/CobolVariable";
import { VariableDisplayer } from "./variable/VariableDisplayer";

/**
 * Class to build a ElementsDisplayer
 */
export class ElementsDisplayerFactory {

  /**
   * Create and show the elements in ElementsDisplayer
   */
  public show(word: string, fullDocument: string, uri: string) {
    Client.getDeclararion(word, fullDocument, uri).then((position) => {
      this.bufferOfDeclaration(position, uri, fullDocument).then((buffer) => {
        let lines = buffer.split("\n");
        this.buildDisplayer(position, lines);
      }).catch(() => {
        return
      })
    })
  }

  /**
   * Build the element displayer and show properties
   *
   * @param position
   * @param lines
   */
  private buildDisplayer(position: RechPosition, lines: string[]) {
    switch(true) {
      case this.isVariable(lines[position.line]): {
        let variable = CobolVariable.parseLine(lines[position.line])
        variable = CobolVariable.parseAndSetChildren(variable, position.line, lines)
        variable = CobolVariable.parserAndSetComment(variable, position.line, lines)
        variable.setDeclarationPosition(position);
        new VariableDisplayer().show(variable)
      }
    }

  }

  /**
   * Returns the buffer of the file containing the declaration
   *
   * @param position
   * @param currentUri
   * @param currentBuffer
   */
  private bufferOfDeclaration(position: RechPosition, currentUri: string, currentBuffer: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!position.file || position.file == currentUri) {
        resolve(currentBuffer)
      } else {
        new File(position.file).loadBuffer("latin1").then((buffer) => {
          resolve(buffer);
        }).catch(() => {
          reject()
        })
      }
    })
  }

  /**
   * Returns true if the linhe is a variable delcaration
   *
   * @param line
   */
  private isVariable(line: string) {
    if (new ParserCobol().getDeclaracaoVariavelIgnoreReplace(line)) {
      return true;
    }
    return false;
  }
}