/**
 * Paragraph Documentation Extractor
 */
export class ParagraphDocumentationExtractor {

    /**
     * Returns the documentation of the paragraph on the specified line
     *
     * @param lines buffer lines
     * @param lineIndex line with the paragraph declaration which will have the documentation extracted
     */
    public getParagraphDocumentation(lines: string[], lineIndex: number): string[] {
        let documentation: string[] = [];
        for (let index = lineIndex - 1; index >= 0; index--) {
            let currentLineText = lines[index];
            if (currentLineText.startsWith("      *>")) {
                documentation.push(currentLineText);
            } else {
                break;
            }
        }
        documentation = documentation.reverse();
        return documentation;
    }
}