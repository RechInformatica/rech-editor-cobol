import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol methods modifications
 */
export class MethodArgsCompletion implements CompletionInterface {

    private readonly existsArgsDeclared: boolean;

    constructor(existsArgsDeclared: boolean) {
        this.existsArgsDeclared = existsArgsDeclared;
    }

    public generate(line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const match = /(\s*method-id\.\s+)([^\s.()]+)\.?(.*)\.?/.exec(lines[line].trimEnd())
            if (match == null || match.length < 2) {
                return [];
            }
            let text = "";
            let label = 'Complete ARGUMENTS for method declaration';
            if (this.existsArgsDeclared) {
                label = 'Complete AS clause for method args declaration';
                text = this.getNewArgumentsText(match);
            } else {
                text = this.getInitialArgumentsText(match);
            }
            resolve(
                [{
                    label: label,
                    detail: 'Generates the arguments declaration for current method.',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "args () var as type",
                    additionalTextEdits: [CompletionUtils.createCleanLineTextEdit(line)],
                    preselect: true,
                    kind: CompletionItemKind.Keyword,
                    commitCharacters: ["("]
                }]
            );
        });
    }

    /**
     * Gets the initial arguments text for method declaration
     * @param match
     * @returns
     */
    private getInitialArgumentsText(match: RegExpExecArray): string {
        const initialText = match[1] + match[2];
        let terminateText = "";
        if (match.length > 3) {
            const modifyers = match[3].split(/[\s.]/g);
            for (const modifyer of modifyers) {
                const modify = modifyer.replace(".", "");
                terminateText = terminateText + " " + modify;
            }
        }
        return initialText.trimEnd() + "($1 as $2) " + terminateText.trim() + ".";
    }

    /**
     * Gets the new arguments text for method declaration
     * @param match
     * @returns
     */
    private getNewArgumentsText(match: RegExpExecArray): string {
        const newArgs = ", $1 as $2)";
        return match[0].replace(/,.*\)/, newArgs);
    }

}
