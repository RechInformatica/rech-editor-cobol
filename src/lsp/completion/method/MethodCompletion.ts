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

/**
 * Class to generate LSP Completion Items for Cobol 'add' clause
 */
export class MethodCompletion implements CompletionInterface {

  private uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      this.findTargetClassDeclaration(line, column, lines).then((clazz) => {
        new PackageFinder(lines).findClassFileUri(clazz, 0, 0, this.uri).then((classFileUri: string) => {
          this.extractMethodCompletionsFromClassUri(classFileUri)
            .then((methodsCompletions) => resolve(methodsCompletions))
            .catch(() => reject());
        }).catch(() => reject());
      }).catch(() => reject());
    });
  }

  /**
   * Breaks the chain and returns the target class declaration.
   */
  private findTargetClassDeclaration(line: number, column: number, lines: string[]): Promise<CobolVariable> {
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
      const target: string = this.extractTargetFromCommand(currentCommand);
      let referencePosition: RechPosition = this.extractTargetPositionFromBuffer(analisedBuffer, target, line);
      if (referencePosition.column == 0 || referencePosition.line == 0) {
        return reject();
      }
      //
      // Constructs objects to find definition
      //
      const findParams: FindParameters = { term: target, uri: this.uri, lineIndex: referencePosition.line, columnIndex: referencePosition.column }
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
              .catch(() => reject());
            return;
          }
          //
          // The definition is on a different file, so we need to load the file content and
          // extract class/method from the buffer read
          //
          FileUtils.read(new Path(position.file).fullPathWin()).then((buffer) => {
            const splitted = BufferSplitter.split(buffer);
            const fullPath = new Path(position.file!).fullPathWin();
            this.extractClass(position.line, position.column, splitted, fullPath)
              .then((clazz) => resolve(clazz))
              .catch(() => reject());
          }).catch(() => reject());
        }).catch(() => reject());
    })
  }

  private normalizeLine(line: string, currentColumn: number) {
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

  private extractTargetPositionFromBuffer(analisedBuffer: string[], target: string, line: number): RechPosition {
    let referenceColumn = 0;
    let referenceLine = 0;
    for (let i = 0; i < analisedBuffer.length; i++) {
      const analisedLine = analisedBuffer[i];
      const pattern = new RegExp(`[\\s\\,\\.\\(\\)\\:\\>]${target}[\\s\\,\\.\\(\\)\\:]`);
      const match = analisedLine.match(pattern);
      if (!match) {
        continue;
      }
      referenceColumn = match.index! + 1 + target.length;
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
            return resolve(method.getVariableReturn());
          } else {
            return reject();
          }
        }).catch(() => reject());
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
                  .catch(() => reject());
              }
            }).catch(() => reject());
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
          this.extractMethodCompletionsFromBuffer(buffer)
            .then((results) => resolve(results))
            .catch(() => reject());
        })
        .catch(() => reject());
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
  private extractMethodCompletionsFromBuffer(buffer: string): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      const methodsCompletions: CompletionItem[] = [];
      const methodsPromise = new Array();
      new Scan(buffer).scan(/^\s+METHOD-ID\.\s+([\w]+)[\s\,\.]+.*/gim, (iterator: any) => {
        methodsPromise.push(CobolMethod.parseLines(iterator.row, iterator.column, BufferSplitter.split(buffer)));
      })
      Q.allSettled(methodsPromise).then((results) => {
        const methods: CobolMethod[] = [];
        results.forEach((result) => {
          if (result.state === "fulfilled" && result.value) {
            const method = <CobolMethod>result.value;
            if (!method.isPrivate()) {
              methods.push(method);
            }
          }
        });
        methods.forEach((method) => {
          methodsCompletions.push(this.buildMethodCompletion(method));
        });
        resolve(methodsCompletions);
      }).catch(() => reject());
    });
  }

  /**
   * Build the CompletionItem instance for the given method.
   */
  private buildMethodCompletion(method: CobolMethod): CompletionItem {
    const label = method.getName();
    const documentation = method.getDocumentation().asMarkdown()
    let text = this.buildMethodCompletionText(method);
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