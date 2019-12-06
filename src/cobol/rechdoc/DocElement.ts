/**
 * Documentation element
 */
export class DocElement {

    /** Element name */
    private _name: string;
    /** Element type */
    private _type: string;
    /** Element description */
    private _description: string;

    /**
     * Creates a documentation element
     *
     * @param name
     * @param type
     * @param description
     */
    constructor(name: string, type: string, description: string) {
        this._name = name;
        this._type = type;
        this._description = description;
    }

    /**
     * Returns the element name
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Returns the element name
     */
    public get type(): string {
        return this._type;
    }

    /**
     * Returns the element description
     */
    public get description(): string {
        return this._description;
    }

}
