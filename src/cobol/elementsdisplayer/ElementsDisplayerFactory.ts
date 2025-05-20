import { Client } from "../../lsp/client";
import { RechPosition } from "../../commons/rechposition";
import { File } from "../../commons/file";
import { ParserCobol } from "../parsercobol";
import { CobolVariable } from "../../lsp/completion/CobolVariable";
import { VariableDisplayer } from "./variable/VariableDisplayer";
import { CobolCopy } from "../CobolCopy";
import { copyDisplayer } from "./copy/CopyDisplayer";
import { window } from "vscode";
import { BufferSplitter } from "rech-ts-commons";
import { ClassDisplayer } from "./class/ClassDisplayer";
import { FileUtils } from "../../commons/FileUtils";

/**
 * Class to build a ElementsDisplayer
 */
export class ElementsDisplayerFactory {

  /**
   * Create and show the elements in ElementsDisplayer
   */
  public show(word: string, fullDocument: string, uri: string, currentLine: number, currentColumn: number) {
    window.showInformationMessage(`Analyzing element: ${word}...`);
    Client.getDeclararion(word, currentLine, currentColumn, fullDocument, uri).then((position) => {
      this.bufferOfDeclaration(position, uri, fullDocument).then((buffer) => {
        const lines = BufferSplitter.split(buffer);
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
        const variable = CobolVariable.parseLines(position.line, lines)
        variable.setDeclarationPosition(position);
        new VariableDisplayer().show(uri, variable, lines)
        break;
      case this.isClass(lines[position.line]):
        const classs = CobolVariable.parseLines(position.line, lines)
        classs.setDeclarationPosition(position);
        new ClassDisplayer().show(classs)
        break;
      case this.isCopy(lines[currentLine]):
        CobolCopy.parseLine(currentLine, lines, uri).then((copy) => {
          if (copy) {
            new copyDisplayer().show(copy)
          }
        }).catch(() => {
          window.showWarningMessage(`Fail to parser copy informations! Line: ${lines[currentLine]}`);
        });
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
        FileUtils.read(position.file, "latin1").then((buffer) => {
          resolve(buffer);
        }).catch((e) => {
          reject(e)
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
   * Returns true if the linhe is a class delcaration
   *
   * @param line
   */
  private isClass(line: string) {
    if (new ParserCobol().getDeclaracaoClasse(line)) {
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
