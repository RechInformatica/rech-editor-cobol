'use babel';

import { File } from '../commons/file';
import { Executor } from '../commons/executor';
import * as iconv from 'iconv-lite';
import { BufferSplitter } from 'rech-ts-commons';
import { configuration } from '../helpers/configuration';
import { Editor } from '../editor/editor';

/**
 * Class to indent sources
 */
export class IndentUtils {

    /**
     * identWholeParagraph
     */
    public static identWholeParagraph() {
        new Editor().findPreviousParagraph();
        new Editor().findNextParagraph();
    }

}