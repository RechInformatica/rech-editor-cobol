/**
 * Utility class for splitting buffer lines into array
 */
export class BufferSplitter {

    /**
     * Splits the specifing buffer lines into array, considering all possible line breaks
     *
     * @param buffer buffer text to be splitted
     * @param splitted buffer
     */
    public static split(buffer: String): string[] {
        return buffer.split(/\r\n|\r|\n/g);
    }

}
