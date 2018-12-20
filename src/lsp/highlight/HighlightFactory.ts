import { TextDocument, DocumentHighlight } from "vscode-languageserver";
import { DefaultHighlight } from "./DefaultHighlight";
import { IfHighlight } from "./IfHighlight";
import { EvaluateHighlight } from "./EvaluateHighlight";
import { PerformHighlight } from "./PerformHighlight";

/**
 * Classe to provide the Highlight
 */
export class HighlightFactory {

    /**
     * Return the highlight positions in the document
     *
     * @param text
     * @param word
     * @param currentLine
     * @param currentCharacter
     */
    public getHighlightsPositions(text: TextDocument, word: string, currentLine: number, currentCharacter: number): DocumentHighlight[] {
        switch (true) {
            case new IfHighlight().isABlockTerm(word): {
                return new IfHighlight().positions(text, word, currentLine, currentCharacter);
            }
            case new EvaluateHighlight().isABlockTerm(word): {
                return new EvaluateHighlight().positions(text, word, currentLine, currentCharacter);
            }
            case new PerformHighlight().isABlockTerm(word): {
                return new PerformHighlight().positions(text, word, currentLine, currentCharacter);
            }
            default: {
                return new DefaultHighlight().positions(text, word, currentLine, currentCharacter);
            }
        }
    }

}