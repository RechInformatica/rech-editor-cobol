import { RechPosition } from "../../commons/rechposition";
import { VariableUtils } from "../../commons/VariableUtils";
import { CobolDocParser } from "../../cobol/rechdoc/CobolDocParser";

/**
 * Class representing a Cobol variable
 */
export class CobolVariable {
    /* Level representing a constant */
    public static CONSTANT_LEVEL: number = 78;
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
    private children: CobolVariable[] | undefined;
    /** Parent variable */
    private parent: CobolVariable | undefined;
    /** Declaration position */
    private declarationPosition: RechPosition | undefined;
    /** Comment of variable */
    private comment: string[] | undefined

    private constructor(level: number, name: string, picture: string, type: Type, display: boolean, allowNegative: boolean, raw: string, redefines: boolean) {
        this.level = level;
        this.name = name;
        this.picture = picture;
        this.type = type;
        this.display = display;
        this.allowNegative = allowNegative;
        this.raw = raw;
        this.redefines = redefines;
    }

    /**
     * Creates a CobolVariable instance parsing the specified line
     */
    public static parseLine(line: string): CobolVariable {
        let splitted = CobolVariable.splitVariableInfo(line);
        let level = Number.parseInt(splitted[0]);
        let name = splitted[1].replace(".", "");
        let redefines = line.toLowerCase().includes(" redefines ");
        let picture = CobolVariable.extractPicture(splitted);
        if (picture === "") {
            return new CobolVariable(level, name, "", Type.Alphanumeric, true, false, line, redefines);
        } else {
            let type = CobolVariable.detectType(picture.toUpperCase());
            let display = CobolVariable.isDisplay(picture.toUpperCase());
            let allowNegative = CobolVariable.allowNegative(picture.toUpperCase());
            return new CobolVariable(level, name, picture, type, display, allowNegative, line, redefines);
        }
    }

    /**
     * Parse the source and defines the children of the specidied variable
     *
     * @param variable
     * @param line
     * @param lines
     * @param level
     */
    public static parseAndSetChildren(variable: CobolVariable, line: number, lines: string[]) {
        let level = variable.getLevel();
        let result: CobolVariable[] = [];
        let firstChildrenLevel = 0;
        for (let index = line + 1; index < lines.length; index++) {
            let currentLine = lines[index];
            let match = /^\s+\d\d\s+(?:[\w\-]+)?(?:\(.*\))?([\w\-]+)(\s+|\.).*/g.exec(currentLine);
            if (match) {
                let splitted = CobolVariable.splitVariableInfo(currentLine);
                let currentLevel = Number.parseInt(splitted[0]);
                if (currentLevel > level &&
                    !CobolVariable.isEspecialVariableType(splitted[0])) {
                    let children = CobolVariable.parseLine(currentLine);
                    children = CobolVariable.parseAndSetChildren(children, index, lines);
                    children = CobolVariable.parserAndSetComment(children, index, lines);
                    let startDeclarationColumn = currentLine.length - currentLine.trimLeft().length
                    children.setDeclarationPosition(new RechPosition(index, startDeclarationColumn))
                    if (firstChildrenLevel == 0) {
                        firstChildrenLevel = children.getLevel();
                    } else {
                        if (children.getLevel() != firstChildrenLevel) {
                            continue
                        }
                    }
                    result.push(children);
                } else {
                    break;
                }
            }
            if (/^.*(section|division)[\.\,]?\s*$/.test(currentLine)) {
                break;
            }
        }
        variable.setChildren(result);
        return variable;
    }

    /**
     * Parser the lines and set the variable comments
     *
     * @param variable
     * @param line
     * @param lines
     */
    public static parserAndSetComment(variable: CobolVariable, line: number, lines: string[]) {
        let docArray = VariableUtils.findVariableDocArray(lines, line);
        let doc = new CobolDocParser().parseCobolDoc(docArray);
        variable.setComment(doc.comment);
        return variable;
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
     * Returns true if the variable represents a group item (it's name that ends with dot)
     *
     * @param name variable name
     */
    private static isGroupItem(name: string) {
        return name.endsWith(".");
    }

    /**
     * Split parent variable information into an array
     *
     * @param parentVariable parent variable line text
     */
    private static splitVariableInfo(parentVariable: string): string[] {
        let parentVariableLineText = this.removeDuplicateWhitespaces(parentVariable);
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
            if (splitted[i].toUpperCase() === "PIC") {
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
        if (CobolVariable.isAlphanumeric(picture)) {
            return Type.Alphanumeric;
        }
        if (CobolVariable.isDecimal(picture)) {
            return Type.Decimal;
        }
        return Type.Integer;
    }

    /**
     * Returns true if the picture represents an alphanumeric variable
     *
     * @param picture variable picture
     */
    private static isAlphanumeric(picture: string): boolean {
        return picture.includes("X") || picture.includes("/");
    }

    /**
     * Returns true if the picture represents a decimal variable
     *
     * @param picture variable picture
     */
    private static isDecimal(picture: string): boolean {
        return picture.includes(",") || picture.includes("V");
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
        return /.*comp.*/.test(picture);
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
        let expandedPicture = this.expandPricture(picture);
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
                    let fim = picture.indexOf(")", i + 1)
                    let firstChar = picture.charAt(i);
                    let sSize = picture.substr(i + 2, fim - i - 2);
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
        let occurs = /.*occurs\s+(\d+)\s+times.*/.exec(this.raw);
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

}

export enum Type {
    Integer,
    Decimal,
    Alphanumeric
}