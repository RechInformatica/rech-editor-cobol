import { Path } from '../../commons/path';
import { File } from '../../commons/file';
import { Scan } from '../../commons/Scan';
import { ParserCobol } from '../../cobol/parsercobol'
import { RechPosition } from '../../commons/rechposition'
import { ExpandedSourceManager } from '../../cobol/ExpandedSourceManager';
import { CobolMethod } from '../completion/CobolMethod';
import { CobolVariable } from '../completion/CobolVariable';

/** Minimum word size */
const MIN_WORD_SIZE = 3;

/**
 * Class to find Cobol declarations
 */
export class CobolDeclarationFinder {

  /** Editor text*/
  private text: string;
  /** Chache from sources*/
  private cacheSources: Map<string, string>;

  /**
   * Constructor of Find
   *
   * @param editor
   */
  constructor(text: string) {
    this.text = text;
    this.cacheSources = new Map()
  }

  /**
   * Find the declaration of the term
   *
   * @param term Term to find
   */
  public findDeclaration(term: string, uri: string, referenceLine: number, referenceColumn: number): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      // If the word is too small
      if (term.length < MIN_WORD_SIZE) {
        reject();
        return;
      }
      // Busca declaração no próprio documento
      this.findDeclarationInBuffer(term, this.text, referenceLine, referenceColumn, uri).then((result) => {
        if (result) {
          return resolve(result);
        }
        this.findDeclarationWithPreproc(term, uri, referenceLine, true).then((result) => {
          return resolve(result)
        }).catch(() => {
          return reject();
        });
      }).catch(() => {
        return reject();
      });
    });
  }

  /**
   * Find the declaration of term with preprocessed source
   *
   * @param term term to find
   * @param uri uri of the file
   * @param expandSource can expand the source?
   */
  private findDeclarationWithPreproc(term: string, uri: string, referenceLine: number, expandSource: boolean): Promise<RechPosition> {
    return new Promise((resolve, reject) => {
      ExpandedSourceManager.getExpandedSource(uri).then((expandedSource) => {
        const path = new Path(uri);
        this.findDeclarationInPreprocessedSource(term, path, expandedSource, referenceLine).then((result) => {
          if (result) {
            return resolve(result);
          } else {
            if (expandSource) {
              new ExpandedSourceManager(uri).expandSource().then(()=>{}).catch(() => {});
              this.findDeclarationWithPreproc(term, uri, referenceLine, false).then((result) => {
                return resolve(result);
              }).catch(() => {
                return reject();
              })
            } else {
              return reject();
            }
          }
        }).catch(() => {
          return reject();
        });
      }).catch(() => {
        return reject();
      })
    });
  }

  /**
   * Find the declaration in atual buffer
   *
   * @param term
   * @param buffer
   */
  private findDeclarationInBuffer(term: string, buffer: string, referenceLine: number, referenceColumn: number, uri: string): Promise<RechPosition | undefined> {
    return new Promise((resolve, reject) => {
      const parser = new ParserCobol();
      let result = undefined;
      if (this.isAMethodCall(term, referenceLine, referenceColumn, buffer.split("\n"))) {
        this.findDeclarationFromMethod(term, buffer, referenceLine, referenceColumn, uri).then((result) => {
          return resolve(result);
        }).catch(() => {
          return reject();
        });
      } else {
        new Scan(buffer).reverseScan(new RegExp(term, 'gi'), referenceLine, (iterator: any) => {
          if (parser.isDeclaration(term, iterator.lineContent)) {
            result = new RechPosition(iterator.row, iterator.column);
            iterator.stop();
          }
        });
        return resolve(result);
      }
    })
  }

  /**
   * Returns true if the term is a method call
   *
   * @param term
   * @param lineContent
   */
  private isAMethodCall(_term: string, line: number, column: number, buffer: string[]): boolean {
    const currentLine = buffer[line];
    for (let i = column - 1; i > 0; i--) {
    const character = currentLine.charAt(i);
      if (/[^\w\-]/.test(character)) {
        for (let j = CobolMethod.TOKEN_INVOKE_METHOD.length - 1; j >= 0; j--) {
          const tokenPart = CobolMethod.TOKEN_INVOKE_METHOD.charAt(j);
          const index = i - CobolMethod.TOKEN_INVOKE_METHOD.length + j + 1;
          if (currentLine.charAt(index) != tokenPart) {
            return false;
          }
        }
        return true;
      }
    }
    return false;
  }

  /**
   * Find the method declaration
   *
   * @param term
   * @param buffer
   * @param referenceLine
   * @param referenceColumn
   * @param uri
   */
  private findDeclarationFromMethod(term: string, buffer: string, referenceLine: number, referenceColumn: number, uri: string): Promise<RechPosition | undefined> {
    return new Promise((resolve, reject) => {
      const lines = buffer.split("\n");
      const originalChain = this.getTheFullChain(referenceLine, referenceColumn, lines).slice(1).reverse();
      this.resolveChainTypes(originalChain, referenceLine, referenceColumn, lines, uri).then((chain) => {
        const file = new Path(chain[chain.length - 1]);
        new File(file.fullPath()).loadBuffer().then((buffer) => {
          this.findMethodDeclaration(term, buffer).then((method) => {
            return resolve(new RechPosition(method.getLineFromDeclaration(), method.getColumnFromDeclaration(), file.fullPathVscode()));
          }).catch(() => {
            return reject()
          })
        }).catch( () => {
          return reject()
        });
      }).catch(() => {
        reject();
      })
    });
  }

  /**
   * Resolve the chain types replacing mehtods with yours return class
   *
   * @param line
   * @param column
   * @param lines
   */
  private resolveChainTypes(originalChain: string[], line: number, _column: number, lines: string[], uri: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const newChain: string[] = [];
      const targetClass = originalChain[0];
      let targetMethod: undefined | string = undefined;
      if (originalChain.length > 1) {
        targetMethod = originalChain[1];
      }
      this.buildCobolVariable(targetClass, line, 0, lines, uri).then((variable) => {
        this.getClassPackage(variable, line, 0, lines, uri).then((classPackage) => {
          newChain[0] = classPackage;
          const clasFile = new File(classPackage);
          if (!targetMethod) {
            return resolve(newChain);
          }
          if (this.cacheSources.has(classPackage)) {
            const buffer = this.cacheSources.get(classPackage)!;
            this.findMethodAndReturnChain(targetMethod, newChain.concat(originalChain.slice(newChain.length)), buffer, classPackage, targetClass).then((chain) => {
              return resolve(new Array(newChain[0]).concat(chain));
            }).catch(() => {
              reject();
            });
          } else {
            clasFile.loadBuffer().then((buffer) => {
              this.cacheSources.set(classPackage, buffer);
              this.findMethodAndReturnChain(targetMethod!, newChain.concat(originalChain.slice(newChain.length)), buffer, classPackage, targetClass).then((chain) => {
                return resolve(new Array(newChain[0]).concat(chain));
              }).catch(() => {
                reject();
              });
            }).catch(() => {
              return reject();
            })
          }
        }).catch(() => {
          return reject();
        })
      }).catch(() => {
        return reject();
      })
    });
  }

  /**
   * Find the method in buffer and returns yours resolved type chain
   *
   * @param targetMethod
   * @param newChain
   * @param buffer
   * @param classPackage
   * @param classAlias
   */
  private findMethodAndReturnChain(targetMethod: string, newChain: string[], buffer: string, classPackage: string, classAlias: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (targetMethod == CobolMethod.CONSTRUCTOR_METHOD_NAME) {
        newChain[1] = classAlias;
        this.resolveChainTypes(newChain.slice(1), 0, 0, buffer.split("\n"), classPackage).then((chain) => {
          return resolve(new Array(newChain[0]).concat(chain));
        }).catch(() => {
          return reject();
        })
        return;
      }
      this.findMethodDeclaration(targetMethod, buffer).then((method) => {
        const returnVar = method.getVariableReturn();
        if (returnVar) {
          newChain[1] = returnVar.getName();
          this.resolveChainTypes(newChain.slice(1), 0, 0, buffer.split("\n"), classPackage).then((chain) => {
            return resolve(new Array(newChain[0]).concat(chain));
          }).catch(() => {
            return reject();
          })
        } else {
          return reject();
        }
      }).catch(() => {
        return reject();
      });
    })
  }

  /**
   * Find the method declaration in buffer
   *
   * @param methodName
   * @param buffer
   */
  private findMethodDeclaration(methodName: string, buffer: string): Promise<CobolMethod> {
    return new Promise((resolve, reject) => {
      let findAny = false;
      new Scan(buffer).scan(new RegExp(`\\\s${methodName}[\\.\\,\\\s]`, "g"), (iterator: any) => {
        if (new ParserCobol().getDeclaracaoMethod(iterator.lineContent)) {
          findAny = true;
          CobolMethod.parseLines(iterator.row, iterator.column + 1, buffer.split("\n")).then((method) => {
            return resolve(method);
          }).catch(() => {
            return reject();
          })
        }
      })
      if (!findAny) {
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
      let classs = new ParserCobol().getDeclaracaoClasse(variable.getRaw());
      let classPackage = "";
      if (classs) {
        const raw = variable.getRaw();
        const pack = /(?:^\s+CLASS\s+[\w]+\s+AS\s+(.*)|^\s+[\w]+\s+IS\s+CLASS\s+(.*))/gmi.exec(raw);
        if (!pack) {
          return reject();
        }
        classPackage = pack[1] ? pack[1] : pack[2];
        return resolve(this.getFullPathFromClassSource(classPackage.replace(/\"/g, ""), uri));
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
   * Find the variable declaration and build a CobolVariable
   *
   * @param variable
   * @param line
   * @param lines
   */
  private buildCobolVariable(variable: string, line: number, column: number, lines: string[], uri: string): Promise<CobolVariable> {
    return new Promise((resolve, reject) => {
      new CobolDeclarationFinder(lines.join("\n"))
        .findDeclaration(variable, uri, line, column).then((position: RechPosition) => {
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
   * Returns a fullPath from class file
   *
   * @param classs
   * @param uri
   */
  private getFullPathFromClassSource(classs: string, uri: string) {
    let path = new Path(new Path(uri).fullPathWin()).directory() + classs + ".cbl";
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
   * Returns the full chain from method call
   *
   * @param line
   * @param column
   * @param lines
   */
  private getTheFullChain(line: number, column: number, lines: string[]): string[] {
    let chain = [];
    const currentLine = lines[line].substr(0, column).trim().replace(/\(.*?\)/g, "");
    const partsFromLine = currentLine.match(/[\w\:\>\-\_]+/g);
    if (!partsFromLine) {
      return [];
    }
    const currentCommand = partsFromLine[partsFromLine.length - 1];
    const parts = currentCommand.split(CobolMethod.TOKEN_INVOKE_METHOD);
    for(let i = parts.length - 1; i >= 0 ; i --) {
      if (parts[i].includes(" ")) {
        break;
      }
      if (parts[i] == "" && currentLine.startsWith(CobolMethod.TOKEN_INVOKE_METHOD)) {
        continue;
      }
      chain.push(parts[i])
    }
    if (currentCommand.startsWith(CobolMethod.TOKEN_INVOKE_METHOD)) {
      chain = chain.concat(this.getTheFullChain(line - 1, 120, lines));
    }
    return chain;
  }

  /**
   * Find the declaration in the preprocessed source
   *
   * @param term
   * @param path
   * @param buffer
   */
  private findDeclarationInPreprocessedSource(term: string, path: Path, buffer: string, referenceLine: number): Promise<RechPosition> {
    const parser = new ParserCobol();
    return new Promise((resolve, reject) => {
      let result = undefined;
      let file = path.fileName();
      new Scan(buffer).scan(/\s+\*\>\sOpções:.*/gi, (iterator: any) => {
        const match = /^\s+\*\>\sOpções:\s([A-Za-z0-9\\:]+\.CBL)/gm.exec(iterator.lineContent)
        if (match) {
          file = new Path(match[1]).fileName();
          iterator.stop();
        }
      });
      const linesFromText = this.text.split("\n");
      const line = linesFromText[referenceLine].trim();
      let referenceLineForScan: number;
      new Scan(buffer).scan(new RegExp(`${line}\\s*\\*\\>\\s+\\d+\\s+\\d+$`, 'gi'), (iterator: any) => {
        referenceLineForScan = iterator.row;
      });
      referenceLineForScan = linesFromText.length;
      new Scan(buffer).reverseScan(new RegExp(term, 'gi'), referenceLineForScan, (iterator: any) => {
        if (parser.isDeclaration(term, iterator.lineContent)) {
          const match = <RegExpMatchArray>/.*\*\>\s+\d+\s+(\d+)(?:\s+(.+\....)\s+\(\d+\))?/.exec(iterator.lineContent);
          const line = parseInt(match[1]) - 1;
          const filePositionGroup = 2;
          if (match[filePositionGroup]) {
            file = match[filePositionGroup];
          }
          const column = iterator.column;
          // build the result
          result = new RechPosition(<number>line, <number>column, this.getFullPath(file, path));
          iterator.stop();
        }
      });
      if (result) {
        resolve(<RechPosition>result);
      } else {
        reject();
      }
    });
  }

  /**
   * Return the full path of a file
   */
  private getFullPath(file: string, path: Path): string {
    const preferredDirectory = new Path(path.fullPathWin()).directory().toUpperCase();
    if (new File(preferredDirectory + file).exists()) {
      return preferredDirectory + file;
    }
    return "F:\\SIGER\\DES\\FON\\" + file;
  }


}