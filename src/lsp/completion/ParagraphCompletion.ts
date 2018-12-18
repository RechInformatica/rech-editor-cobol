import { ParserCobol } from "../../cobol/parsercobol";
import { CobolDocParser } from "../../cobol/rechdoc/CobolDocParser";
import { MarkupKind, CompletionItemKind, CompletionItem } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { File } from "../../commons/file";
import { Scan } from "../../commons/Scan";

/**
 * Class to generate LSP Completion Items for Cobol paragraphs declarations
 */
export class ParagraphCompletion implements CompletionInterface {

    /** Cache of completion itens of the last source preprocessed*/
    private static cache: Map<string, CompletionItem> | undefined;
    /** File name of the source in cahce */
    private static cacheSourceFileName: string;
    /** Cobol parser */
    private parserCobol: ParserCobol;
    /** Cobol documentation parser */
    private cobolDocParser: CobolDocParser;
    /** Cache file name */
    private cacheFileName: string;
    /** callback to expander the source */
    private callbackSourceExpander: (() => Thenable<any>) | undefined;
    /** Current lines in the source */
    private currentLines: string[] | undefined;

    constructor(cacheFileName: string, callbackSourceExpander?: () => Thenable<any>) {
        this.parserCobol = new ParserCobol();
        this.cobolDocParser = new CobolDocParser();
        this.cacheFileName = cacheFileName;
        this.callbackSourceExpander = callbackSourceExpander;
    }

    public generate(_line: number, _column: number, lines: string[]): CompletionItem[] {
        this.currentLines = lines;
        this.loadCache();
        let items: CompletionItem[] = [];
        if (ParagraphCompletion.cache && ParagraphCompletion.cacheSourceFileName == this.cacheFileName) {
            for (let value of ParagraphCompletion.cache.values()){
                items.push(value);
            }
        } else {
            for (let value of this.generateParagraphCompletion(this.currentLines, false).values()) {
                items.push(value);
            }
        }
        return items;
    }

    /**
     * Load the cache
     *
     * @param _line
     * @param _column
     */
    private loadCache() {
        return new Promise((resolve, reject) => {
            let file = new File(this.cacheFileName);
            if (file.exists()) {
                this.loadCacheFromPreprocessedFile(file).then((items) => {
                    ParagraphCompletion.cache = items;
                    resolve();
                }).catch(() => {
                    reject()
                })
            }
            if (this.callbackSourceExpander && ParagraphCompletion.cacheSourceFileName != this.cacheFileName) {
                ParagraphCompletion.cacheSourceFileName = this.cacheFileName;
                ParagraphCompletion.cache = undefined;
                this.callbackSourceExpander().then(() => {
                    this.loadCacheFromPreprocessedFile(file).then((items) => {
                        ParagraphCompletion.cacheSourceFileName = this.cacheFileName;
                        ParagraphCompletion.cache = items;
                        resolve();
                    }).catch(() => {
                        reject();
                    })
                });
            }
        });
    }

    /**
     * Load the cache with the preprocessed file
     *
     * @param file
     * @param _line
     * @param _column
     */
    private loadCacheFromPreprocessedFile(file: File): Promise<Map<string, CompletionItem>> {
        return new Promise((resolve, reject) => {
            file.loadBuffer("latin1").then((buffer) => {
                resolve(this.generateParagraphCompletion(buffer.toString().split("\n"), true));
            }).catch(() => {
                reject();
            });
        });
    }

    /**
     * Generates completions based on statement of paragraphs
     *
     * @param _line
     * @param _column
     * @param lines
     * @param useCache
     */
    private generateParagraphCompletion(lines: string[], useCache: boolean): Map<string, CompletionItem> {
        let items: Map<string, CompletionItem> = new Map;
        let buffer = lines.join("\n");
        new Scan(buffer).scan(/^\s\s\s\s\s\s\s([\w\-]+)\.(?:\s*\*\>.*)?/gm, (iterator: any) => {
            let paragraphName = this.parserCobol.getDeclaracaoParagrafo(iterator.lineContent.toString());
            let docArray = this.getParagraphDocumentation(lines, iterator.row);
            if (paragraphName) {
                let paragraphItem = this.createParagraphCompletion(paragraphName, docArray);
                items.set(paragraphName, paragraphItem);
            }
        });
        // Merge the cache with the local paragraphs
        if (useCache) {
            this.generateParagraphCompletion(<string[]>this.currentLines, false).forEach((value, key) => {
                if (!items.has(key)){
                    items.set(key, value);
                }
            })
        }
        return items;
    }

    /**
     * Creates and pushes a completion item for the specified paragraph
     *
     * @param paragraph paragraph name
     * @param docArray documentation array
     */
    private createParagraphCompletion(paragraph: string, docArray: string[]): CompletionItem {
        let cobolDoc = this.cobolDocParser.parseCobolDoc(docArray);
        return {
            label: paragraph,
            detail: cobolDoc.comment,
            documentation: {
                kind: MarkupKind.Markdown,
                value: cobolDoc.elementsAsMarkdown()
            },
            kind: CompletionItemKind.Method
        };
    }

    /**
     * Returns the documentation of the paragraph on the specified line
     *
     * @param lines buffer lines
     * @param lineIndex line with the paragraph declaration which will have the documentation extracted
     */
    private getParagraphDocumentation(lines: string[], lineIndex: number): string[] {
        let documentation: string[] = [];
        for (let index = lineIndex - 1; index >= 0; index--) {
            let currentLineText = lines[index];
            if (currentLineText.startsWith("      *>")) {
                documentation.push(currentLineText);
            } else {
                break;
            }
        }
        documentation = documentation.reverse();
        return documentation;
    }

}