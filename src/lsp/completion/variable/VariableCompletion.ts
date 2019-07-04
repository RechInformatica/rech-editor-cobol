import { CompletionItemKind, CompletionItem, InsertTextFormat, MarkupKind } from "vscode-languageserver";
import { CompletionInterface } from "../CompletionInterface";
import { Scan } from "../../../commons/Scan";
import { CobolVariable } from "../CobolVariable";
import { ExpandedSourceManager } from "../../../cobol/ExpandedSourceManager";
import { VariableInsertTextBuilder } from "./VariableInsertTextBuilder";
import { VariableNameInsertTextBuilder } from "./VariableNameInsertTextBuilder";
import { BufferSplitter } from "../../../commons/BufferSplitter";

/**
 * Class to generate LSP Completion Items for Cobol variables
 */
export class VariableCompletion implements CompletionInterface {

    /** Cache of CompletionItems results */
    private static cache: Map<string, Map<string, CompletionItem>> = new Map()
    /** Ignore enumerations (88 variables) */
    private ignoreEnums: boolean = false;
    /** Ignore display variables */
    private ignoreDisplay: boolean = false;
    /* Implementation to build the insertText of variable completion items */
    private insertTextBuilder: VariableInsertTextBuilder;
    /** Uri of source file */
    private uri: string | undefined
    /** Current lines in the source */
    private currentLines: string[] | undefined;
    /** Source of completions */
    private sourceOfCompletions: Thenable<string> | undefined;

    constructor(uri?: string, sourceOfCompletions?: Thenable<string>) {
        this.uri = uri;
        this.sourceOfCompletions = sourceOfCompletions;
        this.insertTextBuilder = new VariableNameInsertTextBuilder();
    }

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve, reject) => {
            this.currentLines = lines;
            const items: CompletionItem[] = [];
            this.loadCache().catch(() => {
                reject();
            });
            const uri = this.uri ? this.uri : "";
            const cache = VariableCompletion.cache.get(uri);
            if (cache) {
                for (const value of cache.values()){
                    value.insertText = this.insertTextBuilder.buildInsertText(value.label, lines[line], column);
                    items.push(value);
                }
            } else {
                for (const value of this.generateItemsFromCurrentBuffer(this.currentLines, false).values()) {
                    value.insertText = this.insertTextBuilder.buildInsertText(value.label, lines[line], column);
                    items.push(value);
                }
            }
            return resolve(items);
        });
    }

    /**
     * Sets wheter this completion should ignore Cobol enums (88 variables)
     *
     * @param ignoreEnums should ignore enums
     */
    public setIgnoreEnums(ignoreEnums: boolean): VariableCompletion {
        this.ignoreEnums = ignoreEnums;
        return this;
    }

    /**
     * Sets wheter this completion should ignore Cobol display variables
     *
     * @param ignoreDisplay should ignore display variables
     */
    public setIgnoreDisplay(ignoreDisplay: boolean): VariableCompletion {
        this.ignoreDisplay = ignoreDisplay;
        return this;
    }

    /**
     * Sets the implementation to build the insertText of variable completion items
     *
     * @param insertTextBuilder implementation
     */
    public setInsertTextBuilder(insertTextBuilder: VariableInsertTextBuilder): VariableCompletion {
        this.insertTextBuilder = insertTextBuilder;
        return this;
    }

    /**
     * Load the cache result
     */
    private loadCache() {
        return new Promise((resolve, reject) => {
            if (!this.uri) {
                reject();
            }
            let awaitsResult = false;
            if (this.sourceOfCompletions) {
                awaitsResult = true;
                this.sourceOfCompletions.then((sourceOfCompletions) => {
                    if (sourceOfCompletions == "expanded") {
                        ExpandedSourceManager.getExpandedSource(this.uri!).then((buffer) => {
                            const result = this.generateItemsFromCurrentBuffer(BufferSplitter.split(buffer.toString()), true);
                            VariableCompletion.cache.set(this.uri!, result);
                            return resolve();
                        }).catch(() => {
                            return reject();
                        })
                    } else {
                        VariableCompletion.cache.set(this.uri!, this.generateItemsFromCurrentBuffer(<string[]>this.currentLines, false));
                        return resolve();
                    }
                })
            }
            if (!awaitsResult) {
                VariableCompletion.cache.set(this.uri!, this.generateItemsFromCurrentBuffer(<string[]>this.currentLines, false));
                return resolve();
            }
        });
    }

    /**
     * Generates completion items from the current source
     *
     * @param lines buffer lines
     */
    private generateItemsFromCurrentBuffer(lines: string[], useCache: boolean): Map<string, CompletionItem> {
        const itemsMap: Map<string, CompletionItem> = new Map;
        const buffer = lines.join("\n");
        new Scan(buffer).scan(/^\s+\d\d\s+(?:[\w\-]+)?(?:\(.*\))?([\w\-]+)(\s+|\.).*/gm, (iterator: any) => {
            const variable = CobolVariable.parseLines(iterator.row, lines);
            //variable = CobolVariable.parserAndSetComment(variable, iterator.row, lines);
            if (!this.shouldIgnoreVariable(variable)) {
                const variableItem = this.createVariableCompletion(variable);
                itemsMap.set(variable.getName(), variableItem);
            }
        });
        // Merge the cache with the local paragraphs
        if (useCache) {
            this.generateItemsFromCurrentBuffer(<string[]>this.currentLines, false).forEach((value, key) => {
                if (!itemsMap.has(key)){
                    itemsMap.set(key, value);
                }
            })
        }
        return itemsMap;

    }

    /**
     * Returns true if the variable should be ignored from the suggestion list
     *
     * @param variable variable to be tested
     */
    private shouldIgnoreVariable(variable: CobolVariable): boolean {
        if (variable.getName().toUpperCase() === "FILLER") {
            return true;
        }
        if (this.ignoreDisplay && variable.isDisplay()) {
            // For now we don't parse constant values and since some constantes can have
            // numeric values we never filter them
            if (variable.getLevel() == CobolVariable.CONSTANT_LEVEL) {
                return false;
            }
            return true;
        }
        if (this.ignoreEnums && variable.getLevel() == CobolVariable.ENUM_LEVEL) {
            return true;
        }
        return false;
    }

    /**
     * Creates a completion item for a Cobol variable
     *
     * @param variable variable to create the completion item
     * @param docArray variable documentation array
     */
    private createVariableCompletion(variable: CobolVariable): CompletionItem {
        const variableKind = this.getAppropriateKind(variable);
        let comments = variable.getComment()
        if (!comments) {
            comments = [""];
        }
        return {
            label: variable.getName(),
            detail: comments.join(" | "),
            documentation: {
                kind: MarkupKind.Markdown,
                value: this.buildVariableAsMarkdown(variable)
            },
            kind: variableKind
        };
    }

    /**
     * Returns the most appropriate CompletionItemKind for this variable
     *
     * @param variable Cobol variable
     */
    private getAppropriateKind(variable: CobolVariable): CompletionItemKind {
        switch(true) {
            case variable.getLevel() == CobolVariable.CONSTANT_LEVEL: {
                return CompletionItemKind.Constant;
            }
            case variable.getLevel() == CobolVariable.ENUM_LEVEL: {
                return CompletionItemKind.EnumMember;
            }
            default: {
                return CompletionItemKind.Variable;
            }
        }
    }

    /**
     * Builds the Cobol varible general information
     *
     * @param variable Cobol variable
     */
    private buildVariableAsMarkdown(variable: CobolVariable): string {
        let info = "";
        // info = info.concat("*Level*: `" + `0${variable.getLevel()}`.slice(-2) + "`\n\n");
        if (variable.getPicture() !== "") {
            info = info.concat("*Picture*: `" + variable.getPicture() + "`\n\n");
        }
        info = info.concat("`" + variable.getRaw().trim() + "`\n\n");
        return info;
    }

    /**
     * Remove the uri from the cache
     *
     * @param uri
     */
    public static removeCache(uri: string) {
        VariableCompletion.cache.delete(uri);
    }

}