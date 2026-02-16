import { CompletionItemKind, CompletionItem, InsertTextFormat, TextEdit } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CobolDeclarationFinder } from "../declaration/CobolDeclarationFinder";
import { ParserCobol } from "../../cobol/parsercobol";
import { CompletionUtils } from "../commons/CompletionUtils";
import { RechPosition } from "../../commons/rechposition";
import { File } from "../../commons/file";
import { BufferSplitter } from "rech-ts-commons";
import { FindParameters } from "../declaration/FindInterface";

/**
 * Class to generate LSP Completion Items for 'when' clause
 */
export class WhenCompletion implements CompletionInterface {

    /** uri of file */
    private uri: string | undefined;

    constructor(uri?: string) {
        this.uri = uri;
    }

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            if (!this.isFirstWhen(line, lines)) {
                resolve([]);
                return;
            }
            const currentLine = lines[line];
            const variable = this.getVariable(currentLine);
            if (!variable) {
                resolve([]);
                return;
            }
            this.buildCompletionItem(variable, line, column, lines).then((completionItem) => {
                resolve(completionItem);
            }).catch(() => {
                resolve([]);
            });
            return;
        });
    }

    /**
     * Returns if this when is the first when of the evaluate
     *
     * @param line
     * @param lines
     */
    private isFirstWhen(line: number, lines: string[]): boolean {
        let evaluateLine = 0;
        for (let i = line - 1; i > 0; i--) {
            if (lines[i].trim().toLowerCase().startsWith("evaluate ")) {
                evaluateLine = i;
                break;
            }
            if (lines[i].trim().toLowerCase().startsWith("when ")) {
                return false;
            }
        }
        if (evaluateLine == 0) {
            return false;
        }
        let firstWhen = false;
        for (let i = evaluateLine; i < lines.length; i++) {
            if (lines[i].trim().toLowerCase().startsWith("when ")) {
                if (!firstWhen) {
                    firstWhen = true
                } else {
                    return false;
                }
            }
            if (lines[i].trim().toLowerCase().startsWith("end-evaluate")) {
                break;
            }
        }
        return true;
    }

    /**
     * Returns the variable of the when
     *
     * @param currentLine
     */
    private getVariable(currentLine: string) {
        const match = /\s+when ([a-zA-Z0-9-]+)/gi.exec(currentLine);
        if (match) {
            return match[1]
        }
        return undefined;
    }

    /**
     * Build the CompletionItem
     *
     * @param variable
     * @param currentLine
     * @param lines
     */
    private buildCompletionItem(variable: string, currentLine: number, currentColumn: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve, reject) => {
            this.getVariables88(variable, currentLine, currentColumn, lines).then((variables88) => {
                const currentLineText = lines[currentLine];
                const whenStartColumn = CompletionUtils.countSpacesAtBeginning(currentLineText) + 1;
                const textEdit = this.build88WhensTextEdit(variable, variables88, whenStartColumn, currentLine);
                resolve([{
                    label: 'Complete EVALUATE with the other 88 variables',
                    detail: 'Complete EVALUATE with the other 88 variables of the same group',
                    textEdit: {
                        range: {
                            start: {
                                line: currentLine,
                                character: 0
                            },
                            end: {
                                line: currentLine,
                                character: 0
                            }
                        },
                        newText: CompletionUtils.fillSpacesBetween(1, whenStartColumn) + "when " + variable
                    },
                    additionalTextEdits: [textEdit],
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: lines[currentLine],
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]);
            }).catch((e) => {
                reject(e);
            });
        })
    }

    /**
     * Build the whens terms test and returns a TextEdit
     *
     * @param variable
     * @param variables88
     * @param currentLine
     * @param lines
     */
    private build88WhensTextEdit(variable: string, variables88: string[], whenStartColumn: number, currentLine: number): TextEdit {
        let text = "";
        variables88.forEach((v) => {
            if (v != variable) {
                text = text.concat(CompletionUtils.fillSpacesBetween(1, whenStartColumn) + "when " + v + "\n");
            }
        });
        return {
            range: {
                start: {
                    line: currentLine + 1,
                    character: 0
                },
                end: {
                    line: currentLine + 1,
                    character: 0
                }
            },
            newText: text
        }

    }

    /**
     * Returns the 88 levels of the parent variable
     *
     * @param variable
     * @param lines
     */
    private getVariables88(variable: string, line: number, column: number, lines: string[]): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const result: string[] = [];
            this.getLineOfParentDeclaration(variable, line, column, lines).then((parentLineResult) => {
                let parentPosition: RechPosition;
                let parentFileLines: string[];
                let declarationLine: string;
                [parentPosition, parentFileLines, declarationLine] = parentLineResult;
                for (let i = parentPosition.line + 1; i < parentFileLines.length; i++) {
                    const currentLine = parentFileLines[i];
                    if (this.isCommentary(currentLine)) {
                        continue;
                    }
                    if (this.is88LevelDeclaration(currentLine)) {
                        result.push(this.resolveReplacing(variable, currentLine, declarationLine));
                    } else {
                        break;
                    }
                }
                resolve(result);
            }).catch((e) => {
                reject(e);
            })
        });
    }

    /**
     * Resolve replacig of variable
     *
     * @param variable
     * @param lineText
     * @param declarationLine
     */
    private resolveReplacing(variable: string, lineText: string, declarationLine: string): string {
        const replacing = this.hasReplacing(declarationLine);
        if (replacing) {
            const prefix = replacing[1];
            const replacingToken = replacing[2];
            const name = replacing[3];
            let regex;
            if (prefix) {
                regex = prefix + "(.*)" + name;
            } else {
                regex = "(.*)" + name;
            }
            const variableParts = new RegExp(regex, "gi").exec(variable);
            lineText = lineText.replace(replacingToken, variableParts![1]);
        }
        return ParserCobol.getDeclaracaoVariavel(lineText)!
    }

    /**
     * Find the declaration of the variable and returns your parent variable declaration position
     *
     * @param variable
     * @param lines
     */
    private getLineOfParentDeclaration(variable: string, line: number, column: number, lines: string[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!this.uri) {
                reject();
            }
            const findParams: FindParameters = {
                term: variable,
                uri: this.uri!,
                lineIndex: line,
                columnIndex: column
             };
            const finder = new CobolDeclarationFinder(lines.join("\n"));
            finder.findDeclaration(findParams).then((position) => {
                let parentFileLines = lines;
                if (position.file) {
                    parentFileLines = BufferSplitter.split(new File(position.file).loadBufferSync("latin1"));
                }
                const declarationLine = parentFileLines[position.line];
                for (let i = position.line; i > 0; i--) {
                    const currentLine = parentFileLines[i];
                    if (ParserCobol.getDeclaracaoVariavelIgnoreReplace(currentLine)) {
                        if (!this.is88LevelDeclaration(currentLine)) {
                            return resolve([new RechPosition(i, 0, position.file), parentFileLines, declarationLine]);
                        }
                    }
                }
                return reject();
            }).catch((e) => {
                return reject(e)
            });
        });
    }

    /**
     * Returns true if the line is a variable level 88
     *
     * @param line
     */
    private is88LevelDeclaration(line: string) {
        return line.trim().startsWith("88")
    }

    /**
     * Returns true if the line is a commentary
     *
     * @param line
     */
    private isCommentary(line: string) {
        return line.trim().startsWith("*>")
    }

    /**
     * Returns the start part of the variable if it has replacing, else returns undefined
     *
     * @param line
     */
    private hasReplacing(line: string) {
        return /^ +88\s([A-Za-z0-9-]+)?(\(.*\))([A-Za-z0-9-]+)/.exec(line);
    }
}
