import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { CobolVariable, Type } from "./CobolVariable";
import { ExpandedSourceManager } from "../../cobol/ExpandedSourceManager";
import { reject } from "q";
import { CompletionConfig } from "./CompletionConfig";

// Cobol column for 'VALUE' clause declaration
const VALUE_COLUMN_DECLARATION = 51;

/**
 * Class to generate LSP Completion Items for Cobol value
 */
export class ValueCompletion implements CompletionInterface {

    /** Uri of source file */
    private uri: string | undefined
    /** Expanded source */
    private sourceLines: Map<string | undefined, string[]>
    /** Source of completions */
    private sourceOfCompletions: (() => Thenable<string>) | undefined;

    constructor(uri?: string, sourceOfCompletions?: () => Thenable<string>) {
        this.uri = uri;
        this.sourceOfCompletions = sourceOfCompletions;
        this.sourceLines = new Map();
    }

    public generate(line: number, column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            if (this.sourceOfCompletions) {
                this.sourceOfCompletions()!.then((sourceOfCompletions) => {
                    if (sourceOfCompletions == "expanded") {
                        ExpandedSourceManager.getExpandedSource(this.uri!).then((buffer) => {
                            this.sourceLines.set(this.uri, buffer.split("\n"));
                        }).catch((e) => {
                            return reject(e);
                        })
                    } else {
                        this.sourceLines.set(this.uri, lines);
                        return resolve([]);
                    }
                })
            }
            const currentLineText = lines[line];
            const bufferLines = this.sourceLines.get(this.uri);
            let variable;
            if (bufferLines) {
                variable = CobolVariable.parseLines(line, bufferLines);
            } else {
                variable = CobolVariable.parseLines(line, lines);
            }
            const text = this.generateTextFromVariable(variable, column, currentLineText);
            resolve([{
                label: 'Complete VALUE declaration',
                detail: 'VALUE clause will be inserted on the most appropriate place',
                insertText: text,
                insertTextFormat: InsertTextFormat.Snippet,
                filterText: "value",
                preselect: true,
                kind: CompletionItemKind.Variable
            }]);
        });
    }

    /**
     * Generate the value text from the specified variable and column number
     *
     * @param variable Cobol variable
     * @param column column
     * @param currentLineText current line text
     */
    private generateTextFromVariable(variable: CobolVariable, column: number, currentLineText: string): string {
        const verboseSuggestion = CompletionConfig.getVerboseSuggestion();
        let text = CompletionUtils.fillSpacesFromWordStart(VALUE_COLUMN_DECLARATION, column, currentLineText);
        text = text.concat(`value${verboseSuggestion ? " is " : " "}`);
        if (variable.getType() == Type.Alphanumeric) {
            text = text.concat("${1:spaces}");
        } else if (variable.getType() == Type.Typedef) {
            text = text.concat("${1}");
        }else {
            text = text.concat("${1:zeros}");
            if (!currentLineText.toUpperCase().includes("USAGE")) {
                text = text.concat(this.createCompIfNeeded(variable, verboseSuggestion));
            }
        }
        text = text.concat(".");
        return text;
    }

    /**
     * Create comp or comp-x text if needed
     *
     * @param variable Cobol variable
     */
    private createCompIfNeeded(variable: CobolVariable, verboseSuggestion: boolean): string {
        if (!variable.isDisplay()) {
            let text = (verboseSuggestion ? " " : "    ");
            if (variable.getType() == Type.Decimal || variable.isAllowNegative()) {
                return text.concat("${2:comp}");
            }
            return text.concat("${2:comp-x}");
        }
        return "";
    }

}
