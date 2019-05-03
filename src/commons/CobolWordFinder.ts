
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
        return this.findWordWithRegex(lineText, column, this.getCobolWordWithIndexRegex());
    }

    /**
     * Returns the word at the specified position
     *
     * @param lineText line text
     * @param column column where part the word is located
     */
    public findWordAt(lineText: string, column: number): string {
        return this.findWordWithRegex(lineText, column, this.getCobolWordRegex());
    }

    /**
     * Finds the Cobol word using the specified regular expression
     *
     * @param lineText current line text
     * @param column column where part the word is located
     * @param regex regular expression to find the cobol Word
     */
    private findWordWithRegex(lineText: string, column: number, cobolWordRegex: RegExp) {
        var result: any;
        while ((result = cobolWordRegex.exec(lineText)) !== null) {
            const start = result.index;
            const end = start + result[0].length;
            if (start <= column && column <= end) {
                return result[0];
            }
        }
        return "";
    }

    /**
     * Returns the next Cobol word in the current line starting from the specified column
     *
     * @param lineText current line
     * @param column initial column
     */
    public getNextWordColumn(lineText: string, column: number): number {
        const cobolWordRegex = this.getCobolWordRegex();
        let result: any;
        while ((result = cobolWordRegex.exec(lineText)) !== null) {
            const start = result.index;
            if (start > column) {
                return start;
            }
        }
        return column;
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
