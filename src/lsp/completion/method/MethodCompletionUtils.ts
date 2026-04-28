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
import { ExpandedSourceManager } from "../../../cobol/ExpandedSourceManager";

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
      const partsFromLine = currentLine.match(/[\w:>\-_]+/g);
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
    normalizedLine = normalizedLine.replace(/\([^(]+\)/g, "");
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
   * First tries to find in local source, then falls back to expanded source
   * (needed when variable declaration comes from a COPY with REPLACING).
   *
   * @param target
   * @param line
   * @param lines
   * @returns
   */
  public static findTargetClassDeclaration(uri: string, target: CompletionTarget, line: number, lines: string[]): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      this.findTargetClassDeclarationInBuffer(uri, target, line, lines)
        .then((clazz) => resolve(clazz))
        .catch(() => {
          // Fallback: try with expanded source (handles COPY with REPLACING)
          ExpandedSourceManager.getExpandedSource(uri).then((expandedBuffer) => {
            const expandedLines = BufferSplitter.split(expandedBuffer);
            this.findTargetClassDeclarationInExpandedBuffer(uri, target, expandedLines)
              .then((clazz) => resolve(clazz))
              .catch((e) => reject(e));
          }).catch((e) => reject(e));
        });
    })
  }

  /**
   * Finds the target class declaration in the expanded source buffer.
   * Since expanded source has different line positions (due to COPY expansion),
   * we search for the variable declaration by name in the entire buffer
   * instead of using the original line position.
   */
  private static findTargetClassDeclarationInExpandedBuffer(uri: string, target: CompletionTarget, lines: string[]): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      const joinedLines = lines.join("\n");
      //
      // Search for the declaration using the full buffer, starting from the end
      // so the reverse scan covers the entire expanded source
      //
      const findParams: FindParameters = { term: target.elementName, uri: uri, lineIndex: lines.length - 1, columnIndex: 0 }
      new CobolDeclarationFinder(joinedLines)
        .findDeclaration(findParams)
        .then((position) => {
          this.extractClassFromPosition(position, lines, uri)
            .then((clazz) => resolve(clazz))
            .catch((e) => reject(e));
        }).catch((e) => reject(e));
    })
  }

  /**
   * Finds the target class declaration in the given buffer lines.
   */
  private static findTargetClassDeclarationInBuffer(uri: string, target: CompletionTarget, line: number, lines: string[]): Promise<CobolVariable> {
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
          this.extractClassFromPosition(position, lines, uri)
            .then((clazz) => resolve(clazz))
            .catch((e) => reject(e));
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
   * Extracts the class from a declaration position.
   * If the position points to a file, reads it and extracts from there.
   * Otherwise extracts from the current buffer.
   */
  private static extractClassFromPosition(position: RechPosition, currentLines: string[], uri: string): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      if (!position.file) {
        this.extractClass(position.line, position.column, currentLines, uri)
          .then((clazz) => resolve(clazz))
          .catch((e) => reject(e));
        return;
      }
      FileUtils.read(new Path(position.file).fullPathWin()).then((buffer) => {
        const splitted = BufferSplitter.split(buffer);
        const fullPath = new Path(position.file).fullPathWin();
        this.extractClass(position.line, position.column, splitted, fullPath)
          .then((clazz) => resolve(clazz))
          .catch((e) => reject(e));
      }).catch((e) => reject(e));
    });
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
      const currentLine = buffer[line].substring(0, 120);
      if (ParserCobol.getDeclaracaoMethod(currentLine)) {
        CobolMethod.parseLines(line, column, buffer).then((method) => {
          if (method && method.getVariableReturn()) {
            return resolve(method.getVariableReturn()!);
          } else {
            return reject();
          }
        }).catch((e) => reject(e));
      } else if (ParserCobol.getDeclaracaoVariavel(currentLine)) {
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
      } else if (ParserCobol.getDeclaracaoClasse(currentLine)) {
        const variable = CobolVariable.parseLines(line, buffer, variableParsingParams);
        return resolve(variable);
      } else {
        return reject();
      }
    });
  }



}

