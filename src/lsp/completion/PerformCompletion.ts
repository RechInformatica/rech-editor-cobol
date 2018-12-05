import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";

/**
 * Class to generate LSP Completion Items for Cobol 'perform' clause
 */
export class PerformCompletion implements CompletionInterface {

    public generate(_line: number, column: number, _lines: string[]): CompletionItem[] {
        let text = "PERFORM" + CompletionUtils.fillMissingSpaces(35, column + 6) + "${0}" + CompletionUtils.separatorForColumn(column);
        return [{
            label: 'Completar chamada de parágrafo',
            detail: 'Completa a chamada do parágrafo.',
            insertText: text,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: "PE",
            preselect: true,
            kind: CompletionItemKind.Keyword,
            data: 2
        }];
    }

}