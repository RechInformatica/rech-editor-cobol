
/**
 * Class to manipulate positions
 */
export class RechPosition {
    /** Line position */
    private _line: number;
    /** Column position */
    private _column: number;
    /** file */
    private _file: string | undefined;

    /**
     * Constructor of RechPosition
     *
     * @param line
     * @param column
     * @param file
     */
    public constructor (line: number, column: number, file?: string) {
        this._line = line;
        this._column = column;
        this._file = file;
    }

    /**
     * Return the line Position
     */
    public get line(): number {
        return this._line;
    }

    /**
     * Return the column position
     */
    public get column(): number {
        return this._column;
    }

    /**
     * Return the column position
     */
    public get file(): string | undefined {
        return this._file;
    }
}