import { RechPosition } from "../../commons/rechposition";

/**
 * Interface which classes implement to find declaration of COBOL elements
 */
export interface FindInterface {

    /**
     * Finds the declaration of the specified COBOL element.
     * 
     * Returns a Promise with a RechPosition related to the declaration.
     */
    findDeclaration(findParams: FindParameters): Promise<RechPosition>;
}

/**
 * Parameters with information about the element to have the declaration found
 */
export interface FindParameters {

    /**
     * The term which declaration will be searched
     */
    term: string,

    /**
     * URI of current source code
     */
    uri: string,

    /**
     * Line index where cursor is positioned
     */
    lineIndex: number,

    /**
     * Column index where cursor is positioned
     */
    columnIndex: number
}