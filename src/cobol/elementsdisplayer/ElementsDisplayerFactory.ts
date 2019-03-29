import { Client } from "../../lsp/client";
import { RechPosition } from "../../commons/rechposition";
import { File } from "../../commons/file";
import { ParserCobol } from "../parsercobol";
import { CobolVariable } from "../../lsp/completion/CobolVariable";
import { VariableDisplayer } from "./variable/VariableDisplayer";
import { CobolCopy } from "../CobolCopy";
import { copyDisplayer } from "./copy/CopyDisplayer";
import { window } from "vscode";
import { BufferSplitter } from "../../commons/BufferSplitter";

/**
 * Class to build a ElementsDisplayer
 */
export class ElementsDisplayerFactory {

  /**
   * Create and show the elements in ElementsDisplayer
   */
  public show(word: string, fullDocument: string, uri: string, currentLine: number) {
    window.showInformationMessage(`Analyzing element: ${word}...`);
    Client.getDeclararion(word, fullDocument, uri).then((position) => {
      this.bufferOfDeclaration(position, uri, fullDocument).then((buffer) => {
        let lines = BufferSplitter.split(buffer);
        this.buildDisplayer(position, lines, currentLine, uri);
      }).catch(() => {
        window.showWarningMessage(`Element ${word} not found`);
        return
      })
    }).catch()
  }

  /**
   * Build the element displayer and show properties
   *
   * @param position
   * @param lines
   */
  private buildDisplayer(position: RechPosition, lines: string[], currentLine: number, uri: string) {
    switch(true) {
      case this.isVariable(lines[position.line]):
        let variable = CobolVariable.parseLine(lines[position.line])
        variable = CobolVariable.parseAndSetChildren(variable, position.line, lines)
        variable = CobolVariable.parserAndSetComment(variable, position.line, lines)
        variable.setDeclarationPosition(position);
        new VariableDisplayer().show(variable)
        break;
      case this.isCopy(lines[currentLine]):
        let copy = CobolCopy.parseLine(currentLine, lines, uri);
        if (copy) {
          new copyDisplayer().show(copy)
        }
        break;
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

  /**
   * Returns true if the linhe is a copy delcaration
   *
   * @param line
   */
  private isCopy(line: string) {
    if (new ParserCobol().getCopyDeclaration(line)) {
      return true;
    }
    return false;
  }
}