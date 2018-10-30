
/**
 * Class used to find Cobol words
 */
export class CobolWordFinder {

    /**
     * Returns the word at the specified position
     * 
     * @param lineText line text
     * @param column column where part the word is located
     */
    public findWordAt(lineText: string, column: number): string {
        var cobolWordRegex = this.getCobolWordRegex();
        var result: any;
        while ((result = cobolWordRegex.exec(lineText)) !== null) {
            let start = result.index;
            let end = start + result[0].length;
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
        var cobolWordRegex = this.getCobolWordRegex();
        var result: any;
        while ((result = cobolWordRegex.exec(lineText)) !== null) {
            let start = result.index;
            if (start > column) {
                return start;
            }
        }
        return column;
    }

    /**
     * Returns the Cobol Word Regex
     */
    private getCobolWordRegex(): RegExp {
        return /([a-zA-Z0-9_\-])+/g;
    }



}
