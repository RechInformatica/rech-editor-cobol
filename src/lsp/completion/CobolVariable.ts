import { RechPosition } from "../../commons/rechposition";
import { VariableUtils } from "../../commons/VariableUtils";
import { CobolDocParser } from "../../cobol/rechdoc/CobolDocParser";

/**
 * Class representing a Cobol variable
 */
export class CobolVariable {
    /* Level representing a constant */
    public static CONSTANT_LEVEL: number = 78;
    /* Level representing a variable without children */
    public static CONSTANT_WITHOUT_CHILDREN: number = 77;
    /* Level representing a 'enum' */
    public static ENUM_LEVEL: number = 88;
    /* Variable level */
    private level: number;
    /* Variable name */
    private name: string;
    /* Variable picture */
    private picture: string;
    /* Variable type */
    private type: Type;
    /* Variable is display */
    private display: boolean;
    /* Variable allows negative values */
    private allowNegative: boolean;
    /* Raw variable declaration from source code */
    private raw: string;
    /** Variable is redefines */
    private redefines: boolean;
    /** Children of variable */
    private children: CobolVariable[];
    /** Parent variable */
    private parent: CobolVariable | undefined;
    /** Variable scope */
    private scope: string | undefined;
    /** Variable section */
    private section: "working-storage" | "linkage" | "file" | undefined;
    /** Declaration position */
    private declarationPosition: RechPosition;
    /** Comment of variable */
    private comment: string[]
    /** Method return */
    private methodReturn: boolean | undefined;
    /** Represents a dummy variable */
    private dummy: boolean | undefined;

    private constructor(level: number,
                        name: string,
                        picture: string,
                        type: Type,
                        display: boolean,
                        allowNegative: boolean,
                        raw: string,
                        redefines: boolean,
                        comment: string[],
                        children: CobolVariable[],
                        declarationPosition: RechPosition,
                        dummy: boolean,
                        scope?: string,
                        section?: "working-storage" | "linkage" | "file" | undefined,
                        methodReturn?: boolean) {
        this.level = level;
        this.name = name;
        this.picture = picture;
        this.type = type;
        this.display = display;
        this.allowNegative = allowNegative;
        this.raw = raw;
        this.redefines = redefines;
        this.comment = comment;
        this.children = children;
        this.declarationPosition = declarationPosition;
        this.dummy = dummy;
        this.scope = scope;
        this.section = section;
        this.methodReturn = methodReturn;
    }

    /**
     * Return a dummy Cobol Variable
     *
     * @param name
     */
    public static dummyCobolVariable(name: string) {
        return new CobolVariable(0, name, "", Type.Alphanumeric, false, false, "", false, [""], [], new RechPosition(1, 1), true);
    }

    /**
     * Creates a CobolVariable instance parsing the lines
     *
     * @param lineNumber
     * @param buffer
     * @param special
     */
    public static parseLines(lineNumber: number, buffer: string[], special?:{noChildren?: boolean, noScope?: boolean, noSection?: boolean, ignoreMethodReturn?: boolean, noComment?: boolean}): CobolVariable {
        const line = buffer[lineNumber];
        const splitted = CobolVariable.splitVariableInfo(line);
        const level = Number.parseInt(splitted[0]);
        const name = splitted[1].replace(".", "");
        const redefines = line.toLowerCase().includes(" redefines ");
        const picture = CobolVariable.extractPicture(splitted);
        let children = new Array();
        if (!special || !special.noChildren) {
            children = CobolVariable.parseAndGetChildren(level, lineNumber, buffer);
        }
        let comment = [""]
        if (!special || !special.noComment) {
           comment = CobolVariable.parserAndGetComment(lineNumber, buffer);
        }
        const startDeclarationColumn = line.length - line.trimLeft().length
        const declarationPosition = new RechPosition(lineNumber, startDeclarationColumn);
        let section: "working-storage" | "linkage" | "file" | undefined;
        if (!special || !special.noSection) {
            section = VariableUtils.findVariableSection(buffer, lineNumber);
        }
        let scope;
        if (!special || !special.noScope) {
            scope = VariableUtils.findVariableScope(buffer, lineNumber);
        }
        let methodReturn = false;
        if (!special || !special.ignoreMethodReturn) {
            methodReturn = VariableUtils.isMethodReturn(name, buffer, lineNumber);
        }
        if (picture === "") {
            return new CobolVariable(level, name, "", Type.Alphanumeric, true, false, line, redefines, comment, children, declarationPosition, false, scope, section, methodReturn);
        } else {
            const type = CobolVariable.detectType(picture.toUpperCase());
            const display = CobolVariable.isDisplay(picture.toUpperCase());
            const allowNegative = CobolVariable.allowNegative(picture.toUpperCase());
            return new CobolVariable(level, name, picture, type, display, allowNegative, line, redefines, comment, children, declarationPosition, false, scope, section, methodReturn);
        }
    }

    /**
     * Parse the source and returns the children of the specidied variable
     *
     * @param level
     * @param line
     * @param lines
     */
    private static parseAndGetChildren(level: Number, line: number, lines: string[]) {
        const allChildren: CobolVariable[] = [];
        let firstChildrenLevel = 0;
        for (let index = line + 1; index < lines.length; index++) {
            const currentLine = lines[index];
            const match = /^ +\d\d\s+(?:[\w\-]+)?(?:\(.*\))?([\w\-]+)(\s+|\.).*/g.exec(currentLine);
            if (match) {
                const splitted = CobolVariable.splitVariableInfo(currentLine);
                const currentLevel = Number.parseInt(splitted[0]);
                if (currentLevel > level &&
                    !CobolVariable.isEspecialVariableType(splitted[0])) {
                    const children = CobolVariable.parseLines(index, lines);
                    if (firstChildrenLevel == 0) {
                        firstChildrenLevel = children.getLevel();
                    } else {
                        if (children.getLevel() != firstChildrenLevel) {
                            continue
                        }
                    }
                    allChildren.push(children);
                } else {
                    break;
                }
                if (/^.*(section|division)[\.\,]?\s*$/i.test(currentLine)) {
                    break;
                }
            }
        }
        return allChildren;
    }

    /**
     * Parser the lines and returns the variable comments
     *
     * @param variable
     * @param line
     * @param lines
     */
    private static parserAndGetComment(line: number, lines: string[]) {
        const docArray = VariableUtils.findVariableDocArray(lines, line);
        const doc = new CobolDocParser().parseCobolDoc(docArray);
        return doc.comment;
    }

    /**
     * Returns true if the level indicates a special variable type
     *
     * @param level
     */
    public static isEspecialVariableType(level: string) {
        return /78|77/.test(level)
    }

    /**
     * Returns true if the level indicates a enum variable type
     *
     * @param level
     */
    public static isEnumVariableType(level: string) {
        return /88/.test(level)
    }

    /**
     * Split parent variable information into an array
     *
     * @param parentVariable parent variable line text
     */
    private static splitVariableInfo(parentVariable: string): string[] {
        const parentVariableLineText = this.removeDuplicateWhitespaces(parentVariable);
        let splittedParent = parentVariableLineText.split(" ");
        if (splittedParent[splittedParent.length - 1] == "") {
            splittedParent = splittedParent.slice(0, splittedParent.length - 2);
        }
        return splittedParent;
    }

    /**
     * Removes duplicate whitespaces from the target string
     *
     * @param currentText
     */
    private static removeDuplicateWhitespaces(currentText: string): string {
        return currentText.trim().replace(/\s+/g, ' ');
    }

    /**
     * Extracts the picture from variable information
     *
     * @param splitted splitted variable information
     */
    private static extractPicture(splitted: string[]): string {
        if (splitted[splitted.length - 1].endsWith(".")) {
            splitted[splitted.length - 1] = splitted[splitted.length - 1].slice(0, -1);
        }
        let foundPicClause = false;
        let picture = "";
        let comp = "";
        for (let i = 0; i < splitted.length; i++) {
            if (splitted[i].toUpperCase() === "PIC" || splitted[i].toUpperCase() === "USAGE") {
                foundPicClause = true;
                continue;
            }
            if (foundPicClause) {
                if (splitted[i].toUpperCase() === "IS" && splitted[i + 1]) {
                    picture = splitted[i + 1];
                } else {
                    picture = splitted[i];
                }
                foundPicClause = false;
            }
            if (splitted[i].toUpperCase().startsWith("COMP")) {
                comp = splitted[i];
            }
        }
        return picture + comp;
    }

    /**
     * Detects the type of the variable
     *
     * @param picture variable picture
     */
    private static detectType(picture: string): Type {
        if (CobolVariable.isInteger(picture)) {
            return Type.Integer;
        }
        if (CobolVariable.isAlphanumeric(picture)) {
            return Type.Alphanumeric;
        }
        if (CobolVariable.isDecimal(picture)) {
            return Type.Decimal;
        }
        return Type.Typedef;
    }

    /**
     * Returns true if the picture represents an alphanumeric variable
     *
     * @param picture variable picture
     */
    private static isAlphanumeric(picture: string): boolean {
        const alfaRegExp: RegExp = /x\(\d+\)/i;
        return alfaRegExp.test(picture) || picture.includes("/");
    }

    /**
     * Returns true if the picture represents a decimal variable
    *
    * @param picture variable picture
    */
   private static isDecimal(picture: string): boolean {
        const decRegExp: RegExp = /^[9s\-z][z9\-\.]*(\(\d+\))*[,v][z9\-\.]*(\(\d+\))*$/i;
        return decRegExp.test(picture);
    }

    /**
     * Returns true if the picture represents a integer variable
    *
    * @param picture variable picture
    */
   private static isInteger(picture: string): boolean {
        const decRegExp: RegExp = /^[s9z]+(\(\d+\))*[9z]*$/i;
        return decRegExp.test(picture);
    }

    /**
     * Returns true if the picture represents an integer display variable
     *
     * @param picture variable picture
     */
    private static isDisplay(picture: string): boolean {
        return picture.includes(".") || picture.includes("Z") || picture.includes("B") || picture.includes("-") || picture.includes(",") || picture.includes("X") || picture.includes("/");
    }

    /**
     * Returns true if the picture represents an integer display variable
     *
     * @param picture variable picture
     */
    private static allowNegative(picture: string): boolean {
        return picture.includes("S") || picture.includes("-");
    }

    /**
     * Returns true if the variable has comp
     *
     * @param picture
     */
    private static hasComp(picture: string): boolean {
        return /.*comp.*/i.test(picture);
    }

    /**
     * Returns the size of variable in bytes
     */
    public getByteSize() {
        let size = this.getBytesFromPicture(this.picture);
        if (this.children) {
            this.children.forEach((children) => {
                size += children.getByteSizeIgnoringRedefines();
            })
        }
        return size * this.getOccurs();
    }

    /**
     * Returns the size of variable in bytes ignoring redefines
     */
    public getByteSizeIgnoringRedefines() {
        if (this.redefines) {
            return 0;
        }
        return this.getByteSize();
    }

    /**
     * Returns the size in bytes from the picture
     *
     * @param picture
     */
    private getBytesFromPicture(picture: string): number {
        if (picture === "") {
            return 0;
        }
        const expandedPicture = this.expandPricture(picture);
        let absolutePicture = expandedPicture.toLowerCase().replace(/comp.*/, "")
        if (!CobolVariable.hasComp(picture)) {
            absolutePicture = absolutePicture.replace("v", "");
            return absolutePicture.length;
        }
        absolutePicture = absolutePicture.replace("v", "");
        absolutePicture = absolutePicture.replace("s", "");
        if (picture.toLowerCase().startsWith("s")) {
            if (absolutePicture.length <= 2) {
                return 1;
            }
            if (absolutePicture.length <= 4) {
                return 2;
            }
            if (absolutePicture.length <= 6) {
                return 3;
            }
            if (absolutePicture.length <= 9) {
                return 4;
            }
            if (absolutePicture.length <= 11) {
                return 5;
            }
            if (absolutePicture.length <= 14) {
                return 6;
            }
            if (absolutePicture.length <= 16) {
                return 7;
            }
            return 8;
        } else {
            if (absolutePicture.length <= 2) {
                return 1;
            }
            if (absolutePicture.length <= 4) {
                return 2;
            }
            if (absolutePicture.length <= 7) {
                return 3;
            }
            if (absolutePicture.length <= 9) {
                return 4;
            }
            if (absolutePicture.length <= 12) {
                return 5;
            }
            if (absolutePicture.length <= 14) {
                return 6;
            }
            if (absolutePicture.length <= 16) {
                return 7;
            }
            return 8;
        }
    }

    /**
     * Expand the picture, exemple 9(03)V99 => 999V99
     *
     * @param picture
     */
    private expandPricture(picture: string): string {
        let expandedPicture = "";
        for (let i = 0; i < picture.length; i++) {
            expandedPicture += picture.charAt(i);
            if (i < picture.length - 1) {
                // If the next char is a "("
                if (picture.charAt(i + 1) == "(") {
                    const fim = picture.indexOf(")", i + 1)
                    const firstChar = picture.charAt(i);
                    const sSize = picture.substr(i + 2, fim - i - 2);
                    let size = 0;
                    if (!Number.isNaN(Number(sSize))) {
                        size = Number.parseInt(sSize);
                    }
                    for (let rep = 0; rep < size - 1; rep++) {
                        expandedPicture += firstChar
                    }
                    i = fim;
                }
            }
        }
        return expandedPicture;
    }

    /**
     * Returns the occurs of variable
     */
    private getOccurs(): number {
        const occurs = /.*occurs\s+(\d+)\s+times.*/i.exec(this.raw);
        if (!occurs) {
            return 1;
        } else {
            return Number.parseInt(occurs[1]);
        }
    }

    /**
     * Returns the variable level
     */
    public getLevel(): number {
        return this.level;
    }

    /**
     * Returns the variable name
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Returns the variable picture
     */
    public getPicture(): string {
        return this.picture;
    }

    /**
     * Returns the variable type
     */
    public getType(): Type {
        return this.type;
    }

    /**
     * Returns if the variable is display
     */
    public isDisplay(): boolean {
        return this.display;
    }

    /**
     * Returns if the variable allows negative values
     */
    public isAllowNegative(): boolean {
        return this.allowNegative;
    }

    /**
     * Returns raw variable declaration from source code
     */
    public getRaw(): string {
        return this.raw;
    }

    /**
     * Returns the parent variable
     */
    public getParent(): CobolVariable | undefined {
        return this.parent;
    }

    /**
     * Defines the parent variable
     */
    public setParent(parent: CobolVariable) {
        this.parent = parent;
    }

    /**
     * Returns a CobolVariable array with the children of variable
     */
    public getChildren(): CobolVariable[] | undefined {
        return this.children;
    }

    /**
     * Defines the children of variable
     */
    public setChildren(children: CobolVariable[]) {
        this.children = children;
    }

    /**
     * Returns the declaration position
     */
    public getDeclarationPosition(): RechPosition | undefined {
        return this.declarationPosition;
    }

    /**
     * Defines the declaration position
     *
     * @param declarationPosition
     */
    public setDeclarationPosition(declarationPosition: RechPosition) {
        this.declarationPosition = declarationPosition;
    }

    /**
     * Returns the comment of variable
     */
    public getComment(): string[] | undefined {
        return this.comment;
    }

    /**
     * Defines the comment of variable
     *
     * @param comment
     */
    public setComment(comment: string[]) {
        this.comment = comment;
    }

    /**
     * Returns the scope of variable
     */
    public getScope(): string | undefined {
        return this.scope;
    }

    /**
     * Defines the scope of variable
     *
     * @param scope
     */
    public setScope(scope: string | undefined) {
        this.scope = scope;
    }

    /**
     * Returns the section of variable
     */
    public getSection(): "working-storage" | "linkage" | "file" | undefined {
        return this.section;
    }

    /**
     * Defines the section of variable
     *
     * @param section
     */
    public setSection(section: "working-storage" | "linkage" | "file" | undefined) {
        this.section = section;
    }

    /**
     * Returns true if the the variable is a method return
     */
    public isMethodReturn(): boolean {
        if (this.methodReturn) {
            return this.methodReturn;
        } else {
            return false;
        }
    }

    /**
     * Returns true if the variable is a object reference
     */
    public getObjectReferenceOf(): string | undefined {
        const match = this.raw.match(/.*\sobject\sreference\s+(.*)\./);
        return match ? match[1] : undefined;
    }

    /**
     * Defines the variable as method return
     *
     * @param methodReturn
     */
    public setMethodReturn(methodReturn: boolean) {
        this.methodReturn = methodReturn;
    }

    /**
     * Returns true if this is a dummy variable
     */
    public isDummy(): boolean {
        return this.dummy ? true : false;
    }

}

export enum Type {
    Integer,
    Decimal,
    Alphanumeric,
    Typedef
}
