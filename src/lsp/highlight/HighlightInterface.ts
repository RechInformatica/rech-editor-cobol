import { TextDocument } from "vscode-languageserver-textdocument";
import { DocumentHighlight } from "vscode-languageserver";

/**
 * Interface to return the highlight positions
 * in Language Server Provider
 */
export interface HighlightInterface {

    /**
     * Return if the word is a block term
     *
     * @param word
     */
    isABlockTerm(word: string): boolean;

    /**
    * return an array of highlight positions
    *
    * @param text
    * @param word
    * @param currentLine
    * @param currentCharacter
    */
    positions(text: TextDocument, word: string, currentLine: number, currentCharacter: number): DocumentHighlight[];

}
