'use babel';

import { Editor } from '../editor/editor';

/**
 * Extension commands for indentation operations
 */
export class IndentCommands {

    /**
     * Indent the whole paragraph that the cursor is
     */
    public static indentWholeParagraph(): Promise<void> {
        new Editor().setSelection(new Editor().getPreviousParagraphPosition(), new Editor().getNextParagraphPosition());
        return new Editor().indent("N");
    }
}
