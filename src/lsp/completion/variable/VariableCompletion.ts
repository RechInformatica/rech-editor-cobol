import { CompletionItemKind, CompletionItem, MarkupKind } from "vscode-languageserver";
import { CompletionInterface } from "../CompletionInterface";
import { Scan, BufferSplitter } from "rech-ts-commons";
import { CobolVariable } from "../CobolVariable";
import { ExpandedSourceManager } from "../../../cobol/ExpandedSourceManager";
import { VariableInsertTextBuilder } from "./VariableInsertTextBuilder";
import { VariableNameInsertTextBuilder } from "./VariableNameInsertTextBuilder";
import { CompletionUtils } from "../../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol variables
 */
export class VariableCompletion implements CompletionInterface {

    /** Cache of CompletionItems results */
    private static cache: Map<string, Map<string, CompletionItem>> = new Map()
    /** Consider only object reference */
    private considerOnlyObjectReference: boolean = false;
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
    /** Current line number */
    private lineNumber: number = 0;
    /** Column where user started typing variable name. This column tells VSCode where replacement should start within the current line */
    private rangeColumn: number = 0;
    /** Source of completions */
    private sourceOfCompletions: (() => Thenable<string>) | undefined;

    constructor(uri?: string, sourceOfCompletions?: () => Thenable<string>) {
        this.uri = uri;
        this.sourceOfCompletions = sourceOfCompletions;
        this.insertTextBuilder = new VariableNameInsertTextBuilder();
    }

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve, reject) => {
            this.currentLines = lines;
            this.lineNumber = line;
            this.rangeColumn = CompletionUtils.findWordStartWithinLine(column, lines[line]) - 1;
            const items: CompletionItem[] = [];
            this.loadCache().catch((e) => {
                return reject(e);
            });
            const uri = this.uri ? this.uri : "";
            const cache = VariableCompletion.cache.get(uri);
            if (cache) {
                for (const value of cache.values()){
                    value.textEdit!.newText = this.insertTextBuilder.buildInsertText(value.label, value.kind === CompletionItemKind.EnumMember, lines[line], column);
                    items.push(value);
                }
            } else {
                for (const value of this.generateItemsFromCurrentBuffer(this.currentLines, false).values()) {
                    value.textEdit!.newText = this.insertTextBuilder.buildInsertText(value.label, value.kind === CompletionItemKind.EnumMember, lines[line], column);
                    items.push(value);
                }
            }
            return resolve(items);
        });
    }

    /**
     * Sets wheter this completion should consider only object reference variables
     *
     * @param considerOnlyObjectReference should consider only object reference
     */
    public setConsiderOnlyObjectReference(considerOnlyObjectReference: boolean): VariableCompletion {
        this.considerOnlyObjectReference = considerOnlyObjectReference;
        return this;
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
                return reject();
            }
            let awaitsResult = false;
            if (this.sourceOfCompletions) {
                awaitsResult = true;
                this.sourceOfCompletions()!.then((sourceOfCompletions) => {
                    if (sourceOfCompletions == "expanded") {
                        ExpandedSourceManager.getExpandedSource(this.uri!).then((buffer) => {
                            const result = this.generateItemsFromCurrentBuffer(BufferSplitter.split(buffer.toString()), true);
                            VariableCompletion.cache.set(this.uri!, result);
                            return resolve([]);
                        }).catch((e) => {
                            return reject(e);
                        })
                    } else {
                        VariableCompletion.cache.set(this.uri!, this.generateItemsFromCurrentBuffer(<string[]>this.currentLines, false));
                        return resolve([]);
                    }
                })
            }
            if (!awaitsResult) {
                VariableCompletion.cache.set(this.uri!, this.generateItemsFromCurrentBuffer(<string[]>this.currentLines, false));
                return resolve([]);
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
        new Scan(buffer).scan(/^ +\d\d +(?:[\w\-]+)?(?:\(.*\))?([\w\-]+)(\s+|\.).*/gim, (iterator: any) => {
            const variable = CobolVariable.parseLines(iterator.row, lines, {noChildren: true, noScope: true, noSection: true, ignoreMethodReturn: true});
            if (!this.shouldIgnoreVariable(variable)) {
                const variableItem = this.createVariableCompletion(variable);
                itemsMap.set(variable.getName(), variableItem);
            }
        });

        new Scan(buffer).reverseScan(/^ \s\s\s\s\s\s([\w\-]+)\.(?:\s*\*\>.*)?/gm, this.lineNumber, (iteratorLimit: any) => {
            const limitLine = iteratorLimit.row;
            iteratorLimit.stop();
            new Scan(buffer).reverseScan(/^ +declare +(?:[\w\-]+) +as +(?:[\w\-]+).*/gim, this.lineNumber, (iterator: any) => {
                if (iterator.row < limitLine) {
                    iterator.stop();
                    return;
                }
                const variable = CobolVariable.parseLines(iterator.row, lines, {noChildren: true, noScope: true, noSection: true, ignoreMethodReturn: true});
                if (!this.shouldIgnoreVariable(variable)) {
                    const variableItem = this.createVariableCompletion(variable);
                    itemsMap.set(variable.getName(), variableItem);
                }
            });

        });

        // Merge the cache with the local variables
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
        if (this.considerOnlyObjectReference) {
            if (variable.getObjectReferenceOf()) {
                return false;
            } else {
                return true;
            }
        }
        if (this.ignoreDisplay && variable.isDisplay()) {
            // For now we don't parse constant values and since some constantes can have
            // numeric values we never filter them
            if (variable.getLevel() == CobolVariable.CONSTANT_LEVEL) {
                return false;
            }
            return true;
        }

        variable.getObjectReferenceOf()
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
        const variableName = variable.getName();
        return {
            label: variableName,
            textEdit: {
                newText: variableName,
                range: {
                    start: {line: this.lineNumber, character: this.rangeColumn},
                    end: {line: this.lineNumber, character: this.rangeColumn}
                }
            },
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
