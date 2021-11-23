import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol methods modifications
 */
export class MethodModifyersCompletion implements CompletionInterface {

    private modification: string;

    constructor(modification: string) {
        this.modification = modification;
    }

    public generate(line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let text = lines[line].trimRight();
            let match = /(\s*method-id\.\s+)([^\s\.]+)\.?(.*)\.?/.exec(text)
            if (match == null || match.length < 2) {
                return [];
            }
            text = match[1] + match[2]
            if (match.length > 3) {
                let modifyers = match[3].split(/[\s\.]/g);
                for (let index = 0; index < modifyers.length; index++) {
                    const modify = modifyers[index].replace(".", "");
                    if (!this.modification.toUpperCase().startsWith(modify.trim().toUpperCase())) {
                        text = text + " " + modify;
                    }
                }
            }
            text = text + " " + this.modification + ".";
            resolve(
                [{
                    label: this.modification.toUpperCase() + ' to method declaration',
                    detail: 'Generates the ' + this.modification.toUpperCase() + ' declaration to current method.',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: this.modification,
                    additionalTextEdits: [CompletionUtils.createCleanLineTextEdit(line)],
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        });
    }

}
