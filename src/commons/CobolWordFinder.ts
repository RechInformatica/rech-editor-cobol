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
    findWordAt(lineText: string, column: number): string {
        var cobolWordRegex = /([a-zA-Z0-9_\-])+/g;
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

}
