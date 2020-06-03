import { CobolMethod } from "../completion/CobolMethod";
import { CobolVariable } from "../completion/CobolVariable";
import { ParserCobol } from "../../cobol/parsercobol";
import { File } from "../../commons/file";
import { Path } from "../../commons/path";
import { CobolDeclarationFinder } from "./CobolDeclarationFinder";
import { RechPosition } from "../../commons/rechposition";
import { Scan, BufferSplitter } from "rech-ts-commons";
import { FindInterface, FindParameters } from "./FindInterface";

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
            const reversedChain = this.extractReversedCain(params.lineIndex, params.columnIndex);
            if (this.isSelfInstance(reversedChain)) {
                //
                // On this situation the method is declared on the current class.
                //
                // Then, we can look for it's declaration on the current buffer and don't need to
                // load different files.
                //
                this.findMethodDeclaration(params.term, this.splittedLines.join("\n")).then((method) => {
                    const position = this.createPositionFromMethod(method);
                    return resolve(position);
                }).catch(() => {
                    return reject();
                });
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
                new File(fullPath).loadBuffer().then((buffer) => {
                    //
                    // Finally, since the buffer of the class is loaded, we can
                    // look for the method declaration on this class
                    //
                    this.findMethodDeclaration(params.term, buffer).then((method) => {
                        const position = this.createPositionFromMethod(method, fullPathVsCode);
                        return resolve(position);
                    }).catch(() => {
                        return reject();
                    });
                }).catch(() => {
                    return reject();
                });
            }).catch(() => {
                reject();
            });
        });
    }

    private extractReversedCain(lineIndex: number, columnIndex: number) {
        return new MethodChainResolver(this.splittedLines)
            .getFullChain(lineIndex, columnIndex)
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
            const classFindParams: FindParameters = {
                term: targetClass,
                lineIndex: params.lineIndex,
                columnIndex: 0,
                uri: params.uri
            };
            //
            // Looks for the class declaration, which maps the class alias with the real file name.
            //
            // We need the real file name to keep looking for declarations.
            // We can't use the class alias because, as the word says, it's just an alias and doesn't represent
            // the real filename on filesystem.
            //
            this.findClassDeclaration(classFindParams, splittedLines).then((classDeclaration) => {
                //
                // Since the alias is resolved and we have the class declaration,
                // we have access to it's real filename.
                //
                // The declaration is like:
                //     CLASS   <alias>   as "<real-name>"
                //
                // This method extracts the "real-name" from the declaration
                //
                this.getClassPackage(classDeclaration, params.lineIndex, 0, params.uri, splittedLines).then((classPackage) => {
                    newChain[0] = classPackage;
                    const classFile = new File(classPackage);
                    if (!targetMethod) {
                        return resolve(newChain);
                    }
                    const cachedBuffer = this.cachedSources.get(classPackage);
                    if (cachedBuffer) {
                        this.findMethodAndReturnChain(targetMethod, newChain.concat(reversedChain.slice(newChain.length)), cachedBuffer, classPackage, targetClass).then((chain) => {
                            const chainTypes = [newChain[0]].concat(chain);
                            return resolve(chainTypes);
                        }).catch(() => {
                            return reject();
                        });
                        return;
                    }
                    classFile.loadBuffer().then((buffer) => {
                        this.cachedSources.set(classPackage, buffer);
                        this.findMethodAndReturnChain(targetMethod, newChain.concat(reversedChain.slice(newChain.length)), buffer, classPackage, targetClass).then((chain) => {
                            const chainTypes = [newChain[0]].concat(chain);
                            return resolve(chainTypes);
                        }).catch(() => {
                            return reject();
                        });
                    }).catch(() => {
                        return reject();
                    })
                }).catch(() => {
                    return reject();
                })
            }).catch(() => {
                return reject();
            })
        });
    }

    private findMethodAndReturnChain(targetMethod: string, newChain: string[], buffer: string, classPackage: string, classAlias: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const findParams: FindParameters = {
                lineIndex: 0,
                columnIndex: 0,
                term: '',
                uri: classPackage
            };
            if (this.isConstructor((targetMethod))) {
                newChain[1] = classAlias;
                this.resolveChainTypes(newChain.slice(1), findParams, BufferSplitter.split(buffer)).then((chain) => {
                    return resolve(new Array(newChain[0]).concat(chain));
                }).catch(() => {
                    return reject();
                })
                return;
            }
            this.findMethodDeclaration(targetMethod, buffer).then((method) => {
                const returnType = method.getVariableReturn();
                if (returnType) {
                    newChain[1] = returnType.getName();
                    this.resolveChainTypes(newChain.slice(1), findParams, BufferSplitter.split(buffer)).then((chain) => {
                        return resolve(new Array(newChain[0]).concat(chain));
                    }).catch(() => {
                        return reject();
                    });
                } else {
                    return reject();
                }
            }).catch(() => {
                return reject();
            });
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
                    CobolMethod.parseLines(iterator.row, iterator.column + 1, BufferSplitter.split(buffer)).then((method) => {
                        return resolve(method);
                    }).catch(() => {
                        return reject();
                    })
                }
            })
            if (!foundAny) {
                return reject();
            }
        });
    }

    private getClassPackage(variable: CobolVariable, line: number, column: number, uri: string, lines: string[]): Promise<string> {
        return new Promise((resolve, reject) => {
            let clazz = this.parser.getDeclaracaoClasse(variable.getRaw());
            let classPackage = "";
            if (clazz) {
                const raw = variable.getRaw();
                const pack = /(?:^\s+CLASS\s+[\w]+\s+AS\s+(.*)|^\s+[\w]+\s+IS\s+CLASS\s+(.*))/gmi.exec(raw);
                if (!pack) {
                    return reject();
                }
                classPackage = pack[1] ? pack[1] : pack[2];
                const fullPath = MethodPathUtils.getFullPath(classPackage.replace(/\"/g, ""), uri);
                return resolve(fullPath);
            }
            clazz = variable.getObjectReferenceOf();
            if (!clazz) {
                return reject();
            }
            const classFindParams: FindParameters = {
                term: clazz,
                lineIndex: line,
                columnIndex: column,
                uri: uri
            };
            this.findClassDeclaration(classFindParams, lines).then((classCobolVariable) => {
                this.getClassPackage(classCobolVariable, line, column, uri, lines).then((classPackage) => {
                    return resolve(classPackage);
                }).catch(() => {
                    return reject();
                })
            }).catch(() => {
                return reject();
            });
        })
    }

    private findClassDeclaration(findParams: FindParameters, splittedLines: string[]): Promise<CobolVariable> {
        return new Promise((resolve, reject) => {
            new CobolDeclarationFinder(splittedLines.join("\n"))
                .findDeclaration(findParams.term, findParams.uri, findParams.lineIndex, findParams.columnIndex).then((position: RechPosition) => {
                    const variableConfigs = {
                        noChildren: true,
                        noComment: true,
                        noSection: true,
                        noScope: true,
                        ignoreMethodReturn: true
                    };
                    if (!position.file) {
                        const variable = CobolVariable.parseLines(position.line, this.splittedLines, variableConfigs);
                        return resolve(variable);
                    } else {
                        new File(position.file).loadBuffer().then((buffer) => {
                            const bufferArray = BufferSplitter.split(buffer);
                            const variable = CobolVariable.parseLines(position.line, bufferArray, variableConfigs);
                            return resolve(variable);
                        }).catch(() => {
                            return reject();
                        })
                    }
                }).catch(() => {
                    return reject();
                });
        })
    }

}

class MethodChainResolver {

    constructor(private splittedLines: string[]) {
    }

    public getFullChain(line: number, column: number): string[] {
        let chain = [];
        const currentLine = this.splittedLines[line].substr(0, column).trim().replace(/\(.*?\)/g, "");
        const partsFromLine = currentLine.match(/[\w\:\>\-\_]+/g);
        if (!partsFromLine) {
            return [];
        }
        const currentCommand = partsFromLine[partsFromLine.length - 1];
        const parts = currentCommand.split(CobolMethod.TOKEN_INVOKE_METHOD);
        for (let i = parts.length - 1; i >= 0; i--) {
            if (parts[i].includes(" ")) {
                break;
            }
            if (parts[i] == "" && currentLine.startsWith(CobolMethod.TOKEN_INVOKE_METHOD)) {
                continue;
            }
            chain.push(parts[i])
        }
        if (currentCommand.startsWith(CobolMethod.TOKEN_INVOKE_METHOD)) {
            chain = chain.concat(this.getFullChain(line - 1, 120));
        }
        return chain;
    }

}

class MethodCallUtils {

    public static isMethodCall(lineText: string, column: number): boolean {
        for (let i = column - 1; i > 0; i--) {
            const character = lineText.charAt(i);
            if (/[^\w\-]/.test(character)) {
                for (let j = CobolMethod.TOKEN_INVOKE_METHOD.length - 1; j >= 0; j--) {
                    const tokenPart = CobolMethod.TOKEN_INVOKE_METHOD.charAt(j);
                    const index = i - CobolMethod.TOKEN_INVOKE_METHOD.length + j + 1;
                    if (lineText.charAt(index) != tokenPart) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
}


/**
 * Utility class with methods to build path to COBOL classes
 */
class MethodPathUtils {

    public static getFullPath(clazz: string, uri: string) {
        const path = this.getFullPathWithExt(clazz, uri, ".cbl");
        if (path !== "") {
            return path;
        }
        return this.getFullPathWithExt(clazz, uri, ".cob");
    }

    private static getFullPathWithExt(clazz: string, uri: string, extension: string) {
        let path = new Path(new Path(uri).fullPathWin()).directory() + clazz + extension;
        if (new File(path).exists()) {
            return path;
        }
        path = "F:\\Fontes\\" + clazz + extension;
        if (new File(path).exists()) {
            return path;
        }
        return "";
    }


}