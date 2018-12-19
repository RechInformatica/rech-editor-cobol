import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class representing a Cobol variable
 */
export class CobolVariable {

    /* Variable level */
    private level: number;
    /* Variable name */
    private name: string;
    /* Variable type */
    private type: Type;
    /* Variable is display */
    private display: boolean;
    /* Variable allows negative values */
    private allowNegative: boolean;

    private constructor(level: number, name: string, type: Type, display: boolean, allowNegative: boolean) {
        this.level = level;
        this.name = name;
        this.type = type;
        this.display = display;
        this.allowNegative = allowNegative;
    }

    /**
     * Creates a CobolVariable instance parsing the specified line
     */
    public static parseLine(line: string): CobolVariable {
        let splitted = CobolVariable.splitVariableInfo(line);
        let level = Number.parseInt(splitted[0]);
        let name = splitted[1];
        let picture = CobolVariable.extractPicture(splitted).toUpperCase();
        let type = CobolVariable.detectType(picture);
        let display = CobolVariable.isDisplay(picture);
        let allowNegative = CobolVariable.allowNegative(picture);
        return new CobolVariable(level, name, type, display, allowNegative);
    }

    /**
     * Split parent variable information into an array
     *
     * @param parentVariable parent variable line text
     */
    private static splitVariableInfo(parentVariable: string): string[] {
        let parentVariableLineText = this.removeDuplicateWhitespaces(parentVariable);
        let splittedParent = parentVariableLineText.split(" ");
        return splittedParent;
    }

    /**
     * Removes duplicate whitespaces from the target string
     *
     * @param currentText
     */
    private static removeDuplicateWhitespaces(currentText: string): string {
        return currentText.trimLeft().replace(/\s+/g, ' ');
    }

    /**
     * Extracts the picture from variable information
     *
     * @param splitted splitted variable information
     */
    private static extractPicture(splitted: string[]): string {
        let foundPicClause = false;
        for (let i = 0; i < splitted.length; i++) {
            if (splitted[i].toUpperCase() === "PIC") {
                foundPicClause = true;
                continue;
            }
            if (foundPicClause) {
                if (splitted[i].toUpperCase() === "IS" && splitted[i + 1]) {
                    return splitted[i + 1];
                } else {
                    return splitted[i];
                }
            }
        }
        return "";
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
        return picture.includes("X");
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
        return picture.includes(".") || picture.includes("Z") || picture.includes("B") || picture.includes("-") || picture.includes(",") || picture.includes("X");
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

}

export enum Type {
    Integer,
    Decimal,
    Alphanumeric
}