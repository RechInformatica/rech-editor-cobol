import { DocumentSymbol } from 'vscode';

/**
 * Represents the context of a parent element in the outline structure.
 * This class encapsulates a document symbol and its associated context type.
 */
export class ParentContext {

    private symbol: DocumentSymbol;
    private type: ContextType;

    /**
     * Creates an instance of `ParentContext`.
     *
     * @param symbol - The document symbol representing the parent element.
     * @param type - The context type associated with the parent element.
     */
    constructor(symbol: DocumentSymbol, type: ContextType) {
        this.symbol = symbol;
        this.type = type;
    }

    /**
     * Retrieves the document symbol of the parent context.
     *
     * @returns The `DocumentSymbol` representing the parent element.
     */
    public getSymbol(): DocumentSymbol {
        return this.symbol;
    }

    /**
     * Retrieves the context type of the parent context.
     *
     * @returns The `ContextType` associated with the parent element.
     */
    public getType(): ContextType {
        return this.type;
    }

}

export enum ContextType {
    DataDivision,
    ProcedureDivision,
    LinkageSection,
    WorkingStorageSection,
    Factory,
    Object,
    Paragraph,
    Variable,
    DeclareVariable,
    Method
}
