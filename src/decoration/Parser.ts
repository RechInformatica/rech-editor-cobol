import { Range, TextEditor, DecorationRenderOptions, window, TextEditorDecorationType, Position } from "vscode";
import { CobolVariable } from "../lsp/completion/CobolVariable";
import { VariableUtils } from "../commons/VariableUtils";
import { Scan } from "rech-ts-commons";
import { Configuration } from "../helpers/configuration";
import Q from "q";
import { CobolRegexUtils } from "../cobol/CobolRegexUtils";
import { CobolCopy } from "../cobol/CobolCopy";
import { RechPosition } from "../commons/rechposition";

export class Parser {
  private static lastLocalVariableDecorator: TextEditorDecorationType
  private static lastRechDocTypeDecorator: TextEditorDecorationType
  private static lastRechDocVariableDecorator: TextEditorDecorationType
  private static lastExitFlowDecorator: TextEditorDecorationType
  private readonly rechDocTypeRangeList: Range[] = [];
  private readonly rechDocVariableRangeList: Range[] = [];
  private readonly localVariableRangeList: Range[] = [];
  private readonly exitFlowRangeList: Range[] = [];

  /**
   * Find all local variables
   *
   * @param activeEditor
   */
  public findLocalVariables(activeEditor: TextEditor): Promise<undefined> {
    return new Promise((resolve, reject) => {
      const text = activeEditor.document.getText();
      Q.allSettled(this.getAllLocalVariables(text)).then((_r) => {
        return resolve(undefined);
      }).catch((e) => {
        return reject(e);
      });
    });
  }

  /**
   * Returns all variables and your uses in a promise array
   *
   * @param activeEditor
   * @param text
   */
  private getAllLocalVariables(text: string): Promise<undefined>[] {
    const PromiseArray: Promise<undefined>[] = []
    const textLF = text.replace(/\r/g, "");
    // Regexp to find variables declarations in source, using default declaration syntax
    const defaultRegex = /^ +\d\d\s+(?:[\w-]+)?(?:\(.*\))?([\w-]+)(\s+|\.).*/gm
    PromiseArray.push(...this.getDefaultLocalVariables(textLF, defaultRegex));
    // Regexp to find method declaration
    const inlineRegex = /^\s*method-id\..*/gim
    PromiseArray.push(...this.getInlineMethodsLocalVariables(textLF, inlineRegex));
    // Regexp to find variables declared inline in PERFORM VARYING loops
    PromiseArray.push(...this.getPerformVaryingLocalVariables(textLF));
    // Find variables declared with the DECLARE clause
    PromiseArray.push(...this.getDeclareLocalVariables(textLF));
    return PromiseArray;
  }

  /**
   * Returns all PERFORM VARYING inline variable declarations and their uses in a promise array.
   *
   * Handles patterns like: varying i as JInt from 1 by 1
   *
   * @param textLF
   */
  private getPerformVaryingLocalVariables(textLF: string): Promise<undefined>[] {
    const PromiseArray: Promise<undefined>[] = [];
    const lines = textLF.split("\n");
    const varyingRegex = /^\s+varying\s+([\w-]+)\s+as\s+[\w-]+/gim;
    new Scan(textLF).scan(varyingRegex, (iterator: any) => {
      const line = lines[iterator.row];
      const match = /\s+varying\s+([\w-]+)\s+as\s+[\w-]+/i.exec(line);
      if (!match) {
        return;
      }
      const varName = match[1];
      // Find the column where the variable name starts
      const varyingIdx = line.toLowerCase().indexOf("varying");
      const afterVarying = line.substring(varyingIdx + "varying".length);
      const varOffset = afterVarying.search(new RegExp(varName, "i"));
      const column = varyingIdx + "varying".length + varOffset;
      const variable = CobolVariable.dummyCobolVariable(varName);
      variable.setDeclarationPosition(new RechPosition(iterator.row, column));
      this.pushUsesPromiseIfLocal(variable, textLF, PromiseArray, true);
    });
    return PromiseArray;
  }

  /**
   * Returns all DECLARE inline variable declarations and their uses in a promise array.
   *
   * Handles patterns like: declare i as JInt = 0
   *
   * @param textLF
   */
  private getDeclareLocalVariables(textLF: string): Promise<undefined>[] {
    const PromiseArray: Promise<undefined>[] = [];
    const lines = textLF.split("\n");
    const declareRegex = /^\s+declare\s+([\w-]+)\s+as\s+[\w-]+/gim;
    new Scan(textLF).scan(declareRegex, (iterator: any) => {
      const line = lines[iterator.row];
      const match = /\s+declare\s+([\w-]+)\s+as\s+[\w-]+/i.exec(line);
      if (!match) {
        return;
      }
      const varName = match[1];
      const declareIdx = line.toLowerCase().indexOf("declare");
      const afterDeclare = line.substring(declareIdx + "declare".length);
      const varOffset = afterDeclare.search(new RegExp(varName, "i"));
      const column = declareIdx + "declare".length + varOffset;
      const variable = CobolVariable.dummyCobolVariable(varName);
      variable.setDeclarationPosition(new RechPosition(iterator.row, column));
      this.pushUsesPromiseIfLocal(variable, textLF, PromiseArray, true);
    });
    return PromiseArray;
  }

  /**
   * Returns all variables and your uses in a promise array
   *
   * @param textLF
   * @param regex
   * @returns
   */
  private getInlineMethodsLocalVariables(textLF: string, regex: RegExp): Promise<undefined>[] {
    const PromiseArray: Promise<undefined>[] = [];
    const lines = textLF.split("\n");
    // Scan for method-id occurrences
    new Scan(textLF).scan(regex, (iterator: any) => {
      const startLine = iterator.row;
      const headerEndLine = this.findHeaderEndLine(startLine, lines);

      const headerLines = lines.slice(startLine, headerEndLine + 1);
      const headerText = headerLines.join(" ");

      // Handle parameters
      const paramsMatch = /\(([^)]*)\)/m.exec(headerText);
      if (paramsMatch && paramsMatch[1].trim().length > 0) {
        const paramsText = paramsMatch[1];
        const paramsArray = paramsText.split(",");
        for (const rawParam of paramsArray) {
          this.handleMethodParameter(rawParam.trim(), startLine, headerLines, textLF, PromiseArray);
        }
      }

      // Handle returning clause
      const returningRegex = /returning\s+([\w-]+)/i;
      const retMatch = returningRegex.exec(headerText);
      if (retMatch) {
        const retName = retMatch[1];
        this.handleMethodReturning(retName, startLine, headerLines, textLF, PromiseArray);
      }
    });
    return PromiseArray;
  }

  /**
   * Find header end line
   * Obs.: first line after start that contains a period terminating the declaration
   *
   * @param startLine
   * @param lines
   * @returns
   */
  private findHeaderEndLine(startLine: number, lines: string[]): number {
    let headerEndLine = startLine;
    for (let i = startLine; i < lines.length; i++) {
      headerEndLine = i;
      if (lines[i].trim().endsWith(".")) {
        break;
      }
      // stop if reach end method (shouldn't happen before header ends)
      if (/^\s*end\s+method\./i.test(lines[i])) {
        break;
      }
    }
    return headerEndLine;
  }

  /**
   *  Process a single parameter declaration and push usage promise if local
   *
   * @param rawParam
   * @param startLine
   * @param headerLines
   * @param textLF
   * @param PromiseArray
   */
  private handleMethodParameter(rawParam: string, startLine: number, headerLines: string[], textLF: string, PromiseArray: Promise<undefined>[]) {
    const param = rawParam;
    const paramRegex = /([\w-]+)\s+as\s+([\w-]+)/i;
    const m = paramRegex.exec(param);
    if (!m) {
      return;
    }
    const paramName = m[1];

    // locate parameter occurrence in header lines
    const located = this.locateInHeaderLines(headerLines, startLine, param.toLowerCase(), 0);
    const variable = CobolVariable.dummyCobolVariable(paramName);
    variable.setDeclarationPosition(new RechPosition(located.foundLine, located.foundColumn));

    this.pushUsesPromiseIfLocal(variable, textLF, PromiseArray);
  }

  /**
   * Process returning variable and push usage promise if local
   *
   * @param retName
   * @param startLine
   * @param headerLines
   * @param textLF
   * @param PromiseArray
   */
  private handleMethodReturning(retName: string, startLine: number, headerLines: string[], textLF: string, PromiseArray: Promise<undefined>[]) {
    const search = ("returning " + retName).toLowerCase();
    const located = this.locateInHeaderLines(headerLines, startLine, search, "returning ".length);
    const variable = CobolVariable.dummyCobolVariable(retName);
    variable.setDeclarationPosition(new RechPosition(located.foundLine, located.foundColumn));
    this.pushUsesPromiseIfLocal(variable, textLF, PromiseArray);
  }

  /**
   * locate a search string inside header lines and return a document position (line and column)
   *
   * @param headerLines
   * @param startLine
   * @param searchLower
   * @param extraOffset
   * @returns
   */
  private locateInHeaderLines(headerLines: string[], startLine: number, searchLower: string, extraOffset: number): { foundLine: number, foundColumn: number } {
    for (let li = 0; li < headerLines.length; li++) {
      const idx = headerLines[li].toLowerCase().indexOf(searchLower);
      if (idx >= 0) {
        const foundLine = startLine + li;
        const leadingSpaces = headerLines[li].length - headerLines[li].trimStart().length;
        const foundColumn = idx + leadingSpaces + (typeof extraOffset === "number" ? extraOffset : 0);
        return { foundLine, foundColumn };
      }
    }
    return { foundLine: startLine, foundColumn: 0 };
  }

  /**
   * If variable is local scope, push a promise that resolves when its uses are gathered
   *
   * @param variable
   * @param textLF
   * @param PromiseArray
   */
  private pushUsesPromiseIfLocal(variable: CobolVariable, textLF: string, PromiseArray: Promise<undefined>[], allowParagraphScope = false) {
    if (!VariableUtils.isLocalScope(variable)) {
      return;
    }
    PromiseArray.push(
      new Promise((resolve, reject) => {
        this.getUsesFromVariable(textLF, variable, allowParagraphScope).then((usesFromVariable) => {
          Q.all(usesFromVariable).then(() => {
            return resolve(undefined);
          }).catch((e) => {
            return reject(e);
          });
        }).catch((e) => {
          return reject(e);
        });
      })
    );
  }

  /**
   * Returns all variables and your uses in a promise array
   *
   * @param textLF
   * @param regex
   * @returns
   */
  private getDefaultLocalVariables(textLF: string, regex: RegExp): Promise<undefined>[] {
    const PromiseArray: Promise<undefined>[] = []
    new Scan(textLF).scan(regex, (iterator: any) => {
      PromiseArray.push(
        new Promise((resolve, reject) => {
          const buffer = textLF.split("\n");
          if (buffer[iterator.row].trim().length == 0) {
            return resolve(undefined);
          }
          const variable = CobolVariable.parseLines(iterator.row, buffer, { noChildren: true, noSection: true, ignoreMethodReturn: true, noComment: true });
          if (VariableUtils.isLocalScope(variable)) {
            this.getUsesFromVariable(textLF, variable).then((usesFromVariable) => {
              Q.all(usesFromVariable).then(() => {
                return resolve(undefined);
              }).catch((e) => {
                return reject(e);
              })
            }).catch((e) => {
              return reject(e);
            })
            return resolve(undefined);
          } else {
            return resolve(undefined);
          }
        })
      );
    });
    return PromiseArray;
  }

  /**
   * Returns all uses from variables in a promise array
   *
   * @param activeEditor
   * @param text
   * @param variable
   */

  /**
   * Returns the offset within shortText where the current scope ends.
   * Uses the next paragraph declaration (7-space indent + word + period) as the boundary.
   * Consistent with the paragraph regex used in editor.ts and cobolFlowAnalyzer.ts.
   */
  private findScopeEnd(shortText: string): number {
    const paragraphRegex = /^ {7}[.\w-]+\.(?:\s*\*>.*)?$/gm;
    const firstNewline = shortText.indexOf("\n");
    if (firstNewline === -1) return shortText.length;
    let match: RegExpExecArray | null;
    while ((match = paragraphRegex.exec(shortText)) !== null) {
      if (match.index > firstNewline) {
        return match.index;
      }
    }
    return shortText.length;
  }

  private getUsesFromVariable(text: string, variable: CobolVariable, allowParagraphScope = false): Promise<Promise<undefined>[]> {
    return new Promise((resolve, reject) => {
      const PromiseArray: Promise<undefined>[] = []
      const variableDeclarationPosition = variable.getDeclarationPosition()
      if (!variableDeclarationPosition) {
        return reject();
      }
      let shortText = text.split("\n").slice(variableDeclarationPosition.line).join("\n")
      const variableUseRegex = CobolRegexUtils.createRegexForVariableUsage(variable.getName());
      const endMethodRegex = new RegExp(`(\\s+end\\s+method\\.)`, "img")
      const endMethodLine = endMethodRegex.exec(shortText)
      if (endMethodLine) {
        shortText = shortText.substr(0, endMethodLine.index + endMethodLine[1].length).replace(/\r/g, "")
      } else if (allowParagraphScope) {
        shortText = shortText.substr(0, this.findScopeEnd(shortText)).replace(/\r/g, "")
      } else {
        return reject();
      }
      new Scan(shortText).scan(variableUseRegex, (iterator: any) => {
        PromiseArray.push(
          new Promise((resolve, _reject) => {
            const startLine = iterator.row;
            const startCharacter = iterator.column;
            let startPos = new Position(startLine, startCharacter);
            // If the line is a commentary, dont decore
            if (!shortText.split("\n")[startPos.line].trim().startsWith("*>")) {
              const endLine = iterator.row;
              const endCharacter = iterator.column;
              let endPos = new Position(endLine, endCharacter + variable.getName().length + 1);
              // Adjust the start/end line and add the range in list to decorate
              startPos = new Position(startPos.line + variableDeclarationPosition.line, startPos.character + 1)
              endPos = new Position(endPos.line + variableDeclarationPosition.line, endPos.character)
              this.localVariableRangeList.push(new Range(startPos, endPos));
            }
            return resolve(undefined);
          })
        );
      });
      return resolve(PromiseArray);
    });
  }

  /**
   * Find copys used on current file
   *
   * @param activeEditor
   */
  public findCopys(activeEditor: TextEditor): Promise<CobolCopy[]> {
    return new Promise((resolve, reject) => {
      const text = activeEditor.document.getText();
      Q.allSettled(this.getAllCopys(text, activeEditor.document.fileName)).then((results) => {
        const copys: CobolCopy[] = [];
        results.forEach((result) => {
          if (result.state === "fulfilled") {
            copys.push(result.value!);
          }
        });
        return resolve(copys);
      }).catch((e) => {
        return reject(e);
      })
    });
  }

  /**
   * Returns all copys on text buffer and return this in a promise array
   *
   * @param text
   * @param fileName
   */
  private getAllCopys(text: string, fileName: string): Promise<CobolCopy>[] {
    const PromiseArray: Promise<CobolCopy>[] = []
    // Regexp to find variables declarations in source
    const regex = /^ +copy\s+(.+.cp.+)[.,]/gm
    new Scan(text).scan(regex, (iterator: any) => {
      PromiseArray.push(
        new Promise((resolve, reject) => {
          CobolCopy.parseLine(iterator.row, text.split("\n"), fileName).then((copy) => {
            if (!copy) {
              return reject();
            }
            return resolve(copy);
          }).catch((e) => reject(e));
        })
      );
    });
    return PromiseArray;
  }



  /**
   * Finds documentation comment blocks with Rech documentation starting with "*> @"
   * @param activeEditor The active text editor containing the code document
   */
  public findRechDocComments(activeEditor: TextEditor): Promise<undefined> {
    return new Promise((resolve, _reject) => {
      const text = activeEditor.document.getText();
      // Regex to search documentation comment blocks between "*>/**   *>*/"
      const blockCommentRegEx = /(^|[ \t])(\*>\/\*\*)+([\s\S]*?)(\*\/)/igm;
      // Regex to find parameter lines inside a documentation block
      const lineParameterRegEx = /([ \t]*\*>[ \t]*)(@param|@enum|@return|@throws|@optional|@default|@extends)([ ]*|[:])+([a-zA-Z0-9_()?-]*) *([^*/][^\r\n]*)/ig;
      // Find all documentation comment blocks on text
      for (const match of text.matchAll(blockCommentRegEx)) {
        const commentBlock = match[0];
        // Find all parameter lines inside a block
        for (const line of commentBlock.matchAll(lineParameterRegEx)) {
          // Parts from line
          const fisrtPart = 1;
          const token = 2;
          const variable = 3;
          const comment = 4;
          // Range of parameter description type
          let startPos = activeEditor.document.positionAt(match.index + line.index + line[fisrtPart].length);
          let endPos = activeEditor.document.positionAt(match.index + line.index + line[fisrtPart].length + line[token].length);
          // Add the range in list to decorate
          this.rechDocTypeRangeList.push(new Range(startPos, endPos));
          // If documentation line have variable after type
          if (line[comment].length != 0) {
            // Range of parameter variable
            startPos = activeEditor.document.positionAt(match.index + line.index + line[fisrtPart].length + line[token].length + line[variable].length);
            endPos = activeEditor.document.positionAt(match.index + line.index + line[fisrtPart].length + line[token].length + line[variable].length + line[comment].length);
            // Add the range in list to decorate
            this.rechDocVariableRangeList.push(new Range(startPos, endPos));
          }
        }
      }
      return resolve(undefined);
    });
  }

  /**
   * Find exit flow commands (goback, exit program/method/function/paragraph/perform, stop run, next sentence)
   * and collect their ranges for decoration.
   *
   * @param activeEditor
   */
  public findExitFlowCommands(activeEditor: TextEditor): void {
    const enabled = new Configuration("rech.editor.cobol").get<boolean>("highlightExitFlowCommands", true);
    if (!enabled) {
      return;
    }
    const text = activeEditor.document.getText();
    const lines = text.replace(/\r/g, "").split("\n");
    const exitRegex = /(?<![-_])(?:exit\s+program|exit\s+method|exit\s+function|exit\s+paragraph|exit\s+perform(?:\s+cycle)*|exit|next\s+sentence|goback|stop\s+run)(?=\s|\.|,|$)/gim;
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      // Skip comment lines
      if (line.trim().startsWith("*>") || (line.length > 6 && line[6] === "*")) {
        continue;
      }
      let match: RegExpExecArray | null;
      const regex = new RegExp(exitRegex.source, exitRegex.flags);
      while ((match = regex.exec(line)) !== null) {
        const startPos = new Position(lineIndex, match.index);
        const endPos = new Position(lineIndex, match.index + match[0].length);
        this.exitFlowRangeList.push(new Range(startPos, endPos));
      }
    }
  }

  /**
   * Applies decorations previously found
   * @param activeEditor The active text editor containing the code document
   */
  public applyDecorations(activeEditor: TextEditor): void {
    const colors = new Configuration("rech.editor.cobol").get<any>("especialColors");
    // Create decorator to RechDoc type of documentation and aply on Ranges
    let color: DecorationRenderOptions;
    color = {
      dark: { color: colors.rechdocToken, backgroundColor: "transparent" },
      light: { color: this.invertHex(colors.rechdocToken), backgroundColor: "transparent" }
    };
    let decorator = window.createTextEditorDecorationType(color);
    activeEditor.setDecorations(decorator, this.rechDocTypeRangeList);
    if (Parser.lastRechDocTypeDecorator) {
      Parser.lastRechDocTypeDecorator.dispose()
    }
    Parser.lastRechDocTypeDecorator = decorator;
    this.rechDocTypeRangeList.length = 0;
    // Create decorator to RechDoc variable documentation and aply on Ranges
    color = {
      dark: { color: colors.rechdocVariable, backgroundColor: "transparent" },
      light: { color: this.invertHex(colors.rechdocVariable), backgroundColor: "transparent" }
    };
    decorator = window.createTextEditorDecorationType(color);
    activeEditor.setDecorations(decorator, this.rechDocVariableRangeList);
    if (Parser.lastRechDocVariableDecorator) {
      Parser.lastRechDocVariableDecorator.dispose()
    }
    Parser.lastRechDocVariableDecorator = decorator;
    this.rechDocVariableRangeList.length = 0;
    // Create decorator to local variable and aply on Ranges
    color = {
      dark: { color: colors.localScopeVariable, backgroundColor: "transparent" },
      light: { color: this.invertHex(colors.localScopeVariable), backgroundColor: "transparent" }
    };
    decorator = window.createTextEditorDecorationType(color);
    activeEditor.setDecorations(decorator, this.localVariableRangeList);
    if (Parser.lastLocalVariableDecorator) {
      Parser.lastLocalVariableDecorator.dispose()
    }
    Parser.lastLocalVariableDecorator = decorator;
    this.localVariableRangeList.length = 0;
    // Create decorator to exit flow commands and aply on Ranges
    if (this.exitFlowRangeList.length > 0) {
      const exitColor = colors.exitFlowCommand || "#ff50f0";
      color = {
        dark: { color: exitColor, backgroundColor: "transparent" },
        light: { color: this.invertHex(exitColor), backgroundColor: "transparent" }
      };
      decorator = window.createTextEditorDecorationType(color);
      activeEditor.setDecorations(decorator, this.exitFlowRangeList);
      if (Parser.lastExitFlowDecorator) {
        Parser.lastExitFlowDecorator.dispose()
      }
      Parser.lastExitFlowDecorator = decorator;
      this.exitFlowRangeList.length = 0;
    }
  }

  /**
   * Invert the hex color
   *
   * @param hex
   */
  invertHex(hex: string) {
    const invertEspecialColorsInLightTheme = new Configuration("rech.editor.cobol").get<any>("invertEspecialColorsInLightTheme");
    if (!invertEspecialColorsInLightTheme) {
      return hex;
    }
    const numberFromHex = Number(`0x1${hex.substr(1)}`);
    return `#${(numberFromHex ^ 0xFFFFFF).toString(16).substr(1).toUpperCase()}`
  }

}

