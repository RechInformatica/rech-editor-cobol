import { RechPosition } from "../../commons/rechposition";
import { CobolDocParser } from "../../cobol/rechdoc/CobolDocParser";
import { CobolVariable, Type } from "./CobolVariable";
import { ParserCobol } from "../../cobol/parsercobol";
import { CobolDoc } from "../../cobol/rechdoc/CobolDoc";
import { CobolDeclarationFinder } from "../declaration/CobolDeclarationFinder";
import Q from "q";
import { BufferSplitter } from "rech-ts-commons";
import { FileUtils } from "../../commons/FileUtils";

/**
 * Class representing a Cobol method
 */
export class CobolMethod {

	/** Token to indentify a method call */
	public static TOKEN_INVOKE_METHOD = ":>";
	/** Constructor method name */
	public static CONSTRUCTOR_METHOD_NAME = "new";
	/** Element indicating the current instance */
	public static SELF_INSTANCE_NAME = "self"

	/* Method name */
	private name: string;
	/** params from method */
	private params: CobolVariable[];
	/** Returns from method */
	private variableReturn: CobolVariable | undefined;
	/** Throws from method */
	private throws: CobolVariable[];
	/** Documentation from method */
	private documentation: CobolDoc;
	/** Line from declaration */
	private lineFromDeclaration: number;
	/** Line from declaration */
	private columnFromDeclaration: number;
	/** Class from Method */
	private classs: string;
	/** Method visibility */
	private visibility: "private" | "protected" | "public";

	private constructor(name: string,
		lineFromDeclaration: number,
		columnFromDeclaration: number,
		classs: string,
		visibility: "private" | "protected" | "public",
		params: CobolVariable[],
		documentation: CobolDoc,
		throws: CobolVariable[],
		variableReturn?: CobolVariable) {
		this.name = name;
		this.lineFromDeclaration = lineFromDeclaration;
		this.columnFromDeclaration = columnFromDeclaration;
		this.visibility = visibility;
		this.classs = classs;
		this.params = params;
		this.documentation = documentation;
		this.throws = throws;
		this.variableReturn = variableReturn;
	}

	/**
	 * Creates a CobolVariable instance parsing the lines
	 *
	 * @param lineNumber
	 * @param buffer
	 * @param special
	 */
	public static parseLines(lineNumber: number, column: number, buffer: string[]): Promise<CobolMethod> {
		return new Promise((resolve, reject) => {
			const classMatch = /\s+class-id.\s+([\w-]+)/.exec(buffer.join("\n"))
			let classs = "";
			if (classMatch) {
				classs = classMatch[1];
			}
			const line = buffer[lineNumber];
			const methodName = new ParserCobol().getDeclaracaoMethod(line);
			if (!methodName) {
				return reject();
			}
			const visibility = CobolMethod.extractVisibility(line);
			let params = CobolMethod.extractParams(lineNumber, buffer);
			params = params.filter((variable) => {
				return variable.getLevel() == 1 || variable.getLevel() == CobolVariable.CONSTANT_WITHOUT_CHILDREN;
			});
			CobolMethod.extractReturn(lineNumber, column, buffer).then((returns) => {
				CobolMethod.extractThrows(lineNumber, column, buffer).then((throws) => {
					const documentation = CobolMethod.extractDocumentation(lineNumber, buffer, params, returns, throws);
					return resolve(new CobolMethod(methodName, lineNumber, column, classs, visibility, params, documentation, throws, returns));
				}).catch((e) => reject(e));
			}).catch((e) => reject(e));
		});
	}

	/**
	 * * Returns the visibility from method
	 *
	 * @param line
	 */
	private static extractVisibility(line: string): "private" | "protected" | "public" {
		const match = /.*(private|protected|public)\s*\./gi.exec(line);
		if (match && match[1]) {
			return <"private" | "protected" | "public">match[1];
		}
		return "public";
	}

	/**
	 * Returns the return from method
	 *
	 * @param lineNumber
	 * @param buffer
	 */
	private static extractReturn(lineNumber: number, column: number, buffer: string[]): Promise<CobolVariable | undefined> {
		return new Promise((resolve, reject) => {
			let noMatch = true;
			for (let i = lineNumber; i < buffer.length; i++) {
				const match = /.*returning\s+([\w-]+)[.,\s]*.*/gi.exec(buffer[i]);
				if (CobolMethod.isEndMethodLine(buffer[i])) {
					break;
				}
				if (!match) {
					continue;
				}
				noMatch = false;
				this.buildCobolVariable(match[1], lineNumber, column, buffer)
					.then((variable) => resolve(variable))
					.catch((e) => reject(e));
				break;
			}
			if (noMatch) {
				return resolve(undefined);
			}
		});
	}

	/**
	 * Returns the throws from method
	 *
	 * @param lineNumber
	 * @param buffer
	 */
	private static extractThrows(lineNumber: number, column: number, buffer: string[]): Promise<CobolVariable[]> {
		return new Promise((resolve, reject) => {
			const promisesFromThrows: Promise<CobolVariable>[] = [];
			const throws: CobolVariable[] = [];
			let terms = [];
			let noMatch = true;
			for (let i = lineNumber; i < buffer.length; i++) {
				const match = /.*raising\s+([\w\-\s]+)[.,\s]*.*/gi.exec(buffer[i]);
				if (CobolMethod.isEndMethodLine(buffer[i])) {
					break;
				}
				if (!match) {
					continue;
				}
				noMatch = false;
				terms = match[1].split(" ");
				terms.forEach((term) => {
					promisesFromThrows.push(this.buildCobolVariable(term, lineNumber, column, buffer));
				});
				Q.allSettled(promisesFromThrows).then((results) => {
					results.forEach((result) => {
						if (result.state == "fulfilled") {
							throws.push(result.value!);
						}
					});
					resolve(throws);
				}).catch((e) => reject(e));
			}
			if (noMatch) {
				return resolve(throws);
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
	private static buildCobolVariable(variable: string, line: number, column: number, lines: string[]): Promise<CobolVariable> {
		return new Promise((resolve, reject) => {
			new CobolDeclarationFinder(lines.join("\n"))
				.findDeclaration({ term: variable, uri: "", lineIndex: line, columnIndex: column })
				.then((position: RechPosition) => {
					if (!position.file) {
						return resolve(CobolVariable.parseLines(position.line, lines, { noChildren: true, noSection: true, noScope: true, ignoreMethodReturn: true }));
					} else {
						FileUtils.read(position.file)
							.then((buffer) => {
								const bufferArray = BufferSplitter.split(buffer);
								return resolve(CobolVariable.parseLines(position.line, bufferArray, { noChildren: true, noSection: true, noScope: true, ignoreMethodReturn: true }));
							}).catch((e) => reject(e));
					}
				}).catch((e) => reject(e));
		})
	}

	/**
	 * Extract the params from method
	 *
	 * @param lineNumber
	 * @param buffer
	 */
	private static extractParams(lineNumber: number, buffer: string[]): CobolVariable[] {
		const params: CobolVariable[] = [];
		let isLinkage = false;
		for (let i = lineNumber; i < buffer.length; i++) {
			if (CobolMethod.isEndMethodLine(buffer[i])) {
				break;
			}
			if (!isLinkage) {
				if (buffer[i].match(/\s+linkage\s+section[\s.,]*/)) {
					isLinkage = true;
				}
			}
			if (isLinkage) {
				if (buffer[i].match(/\s+[\w]+\s+section\s.*/) || buffer[i].match(/\s+[\w]+\s+division\s.*/)) {
					break;
				}
				if (new ParserCobol().getDeclaracaoVariavel(buffer[i])) {
					params.push(CobolVariable.parseLines(i, buffer, { ignoreMethodReturn: true, noChildren: true, noScope: true, noSection: true }));
				}
			}

		}
		return params;
	}

	/**
	 * Extract the documentation from method
	 *
	 * @param lineNumber
	 * @param buffer
	 */
	private static extractDocumentation(lineNumber: number, buffer: string[], params: CobolVariable[], variableReturn: CobolVariable | undefined, throws: CobolVariable[]): CobolDoc {
		let documentation: string[] = [];
		for (let i = lineNumber - 1; i > 0; i--) {
			if (buffer[i].trimLeft().startsWith("*>")) {
				documentation.push(buffer[i]);
			} else {
				break;
			}
		}
		documentation = documentation.reverse()
		const cobolDocParser = new CobolDocParser();
		cobolDocParser.setPreParams(params);
		cobolDocParser.setPreThrows(throws);
		if (variableReturn) {
			cobolDocParser.setPreReturns([variableReturn]);
		}
		cobolDocParser.setToIgnoreElementsInCobolDoc();
		const doc = cobolDocParser.parseCobolDoc(documentation);
		return doc
	}

	/**
	 * Returns true if the linha is a end method declaration
	 *
	 * @param line
	 */
	private static isEndMethodLine(line: string): boolean {
		return /\s+end\s+method[\s.,]*/.test(line);
	}

	/**
	 * Returns the method name
	 */
	public getName(): string {
		return this.name;
	}

	/**
	 * Returns the method params
	 */
	public getParams(): CobolVariable[] {
		return this.params;
	}

	/**
	 * Returns the method throws
	 */
	public getThrows(): CobolVariable[] {
		return this.throws;
	}

	/**
	 * Returns the variable return from method
	 */
	public getVariableReturn(): CobolVariable | undefined {
		if (this.name != CobolMethod.CONSTRUCTOR_METHOD_NAME) {
			return this.variableReturn;
		}
		return CobolVariable.dummyCobolVariable(this.classs);
	}

	/**
	 * Returns the variable return from method
	 */
	public getClass(): CobolVariable | string | undefined {
		if (this.name != CobolMethod.CONSTRUCTOR_METHOD_NAME) {
			return this.variableReturn;
		}
		return this.classs;
	}

	/**
	 * Returns the method documentation
	 */
	public getDocumentation(): CobolDoc {
		return this.documentation;
	}

	/**
	 * Returns the line from the method declaration in yours class source
	 */
	public getLineFromDeclaration(): number {
		return this.lineFromDeclaration;
	}

	/**
	 * Returns the column from the method declaration in yours class source
	 */
	public getColumnFromDeclaration(): number {
		return this.columnFromDeclaration;
	}

	/**
	 * Returns true if the method visibility is private
	 */
	public isPrivate(): boolean {
		return this.visibility == "private";
	}

}
