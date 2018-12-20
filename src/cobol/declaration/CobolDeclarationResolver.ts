import { RechPosition } from "../../editor/rechposition";
import { Path } from "../../commons/path";
import { Find } from "../../editor/Find";

/**
 * Class to resolve Cobol elements declaration
 */
export class CobolDeclarationResolver {

    /* Function to expand the source code when no definition is found on the current source buffer */
    private sourceExpanderCallback: ((cacheFileName: string) => Thenable<any>) | undefined;

    constructor() {
        this.sourceExpanderCallback = undefined;
    }

    /**
     * Sets the function to expand the source code when no definition is found on the current source buffer
     *
     * @param callback function callback
     */
    public setSourceExpanderCallback(callback: (cacheFileName: string) => Thenable<any>): CobolDeclarationResolver {
        this.sourceExpanderCallback = callback;
        return this;
    }

    /**
     * Creates a promise to find the specified word declaration
     *
     * @param documentFullText full text of the current document
     * @param word the target word which declaration will be searched
     * @param uri URI of the current file open in editor
     */
    public findDeclaration(documentFullText: string, word: string, uri: string) {
        // Creates an external promise so the reject function can be called when no definition
        // is found for the specified word
        return new Promise<RechPosition>(resolve => {
            // If the word is too small
            if (word.length < 3) {
                resolve(undefined);
                return;
            }
            // Cache filename where the declaration is searched before
            // invoking Cobol preprocessor
            let cacheFileName = this.buildCacheFileName(uri);
            // Creates a promise to find the word declaration
            new Find(documentFullText)
                .findDeclaration(word, new Path(uri), cacheFileName, this.sourceExpanderCallback)
                .then((position: RechPosition) => {
                    // If the delcaration was found on an external file
                    if (position.file) {
                        // Retrieves the location on the external file
                        resolve(position);
                    } else {
                        // Retrieves the location on the current file
                        resolve(new RechPosition(position.line, position.column, uri));
                    }
                })
                .catch(() => {
                    resolve(undefined);
                });
        });
    }

    /**
     * Builds Cobol preprocessor cache filename
     *
     * @param uri current URI of the file open in editor
     */
    private buildCacheFileName(uri: string) {
        var path = new Path(uri).fullPathWin();
        return "c:\\tmp\\PREPROC\\" + new Path(path).fileName();
    }


}
