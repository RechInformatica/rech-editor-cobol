import { CobolDoc } from "./CobolDoc";
import { DocElement } from "./DocElement";
import { CobolVariable } from "../../lsp/completion/CobolVariable";

/**
 * Class to parse Cobol paragraph and variable documentations
 */
export class CobolDocParser {

    /** Predefined params */
    private preParams: CobolVariable[] = [];
    /** Predefined returns */
    private preReturns: CobolVariable[] = [];
    /** Predefined throws */
    private preThrows: CobolVariable[] = [];
    /** Ignore elements on cobolDoc */
    private ignoreElementsInCobolDoc: boolean = false;

    /**
     * Parses the specified single line documentation
     *
     * @param documentation single line documentation
     */
    public parseSingleLineCobolDoc(documentation: string): CobolDoc {
        return this.parseCobolDoc([documentation]);
    }
    /**
     * Parses the specified documentation
     *
     * @param documentation multi line documentation
     */
    public parseCobolDoc(documentation: string[]): CobolDoc {
        if (this.isRechDoc(documentation)) {
            return this.extractRechDoc(documentation);
        }
        return this.extractDefaultDoc(documentation);
    }

    /**
     * Extracts Cobol documentation in RechDoc format
     *
     * @param documentation unparsed documentation
     */
    private extractRechDoc(documentation: string[]): CobolDoc {
        let comment: string[] = [];
        const params: DocElement[] = [];
        const returns: DocElement[] = [];
        const throws: DocElement[] = [];
        let parsingRechDoc = false;
        let extractingComment = false;
        documentation.forEach((currentLine) => {
            if (currentLine.trim().startsWith("*>/**")) {
                parsingRechDoc = true;
                extractingComment = true;
            } else {
                if (currentLine.trim().startsWith("*>*/")) {
                    parsingRechDoc = false;
                }
                if (parsingRechDoc) {
                    if (!this.ignoreElementsInCobolDoc && currentLine.match(/@param/)) {
                        this.updateDocElement(params, currentLine);
                        extractingComment = false;
                    }
                    if (!this.ignoreElementsInCobolDoc && currentLine.match(/@return/)) {
                        extractingComment = false;
                        this.updateDocElement(returns, currentLine);
                    }
                    if (!this.ignoreElementsInCobolDoc && currentLine.match(/@throws/)) {
                        extractingComment = false;
                        this.updateDocElement(throws, currentLine);
                    }
                    if (!this.ignoreElementsInCobolDoc && currentLine.match(/(@enum|@optional|@default|@extends)/)) {
                        extractingComment = false;
                    }
                    if (extractingComment) {
                        const currentComment = currentLine.replace("*>", "").trim();
                        if (currentComment.length == 0) {
                            comment.concat("\n\n");
                        } else {
                            comment = comment.concat(this.removeLineCommentIfNeed(currentComment));
                        }
                    }

                }
            }
        });
        this.parsePreTerms(params, this.preParams);
        this.parsePreTerms(returns, this.preReturns);
        this.parsePreTerms(throws, this.preThrows);
        return new CobolDoc(comment, params, returns, throws);
    }

    /**
     * Parse the preTerms and complete the elemens
     */
    private parsePreTerms(elements: DocElement[], items: CobolVariable[]) {
        items.forEach((variable) => {
            let variableDocumentation: any = variable.getComment();
            variableDocumentation = variableDocumentation ? variableDocumentation.join(" ") : "";
            const element = new DocElement(variable.getName(), variableDocumentation);
            if (element) {
                elements.push(element);
            }
        })
    }

    /**
     * Updates the specified elements array creating a document element from the current line
     *
     * @param elements elements array to be updated
     * @param currentLine current line used to create a document element
     */
    private updateDocElement(elements: DocElement[], currentLine: string) {
        const element = this.createDocElementFromLine(currentLine);
        if (element) {
            elements.push(element);
        }
    }

    /**
     * Creates a document element from the specified line
     *
     * @param currentLine current line to create a document element
     */
    private createDocElementFromLine(currentLine: string): DocElement | undefined {
        const docElementRegex = /\s+\*>\s+(@param|@return|@throws)\s+([\w-]+)\s?(.*)?/.exec(currentLine);
        if (docElementRegex) {
            if (docElementRegex[3]) {
                docElementRegex[3]
                return new DocElement(docElementRegex[2], this.removeLineCommentIfNeed(docElementRegex[3]));
            }
            if (docElementRegex[2]) {
                return new DocElement(docElementRegex[2], "");
            }
        }
        return undefined;
    }

    /**
     * Remove comment of line if need
     *
     * @param line
     */
    private removeLineCommentIfNeed(line: string): string {
        const match = /(.*)(\*>.*)/.exec(line);
        if (match) {
            return match[1];
        } else {
            return line;
        }
    }

    /**
     * Returns true if the documentation represents a RechDoc
     *
     * @param documentation
     */
    private isRechDoc(documentation: string[]): boolean {
        const doc = documentation.toString();
        return doc.includes("*>/**")
    }

    /**
     * Extracts the default documentation
     *
     * @param documentation paragraph default documentation
     */
    private extractDefaultDoc(documentation: string[]): CobolDoc {
        let comment: string[] = [];
        documentation.forEach((currentLine) => {
            if (currentLine.trim().startsWith("*>->")) {
                let currentComment = "";
                currentComment = currentLine.replace("*>->", "").replace("<-<*", "").trim();
                currentComment = this.removeDots(currentComment);
                comment = comment.concat(this.removeLineCommentIfNeed(currentComment));
            }
        });
        return new CobolDoc(comment, [], [], []);
    }

    /**
     * Removes dots at the end of the comment
     *
     * @param currentLine current line text
     */
    private removeDots(currentLine: string): string {
        const match = /(.*\.\.+)(?:.*\*\>.*)/.exec(currentLine);
        if (match) {
            currentLine = match[1];
        }
        while (currentLine !== "" && currentLine.endsWith(".")) {
            currentLine = currentLine.slice(0, -1);
        }
        return currentLine;
    }

    /**
     * Defines preParams do add in CobolDoc
     */
    public setPreParams(preParams: CobolVariable[]) {
        this.preParams = preParams;
    }

    /**
     * Defines preReturns do add in CobolDoc
     */
    public setPreReturns(preReturns: CobolVariable[]) {
        this.preReturns = preReturns;
    }

    /**
     * Defines preThrows do add in CobolDoc
     */
    public setPreThrows(preThrows: CobolVariable[]) {
        this.preThrows = preThrows;
    }

    /**
     * Defines to ignore elements in CobolDoc
     */
    public setToIgnoreElementsInCobolDoc() {
        this.ignoreElementsInCobolDoc = true;
    }

}
