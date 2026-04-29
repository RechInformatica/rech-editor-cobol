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
import { ExpandedSourceManager } from "../../../cobol/ExpandedSourceManager";

/**
 * Class to generate LSP Completion Items for Cobol 'add' clause
 */
export class MethodCompletion implements CompletionInterface {

  /** Cache of method completion items keyed by element name (variable/class name) */
  private static cache: Map<string, CompletionItem[]> = new Map();

  /** Whether to filter out protected methods from completion */
  private static filterProtectedMethods: boolean = true;

  private uri: string;
  private externalMethodCompletion: ((args: any) => Thenable<any>) | undefined;

  constructor(uri: string, externalMethodCompletion?: (args: any) => Thenable<any>) {
    this.uri = uri;
    this.externalMethodCompletion = externalMethodCompletion;
  }

  /**
   * Sets whether protected methods should be filtered out from completion
   */
  public static setFilterProtectedMethods(filter: boolean) {
    MethodCompletion.filterProtectedMethods = filter;
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
            // Check cache first: if we have cached items for this element, return them
            // immediately and trigger a background refresh.
            //
            const cached = MethodCompletion.cache.get(completionTarget.elementName);
            if (cached) {
              resolve(cached);
              // Background refresh to update cache for next time
              this.loadMethodCompletions(completionTarget, line, column, lines).then((items) => {
                MethodCompletion.cache.set(completionTarget.elementName, items);
              }).catch(() => {});
            } else {
              // Load methods for this element and cache them
              this.loadMethodCompletions(completionTarget, line, column, lines).then((items) => {
                MethodCompletion.cache.set(completionTarget.elementName, items);
                resolve(items);
              }).catch((e) => reject(e));
            }
          }
        })
        .catch((e) => reject(e));
    });
  }

  /**
   * Loads method completions for the target. Tries local source first, then expanded source.
   */
  private loadMethodCompletions(completionTarget: CompletionTarget, line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      this.resolveMethodCompletionsForTarget(completionTarget, line, lines)
        .then((items) => resolve(items))
        .catch(() => {
          this.retryWithExpandedSource(line, column, lines)
            .then((items) => resolve(items))
            .catch((e) => reject(e));
        });
    });
  }

  /**
   * Resolves method completions for a given target (finds class declaration, then extracts methods).
   */
  private resolveMethodCompletionsForTarget(completionTarget: CompletionTarget, line: number, lines: string[]): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      MethodCompletionUtils.findTargetClassDeclaration(this.uri, completionTarget, line, lines).then((clazz) => {
        new PackageFinder(lines).findClassFileUri(clazz, 0, 0, this.uri).then((classFileUri: string) => {
          this.extractMethodCompletionsFromClassUri(classFileUri)
            .then((methodsCompletions) => resolve(methodsCompletions))
            .catch((e) => {
              this.createExternalMethodCompletionPromise(e)
                .then((result) => resolve(result))
                .catch((e) => reject(e));
            });
        }).catch((e) => {
          this.createExternalMethodCompletionPromise(e)
            .then((result) => resolve(result))
            .catch((e) => reject(e));
        });
      }).catch((e) => reject(e));
    });
  }

  /**
   * Retries the entire method completion flow using expanded source.
   * Finds the equivalent cursor line in the expanded source and restarts
   * from findTargetElement.
   */
  private retryWithExpandedSource(line: number, column: number, localLines: string[]): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      ExpandedSourceManager.getExpandedSource(this.uri).then((expandedBuffer) => {
        const expandedLines = BufferSplitter.split(expandedBuffer).map(l => l.substring(0, 120));
        const expandedLine = this.findEquivalentLine(localLines[line], expandedLines);
        if (expandedLine < 0) {
          return reject("Could not find equivalent line in expanded source");
        }
        MethodCompletionUtils.findTargetElement(expandedLine, column, expandedLines)
          .then((completionTarget) => {
            MethodCompletionUtils.findTargetClassDeclaration(this.uri, completionTarget, expandedLine, expandedLines).then((clazz) => {
              new PackageFinder(expandedLines).findClassFileUri(clazz, 0, 0, this.uri).then((classFileUri: string) => {
                this.extractMethodCompletionsFromClassUri(classFileUri)
                  .then((methodsCompletions) => resolve(methodsCompletions))
                  .catch((e) => reject(e));
              }).catch((e) => reject(e));
            }).catch((e) => reject(e));
          })
          .catch((e) => reject(e));
      }).catch((e) => reject(e));
    });
  }

  /**
   * Finds the equivalent line number in the expanded source by matching line content.
   * Returns -1 if not found.
   */
  private findEquivalentLine(lineContent: string, expandedLines: string[]): number {
    const trimmed = lineContent.trimEnd();
    for (let i = 0; i < expandedLines.length; i++) {
      if (expandedLines[i].trimEnd() === trimmed) {
        return i;
      }
    }
    return -1;
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
   * Extracts the methods from the class file.
   *
   * Given the class file URI, reads its content (using expanded source to handle COPY with REPLACING)
   * and extracts every method declaration with a regular expression.
   */
  private extractMethodCompletionsFromClassUri(classFileUri: string): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      ExpandedSourceManager.getExpandedSource(classFileUri).then((buffer) => {
        this.extractMethodCompletionsFromBuffer(buffer.toString(), true)
          .then((results) => resolve(results))
          .catch((_e) => {
            // Fallback to direct file read if expanded source fails
            FileUtils.read(classFileUri)
              .then((buffer) => {
                this.extractMethodCompletionsFromBuffer(buffer, true)
                  .then((results) => resolve(results))
                  .catch((e) => reject(e));
              })
              .catch((e) => reject(e));
          });
      }).catch((_e) => {
        // Fallback to direct file read if expanded source is not available
        FileUtils.read(classFileUri)
          .then((buffer) => {
            this.extractMethodCompletionsFromBuffer(buffer, true)
              .then((results) => resolve(results))
              .catch((e) => reject(e));
          })
          .catch((e) => reject(e));
      });
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
      const methodsPromise: Promise<CobolMethod>[] = [];
      new Scan(buffer).scan(/^ +METHOD-ID\.\s+([\w]+)[\s,.]+.*/gim, (iterator: any) => {
        methodsPromise.push(CobolMethod.parseLines(iterator.row, iterator.column, BufferSplitter.split(buffer)));
      })
      Q.allSettled(methodsPromise).then((results) => {
        const methods: CobolMethod[] = [];
        results.forEach((result) => {
          if (result.state === "fulfilled" && result.value) {
            const method = <CobolMethod>result.value;
            if (filterPrivateMethods && method.isPrivate()) {
              return;
            }
            if (MethodCompletion.filterProtectedMethods && method.isProtected()) {
              return;
            }
            methods.push(method);
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

  /**
   * Clear the method completions cache
   */
  public static clearCache() {
    MethodCompletion.cache = new Map();
  }

}
