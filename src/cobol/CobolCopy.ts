import { RechPosition } from "../commons/rechposition";
import { ParserCobol } from "./parsercobol";
import { puts } from "util";
import { CobolDocParser } from "./rechdoc/CobolDocParser";
import { Path } from "../commons/path";
import { File } from "../commons/file";
import { BufferSplitter } from "../commons/BufferSplitter";

/**
 * Class representing a Cobol copy
 */
export class CobolCopy {
    /* Copy name */
    private name: string;
    /* Copy extensio */
    private extension: string;
    /* Copy replace list type */
    private replacingList: Map<string, string>;
    /** Comment of Copy */
    private comment: string[] | undefined;
    /** Header of Copy */
    private header: string[] | undefined;
    /* Raw copy declaration from source code */
    private raw: string;
    /* Line of copy declaration */
    private lineDeclaration: number;
    /** Copy's Uri */
    private uri: string;

    private constructor(name: string, extension: string, raw: string, replacingList: Map<string, string>,  uri: string, lineDeclaration: number, comment?: string[], header?: string[]) {
        this.name = name;
        this.extension = extension;
        this.raw = raw;
        this.replacingList = replacingList;
        this.comment = comment;
        this.header = header;
        this.uri = uri;
        this.lineDeclaration = lineDeclaration;
    }

    /**
     * Creates a CobolVariable instance parsing the specified line
     */
    public static parseLine(line: number, lines: string[], uri: string): CobolCopy | undefined {
        let name = new ParserCobol().getCopyDeclaration(lines[line]);
        if (!name) {
            return;
        }
        let commentArray: string[] = []
        for (let i = line - 1; i > 0; i--) {
            const docLine = lines[i];
            if (docLine.trimLeft().startsWith("*>")) {
                commentArray.push(docLine)
            } else {
                break;
            }
        }
        let localDoc = new CobolDocParser().parseCobolDoc(commentArray).comment;
        let comment;
        if (localDoc.length > 0) {
            comment = localDoc
        }
        let replacingList = this.getReplacingList(line, lines);
        let delclarationRawMatcher = /\s+(copy\s+.+(cpy|cpb)).*/.exec(lines[line])
        let raw = ""
        let extension = ""
        if (delclarationRawMatcher) {
            raw = delclarationRawMatcher[1]
            extension = delclarationRawMatcher[2]
        }
        let copyFile = this.buildUri(uri, `${name}.${extension}`);
        let header = this.getHeaderOfCopy(copyFile)
        return new CobolCopy(name, extension, raw, replacingList, copyFile.fileName, line, comment, header)
    }

    /**
     * Returns the copys header
     *
     * @param copy
     */
    private static getHeaderOfCopy(copy: File): string[] | undefined {
        if (!copy.exists()) {
            return;
        }
        let copyBuffer = BufferSplitter.split(copy.loadBufferSync("latin1"));
        let comment = new CobolDocParser().parseSingleLineCobolDoc(copyBuffer[1]).comment;
        if (!(comment.length > 0)) {
            return;
        }
        return comment;
    }


    /**
     * Build the copy's uri
     *
     * @param uri
     */
    private static buildUri(uri: string, nameAndExtension: string): File {
        let path = new Path(uri);
        let file = new File(path.directory() + "/" + nameAndExtension);
        // Return the current file if exist, else returns in default directorie.
        // If not exist the file in default directorie returns te current directorie
        let currentCopysName = file;
        if (file.exists()) return currentCopysName;
        file = new File("F:/FONTES/" + nameAndExtension);
        if (file.exists()) return file;
        return currentCopysName
    }

    /**
     * Returns the replacing list of copy declaration
     *
     * @param line
     * @param lines
     */
    private static getReplacingList(line: number, lines: string[]): Map<string, string> {
        let result = new Map<string, string>();
        if (!this.hasReplacing(lines[line])) {
            return result;
        }
        for (let i = line; i < lines.length; i++) {
            const copyLineDeclaration = lines[i];
            let match = this.getReplacingTerm(copyLineDeclaration)
            if (match) {
                let term = match[1];
                let replacement = match[2];
                replacement = replacement.replace(/\.$/gm, "");
                result.set(term, replacement)
            }
            if (copyLineDeclaration.trimRight().endsWith(".")) {
                break;
            }
        }
        return result;
    }

    /**
     * Returns true if the copy declaration has replacing
     *
     * @param declaration
     */
    private static hasReplacing(declaration: string): boolean {
        return /.+(?:cpy|cpb)\s+replacing.*/.test(declaration);
    }

    /**
     * Returns the replcing term in the line
     *
     * @param delcarationLine
     */
    private static getReplacingTerm(delcarationLine: string) {
        return /.*\s(.+)\s+by\s+(.+)\.?/.exec(delcarationLine)
    }

    /**
     * Returns the copys name
     */
    public getName() {
        return this.name
    }

    /**
     * Returns the copys raw declaration
     */
    public getRaw() {
        return this.raw
    }

    /**
     * Returns the copys comment
     */
    public getComment() {
        return this.comment
    }

    /**
     * Returns the copys header
     */
    public getHeader() {
        return this.header
    }

    /**
     * Returns the replacings list of the copy
     */
    public getReplacings() {
        return this.replacingList
    }

    /**
     * Returns the path of the copy
     */
    public getUri(): string {
        return this.uri;
    }

    /**
     * Returns the line of the copy declaration
     */
    public getLineDeclaration(): number {
        return this.lineDeclaration;
    }

}