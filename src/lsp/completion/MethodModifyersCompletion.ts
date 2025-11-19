import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol methods modifications
 */
export enum MethodModifier {
    RETURNING = "returning",
    PUBLIC = "public",
    PROTECTED = "protected",
    STATIC = "static",
    OVERRIDE = "override"
}

export class MethodModifyersCompletion implements CompletionInterface {

    private modification: MethodModifier | string;

    constructor(modification: MethodModifier | string) {
        this.modification = modification;
    }

    public generate(line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const match = /(\s*method-id\.\s+)([^\s.()]+)\.?(.*)\.?/.exec(lines[line].trimEnd())
            if (match == null || match.length < 2) {
                return [];
            }
            const initialText = match[1] + match[2]
            let text = "";
            let terminateText = "";
            if (match.length > 3) {
                const finalDotPos = match[3].lastIndexOf(".");
                const modifyers = match[3].substring(0, finalDotPos).split(/[\s.]/g);
                for (let index = 0; index < modifyers.length; index++) {
                    const modify = modifyers[index].replace(".", "");
                    if (!this.modification.toUpperCase().startsWith(modify.trim().toUpperCase())) {
                        if (this.verifyTerminatedModifier(modify)) {
                            terminateText = terminateText + " " + modify;
                        } else {
                            if (modify.trim().toLowerCase() == MethodModifier.RETURNING) {
                                let indexReturning = index;
                                while (indexReturning < modifyers.length) {
                                    const returningModifyer = modifyers[indexReturning].replace(".", "");
                                    text = text + " " + returningModifyer;
                                    indexReturning++;
                                }
                                break;
                            }
                            if (text.length > 0) {
                                text = text + " " + modify;
                            } else {
                                text = modify;
                            }
                        }
                    }
                }
            }
            text = text + " " + this.modification + (this.modification == MethodModifier.RETURNING ? " $1" : "") + terminateText + ".";
            text = text.replace(/\s+/g, ' ');
            text = initialText + text;
            resolve(
                [{
                    label: 'Complete ' + this.modification.toUpperCase() + ' to method declaration',
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

    /**
     * Verifies if the modifier is a terminated one
     * @param text
     * @returns
     */
    private verifyTerminatedModifier(text: string): boolean {
        const terminatedModifiers = [MethodModifier.OVERRIDE, MethodModifier.STATIC, MethodModifier.PROTECTED, MethodModifier.PUBLIC];
        return terminatedModifiers.includes(text.trim().toLowerCase() as MethodModifier);
    }

}
