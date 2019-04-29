
import { HighlightInterface } from "./HighlightInterface";
import { TextDocument, DocumentHighlight, Position, Range } from "vscode-languageserver";
import { Scan } from "../../commons/Scan";

/**
 * Class to return the default behavior of highlight
 */
export class DefaultHighlight implements HighlightInterface {

    isABlockTerm(_word: string): boolean {
        return true;
    }

    positions(text: TextDocument, word: string, _currentLine: number, _currentCharacter: number): DocumentHighlight[]{
        const results: DocumentHighlight[] = []
        const regexp = new RegExp("(?:\\s|\\(|\\)|\\,|\\.|\\>|\\\"|=|^)" + word + "(?:\\s|\\)|\\(|\\,|\\.|\\\"|==|\\:|$)", "g");
        new Scan(text.getText()).scan(regexp, (iterator: any) => {
            results.push(this.buildDocumentHighlight(iterator, word))
        });
        return results;
    }

    /**
     * Builds and returns the DocumentHighlight of interator
     *
     * @param iterator
     * @param word
     */
    private buildDocumentHighlight(iterator: any, word: string): DocumentHighlight {
        return {
            range:  Range.create(
                Position.create(iterator.row, iterator.column + 1),
                Position.create(iterator.row, iterator.column + word.length + 1)
            )
        }
    }

}
