import { DocElement } from "./DocElement";

/**
 * Class to parse Cobol paragraph and variable documentations
 */
export class CobolDoc {

    /** Documentation comment */
    private _comment: string[];
    /** Parameters */
    private _params: DocElement[];
    /** Returned variables */
    private _returns: DocElement[];
    /** Errors thrown */
    private _throws: DocElement[];

    /**
     * Creates an object with Cobol documentation information
     *
     * @param comment
     * @param params
     * @param returns
     * @param throws
     */
    constructor(comment: string[], params: DocElement[], returns: DocElement[], throws: DocElement[]) {
        this._comment = comment;
        this._params = params;
        this._returns = returns;
        this._throws = throws;
    }

    /**
     * Returns the documentation comment
     */
    public get comment(): string[] {
        return this._comment;
    }

    /**
     * Returns the parameters
     */
    public get params(): DocElement[] {
        return this._params;
    }

    /**
     * Retgurns the returned variables
     */
    public get returns(): DocElement[] {
        return this._returns;
    }

    /**
     * Returns the erros thrown
     */
    public get throws(): DocElement[] {
        return this._throws;
    }

    /**
     * Returns the current documentation in the Markdown format
     */
    public asMarkdown(): string {
        let markdown = "";
        const joined = this._comment.join("\n");
        markdown = markdown.concat(joined).concat("\n\n\n");
        markdown += this.elementsAsMarkdown();
        return markdown;
    }

    /**
     * Returns the current elements in the Markdown format
     */
    public elementsAsMarkdown(): string {
        let markdown = "";
        markdown = markdown.concat(this.elementArrayAsMarkdown(this.params, "@param"));
        markdown = markdown.concat(this.elementArrayAsMarkdown(this.returns, "@return"));
        markdown = markdown.concat(this.elementArrayAsMarkdown(this.throws, "@throws"));
        return markdown;
    }

    /**
     * Converts the specified documentation element array to Markdown format
     *
     * @param elements element array to be converted
     * @param metaName meta name of the target documentation elements
     */
    private elementArrayAsMarkdown(elements: DocElement[], metaName: string): string {
        let markdown = "";
        elements.forEach(currentParam => {
            markdown = markdown.concat("*" + metaName + "* `" + currentParam.name + "` - " + currentParam.description + "\n\n");
        });
        return markdown;
    }

}
