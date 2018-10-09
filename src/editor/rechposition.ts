
/**
 * Class to manipulate positions
 */
export class RechPosition {
    /** Line position */
    private _line: number;
    /** Column position */
    private _column: number;

    /**
     * Constructor of RechPosition
     * 
     * @param line 
     * @param column 
     */
    public constructor (line: number, column: number) {
        this._line = line;
        this._column = column;
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
}