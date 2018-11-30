import { ParserCobol } from "../cobol/parsercobol";
import { CobolDocParser } from "../cobol/rechdoc/CobolDocParser";
import { MarkupKind, CompletionItemKind, CompletionItem } from "vscode-languageserver";

/**
 * Class to generate LSP Completion Items for Cobol paragraphs declarations
 */
export class ParagraphCompletion {

    /** Cobol parser */
    private parserCobol: ParserCobol;
    /** Cobol documentation parser */
    private cobolDocParser: CobolDocParser;

    constructor() {
        this.parserCobol = new ParserCobol();
        this.cobolDocParser = new CobolDocParser();
    }

    /**
     * Generates completion items for Cobol paragraphs
     * 
     * @param lines Cobol source code lines
     */
    public generateCompletionItems(lines: string[]): CompletionItem[] {
        let items: CompletionItem[] = [];
        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            let currentLineText = lines[lineIndex];
            let paragraphName = this.parserCobol.getDeclaracaoParagrafo(currentLineText.toString());
            let docArray = this.getParagraphDocumentation(lines, lineIndex);
            if (paragraphName && docArray.length > 0) {
                let paragraphItem = this.createParagraphCompletion(paragraphName, docArray);
                items.push(paragraphItem);
            }
        }
        return items;
    }

    /**
     * Creates and pushes a completion item for the specified paragraph
     * 
     * @param paragraph paragraph name
     * @param docArray documentation array
     */
    private createParagraphCompletion(paragraph: string, docArray: string[]): CompletionItem {
        let cobolDoc = this.cobolDocParser.parseCobolDoc(docArray);
        return {
            label: paragraph,
            detail: cobolDoc.comment,
            documentation: {
                kind: MarkupKind.Markdown,
                value: cobolDoc.elementsAsMarkdown()
            },
            kind: CompletionItemKind.Method
        };
    }

    /**
     * Returns the documentation of the paragraph on the specified line
     * 
     * @param lines buffer lines
     * @param lineIndex line with the paragraph declaration which will have the documentation extracted
     */
    private getParagraphDocumentation(lines: string[], lineIndex: number): string[] {
        let documentation: string[] = [];
        for (let index = lineIndex - 1; index >= 0; index--) {
            let currentLineText = lines[index];
            if (currentLineText.trim().startsWith("*>")) {
                documentation.push(currentLineText);
            } else {
                break;
            }
        }
        documentation = documentation.reverse();
        return documentation;
    }

}