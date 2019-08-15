import { CompletionItemKind, CompletionItem, InsertTextFormat, MarkupKind } from "vscode-languageserver";
import { CompletionInterface } from "../CompletionInterface";
import { CobolDeclarationFinder } from "../../declaration/CobolDeclarationFinder";
import { RechPosition } from "../../../commons/rechposition";
import { CobolVariable } from "../CobolVariable";
import { File } from "../../../commons/file";
import { ParserCobol } from "../../../cobol/parsercobol";
import { Path } from "../../../commons/path";
import { Scan } from "../../../commons/Scan";
import { CobolMethod } from "../CobolMethod";
import Q from "q";

/**
 * Class to generate LSP Completion Items for Cobol 'add' clause
 */
export class MethodCompletion implements CompletionInterface {

  /** uri of file */
  private uri: string;
  private cachFiles: Map<string, string[]>;

  constructor(uri: string) {
    this.uri = uri;
    this.cachFiles = new Map();
  }

  public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      this.getTargetClass(line, column, lines).then((classs) => {
        this.getClassPackage(classs, line, column, lines, this.uri).then((classPackage: string) => {
          this.extractMethodsCompletionFromClass(classPackage).then((methodsCompletions) => {
            return resolve(methodsCompletions);
          }).catch(() => {
            return reject();
          });
        }).catch(() => {
          return reject();
        });
      }).catch(() => {
        return reject();
      })
    });
  }

  /**
   * Break the chain and returns the target class
   *
   * @param line
   * @param column
   * @param lines
   */
  private getTargetClass(line: number, column: number, lines: string[]): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      let currentLine = "";
      const analisedBuffer = [];
      let currentColumn = column;
      for (let i = line; i > 0; i--) {
        analisedBuffer.push(lines[i]);
        currentLine = lines[i].substr(0, currentColumn).trim().replace(/\(.*?\)/g, "") + currentLine;
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
      let chain = currentCommand.split(CobolMethod.TOKEN_INVOKE_METHOD);
      // Remove the last command because this is invalid
      chain = chain.slice(0, chain.length - 1);
      const target = chain[chain.length - 1];
      let referenceColumn = 0;
      let referenceLine = 0;
      for (let i = 0; i < analisedBuffer.length; i++) {
        const analisedLine = analisedBuffer[i];
        const pattert = new RegExp(`[\\s\\,\\.\\(\\)\\:\\>]${target}[\\s\\,\\.\\(\\)\\:]`);
        const match = analisedLine.match(pattert);
        if (!match) {
          continue;
        }
        referenceColumn = match.index! + 1 + target.length;
        referenceLine = line - i;
        break;
      }
      if (referenceColumn == 0 || referenceLine == 0) {
        return reject();
      }
      new CobolDeclarationFinder(lines.join("\n")).findDeclaration(target, this.uri, referenceLine, referenceColumn).then((position) => {
        if (!position.file) {
          this.extractClass(position.line, position.column, lines, this.uri).then((classs) => {
            return resolve(classs);
          }).catch(() => {
            return reject();
          })
        } else {
          new File(new Path(position.file).fullPathWin()).loadBuffer().then((buffer) => {
            this.extractClass(position.line, position.column, buffer.split("\n"), new Path(position.file!).fullPathWin()).then((classs) => {
              return resolve(classs);
            }).catch(() => {
              return reject();
            });
          }).catch(() => {
            return reject();
          })
        }
      }).catch(() => {
        return reject();
      });
    })
  }

  /**
   * Extract the CobolVariable object to represnt a target class, from the buffer
   *
   * @param line
   * @param column
   * @param buffer
   */
  private extractClass(line: number, column: number, buffer: string[], uri: string): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      const parser = new ParserCobol();
      const currentLine = buffer[line];
      if (parser.getDeclaracaoMethod(currentLine)) {
        CobolMethod.parseLines(line, column, buffer).then((method) => {
          if (method && method.getVariableReturn()) {
            return resolve(method.getVariableReturn());
          } else {
            return reject();
          }
        }).catch(() => {
          reject();
        })
      } else if (parser.getDeclaracaoVariavel(currentLine)) {
        const variable = CobolVariable.parseLines(line, buffer, {ignoreMethodReturn: true, noChildren: true, noComment: true, noScope: true, noSection: true});
        const reference = variable.getObjectReferenceOf();
        if (!reference) {
          return variable;
        } else {
          new CobolDeclarationFinder(buffer.join("\n")).findDeclaration(reference, uri, 0, 0).then((position) => {
            if (!position.file) {
              return resolve(CobolVariable.parseLines(position.line, buffer, {ignoreMethodReturn: true, noChildren: true, noComment: true, noScope: true, noSection: true}));
            } else {
              new File(position.file).loadBuffer().then((classFileBuf) => {
                return resolve(CobolVariable.parseLines(position.line, classFileBuf.split("\n"), {ignoreMethodReturn: true, noChildren: true, noComment: true, noScope: true, noSection: true}));
              }).catch(() => {
                return reject();
              })
            }
          }).catch(() => {
            reject();
          })
        }
      } else if (parser.getDeclaracaoClasse(currentLine)) {
        const variable = CobolVariable.parseLines(line, buffer, {ignoreMethodReturn: true, noChildren: true, noComment: true, noScope: true, noSection: true});
        return resolve(variable);
      } else {
        return reject();
      }
    });
  }

  /**
   * Returns the class package
   *
   * @param variable
   * @param line
   * @param lines
   */
  private getClassPackage(variable: CobolVariable, line: number, column: number, lines: string[], uri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (variable.isDummy()) {
        return resolve(this.getFullPathFromClassSource(variable.getName()));
      }
      let classs = new ParserCobol().getDeclaracaoClasse(variable.getRaw());
      let classPackage = "";
      if (classs) {
        const raw = variable.getRaw();
        const pack = /(?:^\s+CLASS\s+[\w]+\s+AS\s+(.*)|^\s+[\w]+\s+IS\s+CLASS\s+(.*))/gmi.exec(raw);
        if (!pack) {
          return reject();
        }
        classPackage = pack[1] ? pack[1] : pack[2];
        return resolve(this.getFullPathFromClassSource(classPackage.replace(/\"/g, "")));
      } else {
        classs = variable.getObjectReferenceOf();
        if (!classs) {
          return reject();
        }
        this.buildCobolVariable(classs, line, column, lines, uri).then((classCobolVariable) => {
          this.getClassPackage(classCobolVariable, line, column, lines, uri).then((classPackage) => {
            return resolve(classPackage);
          }).catch(() => {
            return reject();
          })
        }).catch(() => {
          return reject();
        })
      }
    })
  }

  /**
   * Returns a fullPath from class file
   *
   * @param classs
   * @param uri
   */
  private getFullPathFromClassSource(classs: string) {
    let path = new Path(new Path(this.uri).fullPathWin()).directory() + classs + ".cbl";
    if (new File(path).exists()) {
      return path;
    }
    path = "F:\\Fontes\\" + classs + ".cbl";
    if (new File(path).exists()) {
      return path;
    }
    return "";
  }

  /**
   * Find the variable declaration and build a CobolVariable
   *
   * @param variable
   * @param line
   * @param lines
   */
  private buildCobolVariable(variable: string, _line: number, _column: number, lines: string[], uri: string): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      new CobolDeclarationFinder(lines.join("\n"))
        .findDeclaration(variable, uri, 0, 0).then((position: RechPosition) => {
          if (!position.file) {
            return resolve(CobolVariable.parseLines(position.line, lines, {noChildren: true, noComment: true, noSection: true, noScope: true, ignoreMethodReturn: true}));
          } else {
            new File(position.file).loadBuffer().then((buffer) => {
              const bufferArray = buffer.split("\n");
              return resolve(CobolVariable.parseLines(position.line, bufferArray, {noChildren: true, noComment: true, noSection: true, noScope: true, ignoreMethodReturn: true}));
            }).catch(() => {
              return reject();
            })
          }
        }).catch(() => {
          return reject();
        });
    })
  }

  /**
   * Extract the methods from the class file
   *
   * @param classFile
   */
  private extractMethodsCompletionFromClass(classFile: string): Promise<CompletionItem[]>  {
    return new Promise((resolve, reject) => {
      const methodsPromise = new Array();
      const methodsCompletions: CompletionItem[] = [];
      new File(classFile).loadBuffer().then((buff) => {
        new Scan(buff).scan(/^\s+METHOD-ID\.\s+([\w]+)[\s\,\.]+.*/gim, (iterator: any) => {
          methodsPromise.push(CobolMethod.parseLines(iterator.row, iterator.column ,buff.split("\r\n")));
        })
        Q.allSettled(methodsPromise).then((results) => {
          const methods: CobolMethod[] = [];
          results.forEach((result) => {
            if (result.state === "fulfilled") {
              methods.push(result.value!);
            }
          });
          methods.forEach((method) => {
            methodsCompletions.push(this.buildMethodCompletion(method));
          });
          return resolve(methodsCompletions);
        }).catch(() => {
          reject();
        });
      }).catch(() => {
        reject();
      });
    });
  }

  /**
   * Build the completionItem from method
   *
   * @param method
   */
  private buildMethodCompletion(method: CobolMethod): CompletionItem {
    const label = method.getName();
    const documentation = method.getDocumentation().asMarkdown()
    let text = label;
    const params = method.getParams();
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      if (i > 0) {
        text += `, \${${i+1}:${param.getName()}}`
      } else {
        text += `(\${${i+1}:${param.getName()}}`
      }
    }
    if (params.length > 0) {
      text += ")"
    }
    return {
      label: label,
      documentation: {
        kind: MarkupKind.Markdown,
        value: documentation
      },
      insertText: text,
      insertTextFormat: InsertTextFormat.Snippet,
      filterText: label,
      preselect: true,
      kind: CompletionItemKind.Method
    };
  }

}