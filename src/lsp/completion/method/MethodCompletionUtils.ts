import { BufferSplitter } from "rech-ts-commons";
import { FileUtils } from "../../../commons/FileUtils";
import { RechPosition } from "../../../commons/rechposition";
import { Path } from "../../../commons/path";
import { ParserCobol } from "../../../cobol/parsercobol";
import { CobolDeclarationFinder } from "../../declaration/CobolDeclarationFinder";
import { FindParameters } from "../../declaration/FindInterface";
import { CobolMethod } from "../CobolMethod";
import { CobolVariable } from "../CobolVariable";
import { CompletionTarget } from "./CompletionTarget";

/**
 * Method completion utility
 */
export class MethodCompletionUtils {

  /**
   * Find the targer element in lines to build MethodCompletionItems for this
   *
   * @param line
   * @param column
   * @param lines
   * @returns
   */
  public static findTargetElement(line: number, column: number, lines: string[]): Promise<CompletionTarget> {
    return new Promise((resolve, reject) => {
      let currentLine = "";
      const analisedBuffer: string[] = [];
      let currentColumn = column;
      for (let i = line; i > 0; i--) {
        analisedBuffer.push(lines[i]);
        currentLine = this.normalizeLine(lines[i], currentColumn) + currentLine;
        if (currentLine != "" && currentLine != CobolMethod.TOKEN_INVOKE_METHOD) {
          break;
        }
        currentColumn = 120;
      }
      const partsFromLine = currentLine.match(/[\w\:\>\-\_]+/g);
      if (!partsFromLine) {
        return reject();
      }
      const currentCommand = partsFromLine[partsFromLine.length - 1];
      if (!currentCommand.includes(CobolMethod.TOKEN_INVOKE_METHOD)) {
        return reject();
      }
      const elementName: string = this.extractTargetFromCommand(currentCommand);
      const completion: CompletionTarget = { elementName: elementName, containingBuffer: analisedBuffer };
      resolve(completion);
    });
  }

  private static normalizeLine(line: string, currentColumn: number): string {
    let normalizedLine: string = "";
    normalizedLine = line;
    normalizedLine = normalizedLine.substr(0, currentColumn);
    normalizedLine = normalizedLine.trim();
    normalizedLine = normalizedLine.replace(/\([^\(]+\)/g, "");
    return normalizedLine;
  }

  private static extractTargetFromCommand(currentCommand: string): string {
    const chain: string[] = this.extractCallChainFromCommand(currentCommand);
    const target = chain[chain.length - 1];
    return target;
  }

  private static extractCallChainFromCommand(currentCommand: string): string[] {
    //
    // Splits the command by ':>' which is COBOL token
    // for method call.
    //
    let chain = currentCommand.split(CobolMethod.TOKEN_INVOKE_METHOD);
    //
    // Removes the last element of this array because it's is invalid.
    // The last element of this array is always empty and needs to be removed.
    //
    // For example:
    // ["<class-name>", "method-a", ""]
    //
    chain = chain.slice(0, chain.length - 1);
    // Removes constructor because not all classes have explicit constructor
    if (chain[chain.length - 1] === "new") {
      chain = chain.slice(0, chain.length - 1);
    }
    return chain;
  }

  /**
   * Breaks the chain and returns the target class declaration.
   *
   * @param target
   * @param line
   * @param lines
   * @returns
   */
  public static findTargetClassDeclaration(uri: string, target: CompletionTarget, line: number, lines: string[]): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      const referencePosition: RechPosition = this.extractTargetPositionFromBuffer(target, line);
      if (referencePosition.column == 0 || referencePosition.line == 0) {
        return reject();
      }
      //
      // Constructs objects to find definition
      //
      const findParams: FindParameters = { term: target.elementName, uri: uri, lineIndex: referencePosition.line, columnIndex: referencePosition.column }
      const joinedLines = lines.join("\n");
      //
      // Looks for the definition itself
      //
      new CobolDeclarationFinder(joinedLines)
        .findDeclaration(findParams)
        .then((position) => {
          if (!position.file) {
            //
            // The definition is on current file, so extract class/method information from current file
            //
            this.extractClass(position.line, position.column, lines, uri)
              .then((clazz) => resolve(clazz))
              .catch((e) => reject(e));
            return;
          }
          //
          // The definition is on a different file, so we need to load the file content and
          // extract class/method from the buffer read
          //
          FileUtils.read(new Path(position.file).fullPathWin()).then((buffer) => {
            const splitted = BufferSplitter.split(buffer);
            const fullPath = new Path(position.file).fullPathWin();
            this.extractClass(position.line, position.column, splitted, fullPath)
              .then((clazz) => resolve(clazz))
              .catch((e) => reject(e));
          }).catch((e) => reject(e));
        }).catch((e) => reject(e));
    })
  }

  private static extractTargetPositionFromBuffer(target: CompletionTarget, line: number): RechPosition {
    let referenceColumn = 0;
    let referenceLine = 0;
    for (let i = 0; i < target.containingBuffer.length; i++) {
      const analisedLine = target.containingBuffer[i];
      const pattern = new RegExp(`[\\s\\,\\.\\(\\)\\:\\>]${target.elementName}[\\s\\,\\.\\(\\)\\:]`);
      const match = analisedLine.match(pattern);
      if (!match) {
        continue;
      }
      referenceColumn = match.index! + 1 + target.elementName.length;
      referenceLine = line - i;
      break;
    }
    return new RechPosition(referenceLine, referenceColumn);
  }

  /**
   * Extracts the CobolVariable object which represents the target class, from the buffer
   */
   private static extractClass(line: number, column: number, buffer: string[], uri: string): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      const variableParsingParams = {
        ignoreMethodReturn: true,
        noChildren: true,
        noComment: true,
        noScope: true,
        noSection: true
      };
      const parser = new ParserCobol();
      const currentLine = buffer[line];
      if (parser.getDeclaracaoMethod(currentLine)) {
        CobolMethod.parseLines(line, column, buffer).then((method) => {
          if (method && method.getVariableReturn()) {
            return resolve(method.getVariableReturn()!);
          } else {
            return reject();
          }
        }).catch((e) => reject(e));
      } else if (parser.getDeclaracaoVariavel(currentLine)) {
        const variable = CobolVariable.parseLines(line, buffer, variableParsingParams);
        const reference = variable.getObjectReferenceOf();
        if (!reference) {
          return variable;
        } else {
          const findParams: FindParameters = {
            term: reference,
            uri: uri,
            lineIndex: 0,
            columnIndex: 0
          };
          new CobolDeclarationFinder(buffer.join("\n"))
            .findDeclaration(findParams)
            .then((position) => {
              if (!position.file) {
                return resolve(CobolVariable.parseLines(position.line, buffer, variableParsingParams));
              } else {
                FileUtils.read(position.file)
                  .then((classFileBuf) => resolve(CobolVariable.parseLines(position.line, BufferSplitter.split(classFileBuf), variableParsingParams)))
                  .catch((e) => reject(e));
              }
            }).catch((e) => reject(e));
        }
      } else if (parser.getDeclaracaoClasse(currentLine)) {
        const variable = CobolVariable.parseLines(line, buffer, variableParsingParams);
        return resolve(variable);
      } else {
        return reject();
      }
    });
  }



}

