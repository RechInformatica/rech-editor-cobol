import { File } from "./file";


/**
 * Utility class with common methods for file handling
 */
export class FileUtils {

    /**
     * Reads the file content and returns a Promise with file content, after
     * file is completely read.
     *
     * @param uri URI of file to be read
     * @param encoding optional encoding for the file being read
     */
    public static read(uri: string, encoding?: BufferEncoding): Promise<string> {
        return new File(uri).loadBuffer(encoding);
    }

}