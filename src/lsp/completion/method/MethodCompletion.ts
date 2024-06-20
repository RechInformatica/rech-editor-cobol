import { CompletionItemKind, CompletionItem, InsertTextFormat, MarkupKind } from "vscode-languageserver";
import { CompletionInterface } from "../CompletionInterface";
import { CobolDeclarationFinder } from "../../declaration/CobolDeclarationFinder";
import { CobolVariable } from "../CobolVariable";
import { ParserCobol } from "../../../cobol/parsercobol";
import { Path } from "../../../commons/path";
import { Scan, BufferSplitter } from "rech-ts-commons";
import { CobolMethod } from "../CobolMethod";
import Q from "q";
import { FindParameters } from "../../declaration/FindInterface";
import { PackageFinder } from "../../declaration/PackageFinder";
import { FileUtils } from "../../../commons/FileUtils";
import { RechPosition } from "../../../commons/rechposition";
import { CompletionTarget } from "./CompletionTarget";
import { MethodCompletionUtils } from "./MethodCompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'add' clause
 */
export class MethodCompletion implements CompletionInterface {

  private uri: string;
  private externalMethodCompletion: ((args: any) => Thenable<any>) | undefined;

  constructor(uri: string, externalMethodCompletion?: (args: any) => Thenable<any>) {
    this.uri = uri;
    this.externalMethodCompletion = externalMethodCompletion;
  }

  public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      MethodCompletionUtils.findTargetElement(line, column, lines)
        .then(completionTarget => {
          //
          // Since we're suggesting methods of the current class we don't need to discover which class
          // it represents. We already have the buffer of current class from the parameter of this method
          //
          // So, we just extract the methods from the given buffer.
          //
          if (this.isSelfInstance(completionTarget.elementName)) {
            const joinedLines: string = lines.join('\n');
            this.extractMethodCompletionsFromBuffer(joinedLines)
              .then(items => resolve(items))
              .catch((e) => reject(e));
          } else {
            //
            // On this situation we're not suggesting methods of the current instance.
            //
            // So, we need to discover the class name, load the class content and finally suggest it`s methods
            //
            MethodCompletionUtils.findTargetClassDeclaration(this.uri, completionTarget, line, lines).then((clazz) => {
              new PackageFinder(lines).findClassFileUri(clazz, 0, 0, this.uri).then((classFileUri: string) => {
                this.extractMethodCompletionsFromClassUri(classFileUri)
                  .then((methodsCompletions) => {
                    return resolve(methodsCompletions);
                  }).catch((e) => {
                    this.createExternalMethodCompletionPromise(e).then((result) => {
                      return resolve(result);
                    }).catch((e) => {
                      return reject(e);
                    });
                  });
              }).catch((e) => {
                this.createExternalMethodCompletionPromise(e).then((result) => {
                  return resolve(result);
                }).catch((e) => {
                  return reject(e);
                });
                if (this.externalMethodCompletion) {
                  this.externalMethodCompletion("").then((result) => {
                    return resolve(<CompletionItem[]>result.items);
                  }, (e) => reject(e))
                } else {
                  return reject(e);
                }
              }
              );
            }).catch((e) => reject(e));
          }
        })
        .catch((e) => reject(e));
    });
  }

  /**
   * Create a promise to run externalMethodCompletion
   *
   * @param currentError
   */
  private createExternalMethodCompletionPromise(currentError: any): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      if (this.externalMethodCompletion) {
        this.externalMethodCompletion("").then((result) => {
          return resolve(<CompletionItem[]>result.items);
        }, (e) => reject(e))
      } else {
        return reject(currentError);
      }
    });
  }

  /**
   * Returns true whether the current call chain starts calling a method on the
   * current instance
   *
   * @param element element to check whether represents the current instance
   */
  private isSelfInstance(element: string): boolean {
    return element === CobolMethod.SELF_INSTANCE_NAME;
  }


  /**
   * Breaks the chain and returns the target class declaration.
   */
  private findTargetClassDeclaration(target: CompletionTarget, line: number, lines: string[]): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      const referencePosition: RechPosition = this.extractTargetPositionFromBuffer(target, line);
      if (referencePosition.column == 0 || referencePosition.line == 0) {
        return reject();
      }
      //
      // Constructs objects to find definition
      //
      const findParams: FindParameters = { term: target.elementName, uri: this.uri, lineIndex: referencePosition.line, columnIndex: referencePosition.column }
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
            this.extractClass(position.line, position.column, lines, this.uri)
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

  private normalizeLine(line: string, currentColumn: number): string {
    let normalizedLine: string = "";
    normalizedLine = line;
    normalizedLine = normalizedLine.substr(0, currentColumn);
    normalizedLine = normalizedLine.trim()
    normalizedLine = normalizedLine.replace(/\(.*?\)/g, "");
    return normalizedLine;
  }

  private extractTargetFromCommand(currentCommand: string): string {
    const chain: string[] = this.extractCallChainFromCommand(currentCommand);
    const target = chain[chain.length - 1];
    return target;
  }

  private extractCallChainFromCommand(currentCommand: string): string[] {
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

  private extractTargetPositionFromBuffer(target: CompletionTarget, line: number): RechPosition {
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
  private extractClass(line: number, column: number, buffer: string[], uri: string): Promise<CobolVariable> {
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

  /**
   * Extracts the methods from the class file.
   *
   * Given the full file name of `classFileUri`, reads it's content and extracts every
   * method declaration with a regular expression.
   */
  private extractMethodCompletionsFromClassUri(classFileUri: string): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      FileUtils.read(classFileUri)
        .then((buffer) => {
          this.extractMethodCompletionsFromBuffer(buffer, true)
            .then((results) => resolve(results))
            .catch((e) => reject(e));
        })
        .catch((e) => reject(e));
    });
  }

  /**
   * Extracts the methods from the given buffer, using a regular expression.
   *
   * Here is an example of COBOL method, which in this example would extract 'read' as method name.
   *
   *   *>-> <COBOL documentation>
   *    method-id. read static.
   *    working-storage section.
   *    77  fileReader             object reference SFileReader.
   *    77  out-content            pic is x any length.
   *    linkage section.
   *    77  in-source-file-name    object reference IPicX.
   *    procedure division using in-source-file-name returning out-content raising SFileException.
   *        ...
   *    end method.
   */
  private extractMethodCompletionsFromBuffer(buffer: string, filterPrivateMethods?: boolean): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      const methodsCompletions: CompletionItem[] = [];
      const methodsPromise = new Array();
      new Scan(buffer).scan(/^ +METHOD-ID\.\s+([\w]+)[\s\,\.]+.*/gim, (iterator: any) => {
        methodsPromise.push(CobolMethod.parseLines(iterator.row, iterator.column, BufferSplitter.split(buffer)));
      })
      Q.allSettled(methodsPromise).then((results) => {
        const methods: CobolMethod[] = [];
        results.forEach((result) => {
          if (result.state === "fulfilled" && result.value) {
            const method = <CobolMethod>result.value;
            if (!filterPrivateMethods || (filterPrivateMethods && !method.isPrivate())) {
              methods.push(method);
            }
          }
        });
        methods.forEach((method) => {
          methodsCompletions.push(this.buildMethodCompletion(method));
        });
        resolve(methodsCompletions);
      }).catch((e) => reject(e));
    });
  }

  /**
   * Build the CompletionItem instance for the given method.
   */
  private buildMethodCompletion(method: CobolMethod): CompletionItem {
    const methodName = method.getName();
    const methodParams = method.getDocumentation().params.map(param => param.name).join(", ");
    const label = `${methodName}(${methodParams})`;
    const returns = method.getDocumentation().returns.map(methodReturn => methodReturn.name).join(", ");
    const documentation = method.getDocumentation().asMarkdown()
    const text = this.buildMethodCompletionText(method);
    return {
      label: label,
      detail: returns,
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

  /**
   * Builds the method completion text.
   *
   * The result is a string considering method name and possible
   * method parameters, with repsective types.
   */
  private buildMethodCompletionText(method: CobolMethod): string {
    let text = method.getName();
    const params = method.getParams();
    for (let i = 0; i < params.length; i++) {
      const param = params[i];
      if (i > 0) {
        text += `, \${${i + 1}:${param.getName()}}`
      } else {
        text += `(\${${i + 1}:${param.getName()}}`
      }
    }
    if (params.length > 0) {
      text += ")"
    }
    return text;
  }

}
