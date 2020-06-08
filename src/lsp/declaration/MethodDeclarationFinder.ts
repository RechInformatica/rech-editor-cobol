import { CobolMethod } from "../completion/CobolMethod";
import { ParserCobol } from "../../cobol/parsercobol";
import { File } from "../../commons/file";
import { Path } from "../../commons/path";
import { RechPosition } from "../../commons/rechposition";
import { Scan, BufferSplitter } from "rech-ts-commons";
import { FindInterface, FindParameters } from "./FindInterface";
import { PackageFinder } from "./PackageFinder";
import { FileUtils } from "../../commons/FileUtils";
import { MethodChainResolver } from "./MethodChainResolver";
import { MethodCallUtils } from "./MethodCallUtils";

const SELF_INSTANCE_NAME = "self"

export class MethodDeclarationFinder implements FindInterface {

  private cachedSources: Map<string, string>;
  private parser: ParserCobol;

  constructor(private splittedLines: string[]) {
    this.cachedSources = new Map();
    this.parser = new ParserCobol();
  }

  public isMethodCall(lineText: string, column: number): boolean {
    return MethodCallUtils.isMethodCall(lineText, column);
  }

  findDeclaration(params: FindParameters): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      const reversedChain = this.extractReversedChain(params.lineIndex, params.columnIndex);
      if (this.isSelfInstance(reversedChain)) {
        //
        // On this situation the method is declared on the current class.
        //
        // Then, we can look for it's declaration on the current buffer and don't need to
        // load different files.
        //
        this.findMethodDeclaration(params.term, this.splittedLines.join("\n"))
          .then((method) => {
            const position = this.createPositionFromMethod(method);
            return resolve(position);
          }).catch(() => reject());
        return;
      }
      //
      // The method is being called on a differente class.
      //
      // So, we need to find the path of this class to load it and then
      // look for the declaration on the loaded buffer.
      //
      this.resolveChainTypes(reversedChain, params, this.splittedLines).then((chain) => {
        //
        // After the chain is resolved, we get the path of the class where
        // the method is located
        //
        const lastChainPosition = chain.length - 1;
        const lastChainElement = chain[lastChainPosition];
        const path = new Path(lastChainElement);
        const fullPath = path.fullPath();
        const fullPathVsCode = path.fullPathVscode();
        //
        // Loads the the content of the specified file
        //
        FileUtils.read(fullPath).then((buffer) => {
          //
          // Finally, since the buffer of the class is loaded, we can
          // look for the method declaration on this class
          //
          this.findMethodDeclaration(params.term, buffer).then((method) => {
            const position = this.createPositionFromMethod(method, fullPathVsCode);
            return resolve(position);
          }).catch(() => reject());
        }).catch(() => reject());
      }).catch(() => reject());
    });
  }

  private extractReversedChain(lineIndex: number, columnIndex: number) {
    return new MethodChainResolver(this.splittedLines)
      .resolveFullChain(lineIndex, columnIndex)
      .slice(1)
      .reverse();
  }

  private isSelfInstance(originalChain: string[]): boolean {
    return originalChain[0] === SELF_INSTANCE_NAME;
  }

  private createPositionFromMethod(method: CobolMethod, file?: string): RechPosition {
    const line = method.getLineFromDeclaration();
    const column = method.getColumnFromDeclaration();
    const position = new RechPosition(line, column, file);
    return position;
  }

  private resolveChainTypes(reversedChain: string[], params: FindParameters, splittedLines: string[]): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const newChain: string[] = [];
      const targetClass = reversedChain[0];
      const targetMethod = reversedChain.length > 1 ? reversedChain[1] : undefined
      const classFindParams: FindParameters = { term: targetClass, lineIndex: params.lineIndex, columnIndex: 0, uri: params.uri };
      const packageFinder = new PackageFinder(splittedLines);
      //
      // Looks for the class declaration, which maps the class alias with the real file name.
      //
      // We need the real file name to keep looking for declarations.
      // We can't use the class alias because, as the word says, it's just an alias and doesn't represent
      // the real filename on filesystem.
      //
      packageFinder.findClassDeclaration(classFindParams).then((classDeclaration) => {
        //
        // Since the alias is resolved and we have the class declaration,
        // we have access to it's real filename.
        //
        // The declaration is like:
        //     CLASS   <alias>   as "<real-name>"
        //
        // This method extracts the "real-name" from the declaration
        //
        packageFinder.findClassFileUri(classDeclaration, params.lineIndex, 0, params.uri).then((classUri) => {
          newChain[0] = classUri;
          if (!targetMethod) {
            return resolve(newChain);
          }
          const cachedBuffer = this.cachedSources.get(classUri);
          if (cachedBuffer) {
            this.findMethodAndReturnChain(targetMethod, newChain.concat(reversedChain.slice(newChain.length)), cachedBuffer, classUri, targetClass)
              .then((chain) => {
                const chainTypes = [newChain[0]].concat(chain);
                resolve(chainTypes);
              }).catch(() => reject());
            return;
          }
          FileUtils.read(classUri).then((buffer) => {
            this.cachedSources.set(classUri, buffer);
            this.findMethodAndReturnChain(targetMethod, newChain.concat(reversedChain.slice(newChain.length)), buffer, classUri, targetClass)
              .then((chain) => {
                const chainTypes = [newChain[0]].concat(chain);
                resolve(chainTypes);
              }).catch(() => reject());
          }).catch(() => reject());
        }).catch(() => reject());
      }).catch(() => reject());
    });
  }

  private findMethodAndReturnChain(targetMethod: string, newChain: string[], buffer: string, classPackage: string, classAlias: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const findParams: FindParameters = { lineIndex: 0, columnIndex: 0, term: '', uri: classPackage };
      if (this.isConstructor((targetMethod))) {
        newChain[1] = classAlias;
        this.resolveChainTypes(newChain.slice(1), findParams, BufferSplitter.split(buffer))
          .then((chain) => resolve(new Array(newChain[0]).concat(chain)))
          .catch(() => reject());
        return;
      }
      this.findMethodDeclaration(targetMethod, buffer).then((method) => {
        const returnType = method.getVariableReturn();
        if (returnType) {
          newChain[1] = returnType.getName();
          this.resolveChainTypes(newChain.slice(1), findParams, BufferSplitter.split(buffer))
            .then((chain) => resolve(new Array(newChain[0]).concat(chain)))
            .catch(() => reject());
        } else {
          return reject();
        }
      }).catch(() => reject());
    })
  }

  private isConstructor(targetMethod: string): boolean {
    return targetMethod === CobolMethod.CONSTRUCTOR_METHOD_NAME;
  }

  private findMethodDeclaration(methodName: string, buffer: string): Promise<CobolMethod> {
    return new Promise((resolve, reject) => {
      let foundAny = false;
      new Scan(buffer).scan(new RegExp(`\\\s${methodName}[\\.\\,\\\s]`, "g"), (iterator: any) => {
        if (this.parser.getDeclaracaoMethod(iterator.lineContent)) {
          foundAny = true;
          CobolMethod.parseLines(iterator.row, iterator.column + 1, BufferSplitter.split(buffer))
            .then((method) => resolve(method))
            .catch(() => reject());
        }
      })
      if (!foundAny) {
        return reject();
      }
    });
  }

}

