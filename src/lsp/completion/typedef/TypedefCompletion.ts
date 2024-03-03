import { CompletionItemKind, CompletionItem, InsertTextFormat, MarkupKind } from "vscode-languageserver";
import { CompletionInterface } from "../CompletionInterface";
import { ExpandedSourceManager } from "../../../cobol/ExpandedSourceManager";
import { CobolVariable, Type } from "../CobolVariable";
import { BufferSplitter, Scan } from "rech-ts-commons";

/**
 * Class to generate LSP Completion Items for Cobol picture
 */
export class TypedefCompletion implements CompletionInterface {


    /** Cache of CompletionItems results */
    private static cache: Map<string, Map<string, CompletionItem>> = new Map()
    /** Uri of source file */
    private uri: string | undefined
    /** Current lines in the source */
    private currentLines: string[] | undefined;
    /** Source of completions */
    private sourceOfCompletions: (() => Thenable<string>) | undefined;

    constructor(uri?: string, sourceOfCompletions?: () => Thenable<string>) {
        this.uri = uri;
        this.sourceOfCompletions = sourceOfCompletions;
    }

    public generate(_line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve, reject) => {
            this.currentLines = lines;
            const items: CompletionItem[] = [];
            this.loadCache().catch((e) => {
                return reject(e);
            });
            const uri = this.uri ? this.uri : "";
            const cache = TypedefCompletion.cache.get(uri);
            if (cache) {
                for (const value of cache.values()){
                    items.push(value);
                }
            } else {
                for (const value of this.generateItemsFromCurrentBuffer(this.currentLines, false).values()) {
                    items.push(value);
                }
            }
            return resolve(items);
        });
    }

    /**
     * Load the cache result
     */
    private loadCache() {
        return new Promise((resolve, reject) => {
            if (!this.uri) {
                return reject();
            }
            let awaitsResult = false;
            if (this.sourceOfCompletions) {
                awaitsResult = true;
                this.sourceOfCompletions()!.then((sourceOfCompletions) => {
                    if (sourceOfCompletions == "expanded") {
                        ExpandedSourceManager.getExpandedSource(this.uri!).then((buffer) => {
                            const result = this.generateItemsFromCurrentBuffer(BufferSplitter.split(buffer.toString()), true);
                            TypedefCompletion.cache.set(this.uri!, result);
                            return resolve([]);
                        }).catch((e) => {
                            return reject(e);
                        })
                    } else {
                        TypedefCompletion.cache.set(this.uri!, this.generateItemsFromCurrentBuffer(<string[]>this.currentLines, false));
                        return resolve([]);
                    }
                })
            }
            if (!awaitsResult) {
                TypedefCompletion.cache.set(this.uri!, this.generateItemsFromCurrentBuffer(<string[]>this.currentLines, false));
                return resolve([]);
            }
        });
    }

    /**
     * Generates completion items from the current source
     *
     * @param lines buffer lines
     */
    private generateItemsFromCurrentBuffer(lines: string[], _useCache: boolean): Map<string, CompletionItem> {
        const itemsMap: Map<string, CompletionItem> = new Map;
        const buffer = lines.join("\n");
        new Scan(buffer).scan(/^ +\d\d +(?:[\w\-]+)?(?:\(.*\))?([\w\-]+)(\s+|\.).*typedef.*/gm, (iterator: any) => {
            const typedefVariable = CobolVariable.parseLines(iterator.row, lines, { noChildren: true, noScope: true, noSection: true, ignoreMethodReturn: true });
            const typedefItem = this.createTypedefCompletion(typedefVariable);
            itemsMap.set(typedefVariable.getName(), typedefItem);
        });
        return itemsMap;
    }


    /**
     * Creates a completion item for a Cobol variable
     *
     * @param variable variable to create the completion item
     * @param docArray variable documentation array
     */
    private createTypedefCompletion(variable: CobolVariable): CompletionItem {
        let comments = variable.getComment()
        if (!comments) {
            comments = [""];
        }
        const typedefName = variable.getName();
        const typedefPic = variable.getPicture();
        return {
            label: typedefName,
            detail: typedefPic + comments.join(" | "),
            insertText: typedefName,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: typedefPic + " " + typedefName,
            preselect: true,
            kind: CompletionItemKind.Variable
        };
    }

}
