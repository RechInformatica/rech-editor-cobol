import { Editor } from "../editor/editor";
import { CobolWordFinder } from "./CobolWordFinder";

/**
 * Class used to pull Cobol words in editor
 */
export class CobolWordPuller {

    /**
     * Pulls in editor the next Cobol word
     */
    public pullNextWord(): void {
        let editor = new Editor();
        let position = editor.getCursors()[0];
        var line = editor.getLine(position.line);
        var nextColumn = new CobolWordFinder().getNextWordColumn(line, position.column);
        // If there is a new word after the cursor
        if (nextColumn !== position.column) {
            var before = line.slice(0, position.column);
            var after = line.slice(nextColumn, line.length);
            editor.setCurrentLine(before + after);
        }
    }

}
