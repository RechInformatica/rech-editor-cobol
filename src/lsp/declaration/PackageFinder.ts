import { CobolVariable } from "../completion/CobolVariable";
import { ParserCobol } from "../../cobol/parsercobol";
import { MethodPathUtils } from "./MethodPathUtils";
import { FindParameters } from "./FindInterface";
import { CobolDeclarationFinder } from "./CobolDeclarationFinder";
import { RechPosition } from "../../commons/rechposition";
import { BufferSplitter } from "rech-ts-commons";
import { FileUtils } from "../../commons/FileUtils";

/**
 * Class to find the package where a class is located
 */
export class PackageFinder {

  private parser: ParserCobol;
  private joinedLines: string;

  constructor(private splittedLines: string[]) {
    this.joinedLines = this.splittedLines.join("\n");
    this.parser = new ParserCobol();
  }

  public findClassFileUri(variable: CobolVariable, line: number, column: number, uri: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (variable.isDummy()) {
        return resolve(MethodPathUtils.getFullPath(variable.getName(), uri));
      }
      let clazz = this.parser.getDeclaracaoClasse(variable.getRaw());
      let classPackage = "";
      if (clazz) {
        const raw = variable.getRaw();
        const pack = /(?:^\s+CLASS\s+[\w]+\s+AS\s+(.*)|^\s+[\w]+\s+IS\s+CLASS\s+(.*))/gmi.exec(raw);
        if (!pack) {
          return reject();
        }
        classPackage = pack[1] ? pack[1] : pack[2];
        const fullPath = MethodPathUtils.getFullPath(classPackage.replace(/"/g, ""), uri);
        return resolve(fullPath);
      } else {
        //
        // Since the received information is not a class declaration,
        // it's possibly a object reference which points to a class.
        //
        // For example:
        //   - 77  myVar                 objeft reference MyClass.
        //
        clazz = variable.getObjectReferenceOf();
        if (!clazz) {
          // It's neither a class nor an object declaration.
          // Rejects it!
          return reject();
        }
        //
        // On this situation we only have the variable declaration and not the class
        // declaration itself.
        //
        // For example:
        //   - 77  myVar                 objeft reference MyClass.
        //
        // We will now look for 'MyClass' definition which will take us to somethin like:
        //    - class MyClass             as "package"
        //
        const classFindParams: FindParameters = {
          term: clazz,
          lineIndex: line,
          columnIndex: column,
          uri: uri
        };
        this.findClassDeclaration(classFindParams).then((classCobolVariable) => {
          // Since we only have just found the class declaration, we can recursively call this
          // method to extract the real package name
          this.findClassFileUri(classCobolVariable, line, column, uri)
            .then((classPackage) => resolve(classPackage))
            .catch((e) => reject(e));
        }).catch((e) => reject(e));
      }
    })
  }

  public findClassDeclaration(findParams: FindParameters): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      new CobolDeclarationFinder(this.joinedLines)
        .findDeclaration(findParams)
        .then((position: RechPosition) => {
          const variableConfigs = {
            noChildren: true,
            noComment: true,
            noSection: true,
            noScope: true,
            ignoreMethodReturn: true
          };
          //
          // There is no file associated to the position object.
          //
          // So, it means the declaration is on the buffer of the current file and
          // we don't need to read additional files.
          //
          if (!position.file) {
            const variable = CobolVariable.parseLines(position.line, this.splittedLines, variableConfigs);
            resolve(variable);
          } else {
            // Read the file which have the class content to extract the declaration
            FileUtils
              .read(position.file)
              .then((buffer) => {
                const bufferArray = BufferSplitter.split(buffer);
                const variable = CobolVariable.parseLines(position.line, bufferArray, variableConfigs);
                resolve(variable);
              }).catch((e) => reject(e));
          }
        }).catch((e) => reject(e));
    })
  }

}
