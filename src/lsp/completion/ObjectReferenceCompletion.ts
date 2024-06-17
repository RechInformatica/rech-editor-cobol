import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

// Cobol column for 'OBJECT REFERENCE' clause declaration
const OBJECT_REFERENCE_COLUMN_DECLARATION = 35;
/**
 * Class to generate LSP Completion Items for Cobol object reference
 */
export class ObjectReferenceCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            const text =  CompletionUtils.fillSpacesFromWordStart(OBJECT_REFERENCE_COLUMN_DECLARATION, column, _lines[_line]) + "object reference $1";
            resolve(
                [{
                    label: 'Complete OBJECT REFERENCE declaration',
                    detail: 'OBJECT REFERENCE clause will be inserted on the most appropriate place.',
                    insertText: text,
                    insertTextFormat: InsertTextFormat.Snippet,
                    filterText: "object reference",
                    preselect: true,
                    kind: CompletionItemKind.Keyword
                }]
            );
        })
    }

}
