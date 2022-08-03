import { TextDocument } from "vscode-languageserver-textdocument";
import { DocumentHighlight } from "vscode-languageserver";
import { DefaultHighlight } from "./DefaultHighlight";
import { IfHighlight } from "./IfHighlight";
import { EvaluateHighlight } from "./EvaluateHighlight";
import { PerformHighlight } from "./PerformHighlight";
import { TryHighlight } from "./tryHighlight";
import { ConstantTestHighlight } from "./ConstantTestHighlight";

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
            case new ConstantTestHighlight().isABlockTerm(text.getText().split("\n")[currentLine].trimLeft().split(" ")[0]): {
                return new ConstantTestHighlight().positions(text, word, currentLine, currentCharacter);
            }
            case new IfHighlight().isABlockTerm(word): {
                return new IfHighlight().positions(text, word, currentLine, currentCharacter);
            }
            case new EvaluateHighlight().isABlockTerm(word): {
                return new EvaluateHighlight().positions(text, word, currentLine, currentCharacter);
            }
            case new PerformHighlight().isABlockTerm(word): {
                return new PerformHighlight().positions(text, word, currentLine, currentCharacter);
            }
            case new TryHighlight().isABlockTerm(word): {
                return new TryHighlight().positions(text, word, currentLine, currentCharacter);
            }
            default: {
                return new DefaultHighlight().positions(text, word, currentLine, currentCharacter);
            }
        }
    }

}
