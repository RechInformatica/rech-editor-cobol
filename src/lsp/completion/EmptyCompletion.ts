import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { CobolVariable, Type } from "./CobolVariable";

/**
 * Empty implementation of completion interface
 */
export class EmptyCompletion implements CompletionInterface {

    public generate(_line: number, _column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            resolve([]);
        });
    }

}
