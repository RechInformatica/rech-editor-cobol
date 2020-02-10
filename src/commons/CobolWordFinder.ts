import { WordFinder } from "rech-ts-commons";

/**
 * Class used to find Cobol words
 */
export class CobolWordFinder {

    /**
     * Returns the word (considering it's index) at the specified position
     *
     * @param lineText line text
     * @param column column where part the word is located
     */
    public findWordWithIndexAt(lineText: string, column: number): string {
        return WordFinder.findWordWithRegex(lineText, column, this.getCobolWordWithIndexRegex());
    }

    /**
     * Returns the word at the specified position
     *
     * @param lineText line text
     * @param column column where part the word is located
     */
    public findWordAt(lineText: string, column: number): string {
        return WordFinder.findWordWithRegex(lineText, column, this.getCobolWordRegex());
    }

    /**
     * Returns the next Cobol word in the current line starting from the specified column
     *
     * @param lineText current line
     * @param column initial column
     */
    public getNextWordColumn(lineText: string, column: number): number {
        return WordFinder.getNextWordColumn(lineText, column, this.getCobolWordRegex());
    }

    /**
     * Returns the Cobol Word Regex
     */
    private getCobolWordWithIndexRegex(): RegExp {
        return /([a-zA-Z0-9_\-\(\)])+/g;
    }

    /**
     * Returns the Cobol Word Regex
     */
    private getCobolWordRegex(): RegExp {
        return /([a-zA-Z0-9_\-])+/g;
    }



}
