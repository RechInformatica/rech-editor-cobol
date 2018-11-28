/**
 * Documentation element
 */
export class DocElement {

    /** Element name */
    private _name: string;
    /** Element description */
    private _description: string;

    /**
     * Creates a documentation element
     * 
     * @param name 
     * @param description 
     */
    constructor(name: string, description: string) {
        this._name = name;
        this._description = description;
    }

    /**
     * Returns the element name
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Returns the element description
     */
    public get description(): string {
        return this._description;
    }

}
