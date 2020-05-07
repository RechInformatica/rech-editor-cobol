'use babel';

import { File } from '../commons/file';
import { Executor } from '../commons/executor';
import * as iconv from 'iconv-lite';
import { BufferSplitter } from 'rech-ts-commons';
import { configuration } from '../helpers/configuration';
import { Editor } from '../editor/editor';
import { Position } from 'vscode';
import { RechPosition } from '../commons/rechposition';

/**
 * Static class to do specific identation
 */
export class IndentUtils {

    /**
     * Indent the whole paragraph that the cursor is
     */
    public static indentWholeParagraph() : Promise<void> {
        new Editor().setSelection(new Editor().getPreviousParagraphPosition(), new Editor().getNextParagraphPosition());
        return new Editor().indent("N");
    }
}
