
/**
 * Class to manipulate positions
 */
export class RechPosition {
    /** Line position */
    public line: number;
    /** Column position */
    public column: number;
    /** file */
    public file: string | undefined;

    /**
     * Constructor of RechPosition
     *
     * @param line
     * @param column
     * @param file
     */
    public constructor (line: number, column: number, file?: string) {
        this.line = line;
        this.column = column;
        this.file = file;
    }
}