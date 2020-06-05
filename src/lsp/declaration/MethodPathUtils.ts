import { File } from "../../commons/file";
import { Path } from "../../commons/path";

/**
 * Utility class with methods to build path to COBOL classes
 */
export class MethodPathUtils {

    public static getFullPath(clazz: string, uri: string) {
        const path = this.getFullPathWithExt(clazz, uri, ".cbl");
        if (path !== "") {
            return path;
        }
        return this.getFullPathWithExt(clazz, uri, ".cob");
    }

    private static getFullPathWithExt(clazz: string, uri: string, extension: string) {
        let path = new Path(new Path(uri).fullPathWin()).directory() + clazz + extension;
        if (new File(path).exists()) {
            return path;
        }
        path = "F:\\Fontes\\" + clazz + extension;
        if (new File(path).exists()) {
            return path;
        }
        return "";
    }

}
