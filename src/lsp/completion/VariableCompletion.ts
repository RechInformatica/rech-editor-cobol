import { CompletionItemKind, CompletionItem, InsertTextFormat, MarkupKind } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { Scan } from "../../commons/Scan";
import { CobolVariable } from "./CobolVariable";
import { CobolDocParser } from "../../cobol/rechdoc/CobolDocParser";
import { VariableUtils } from "../../commons/VariableUtils";

/**
 * Class to generate LSP Completion Items for Cobol variables
 */
export class VariableCompletion implements CompletionInterface {

    /** Cobol documentation parser */
    private cobolDocParser: CobolDocParser;
    /** Ignore enumerations (88 variables) */
    private ignoreEnums: boolean = false;
    /** Ignore display variables */
    private ignoreDisplay: boolean = false;

    constructor() {
        this.cobolDocParser = new CobolDocParser();
    }

    public generate(_line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let items: CompletionItem[] = [];
            let itemsMap = this.generateItemsFromCurrentBuffer(lines);
            for (let value of itemsMap.values()) {
                items.push(value);
            }
            resolve(items);
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
     * Generates completion items from the current source
     *
     * @param lines buffer lines
     */
    private generateItemsFromCurrentBuffer(lines: string[]): Map<string, CompletionItem> {
        let itemsMap: Map<string, CompletionItem> = new Map;
        let buffer = lines.join("\n");
        new Scan(buffer).scan(/^\s+\d\d\s+(?:[\w\-]+)?(?:\(.*\))?([\w\-]+)(\s+|\.).*/gm, (iterator: any) => {
            let variable = CobolVariable.parseLine(iterator.lineContent.toString());
            if (!this.shouldIgnoreVariable(variable)) {
                let docArray = VariableUtils.findVariableDocArray(lines, iterator.row);
                let variableItem = this.createVariableCompletion(variable, docArray);
                itemsMap.set(variable.getName(), variableItem);
            }
        });
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
    private createVariableCompletion(variable: CobolVariable, docArray: string[]): CompletionItem {
        let cobolDoc = this.cobolDocParser.parseCobolDoc(docArray);
        let variableKind = this.getAppropriateKind(variable);
        return {
            label: variable.getName(),
            detail: cobolDoc.comment.join(" "),
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

}