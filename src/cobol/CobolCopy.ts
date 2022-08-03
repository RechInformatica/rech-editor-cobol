import { ParserCobol } from "./parsercobol";
import { CobolDocParser } from "./rechdoc/CobolDocParser";
import { Path } from "../commons/path";
import { File } from "../commons/file";
import { BufferSplitter } from "rech-ts-commons";
import { Configuration } from "../helpers/configuration";
import { commands } from "vscode";
import { CobolVariable } from "../lsp/completion/CobolVariable";

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
    public static parseLine(line: number, lines: string[], uri: string): Promise<CobolCopy | undefined> {
        return new Promise((resolve, reject) => {
            const name = new ParserCobol().getCopyDeclaration(lines[line]);
            if (!name) {
                return reject();
            }
            const commentArray: string[] = []
            for (let i = line - 1; i > 0; i--) {
                const docLine = lines[i];
                if (docLine.trimLeft().startsWith("*>")) {
                    commentArray.push(docLine)
                } else {
                    break;
                }
            }
            const localDoc = new CobolDocParser().parseCobolDoc(commentArray).comment;
            let comment: string[] = [];
            if (localDoc.length > 0) {
                comment = localDoc
            }
            const replacingList = this.getReplacingList(line, lines);
            const declarationRawMatcher = /\s+(copy\s+.+(cpy|cpb)).*/.exec(lines[line])
            let raw = ""
            let extension = ""
            if (declarationRawMatcher) {
                raw = declarationRawMatcher[1]
                extension = declarationRawMatcher[2]
            }
            const copyFile = this.buildUri(uri, `${name}.${extension}`);
            this.getHeaderOfCopy(copyFile).then((header) => {
                return resolve(new CobolCopy(name!, extension, raw, replacingList, copyFile.fileName, line, comment, header));
            }).catch(() => {
                return resolve(new CobolCopy(name!, extension, raw, replacingList, copyFile.fileName, line, comment));
            });
        });
    }

    /**
     * Returns the copys header
     *
     * @param copy
     */
    private static getHeaderOfCopy(copy: File): Promise<string[]> {
        return new Promise((resolve, reject) => {
            if (!copy.exists()) {
                return reject();
            }
            const commentExractorFromCopyFilesCommand = new Configuration("rech.editor.cobol.callback").get<string>("commentExractorFromCopyFiles");
            if (!commentExractorFromCopyFilesCommand || commentExractorFromCopyFilesCommand == "") {
                const copyBuffer = BufferSplitter.split(copy.loadBufferSync("latin1"));
                const comments: string[] = [];
                for (let lineNumber = 0; lineNumber < copyBuffer.length; lineNumber++) {
                    const line = copyBuffer[lineNumber];
                    if (line.trimLeft().startsWith("*>")) {
                        comments.push(line);
                    } else {
                        // If the last line is a variable declaration, remove the last comment line because it's not make part of copy header
                        if (CobolVariable.parseLines(lineNumber, copyBuffer, {noChildren: true, noScope: true, noSection: true, noComment: true})) {
                            comments.pop();
                        }
                        break;
                    }
                }
                const comment = new CobolDocParser().parseCobolDoc(comments).comment;
                if (!(comment.length > 0)) {
                    return reject();
                }
                return resolve(comment);
            }
            commands.executeCommand<string[]>(commentExractorFromCopyFilesCommand, copy.fileName).then((result) => {
                if (result) {
                    return resolve(result);
                } else {
                    return reject();
                }
            }, (e) => {
                return reject(e);
            });

        });
    }


    /**
     * Build the copy's uri
     *
     * @param uri
     */
    private static buildUri(uri: string, nameAndExtension: string): File {
        const path = new Path(uri);
        let file = new File(path.directory() + "/" + nameAndExtension);
        // Return the current file if exist, else returns in default directorie.
        // If not exist the file in default directorie returns te current directorie
        const currentCopysName = file;
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
        const result = new Map<string, string>();
        if (!this.hasReplacing(lines[line])) {
            return result;
        }
        for (let i = line; i < lines.length; i++) {
            const copyLineDeclaration = lines[i];
            const match = this.getReplacingTerm(copyLineDeclaration)
            if (match) {
                const term = match[1];
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
