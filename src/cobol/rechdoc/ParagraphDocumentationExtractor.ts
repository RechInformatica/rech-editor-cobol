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
            if (currentLineText.startsWith("      *>") && !this.isSeparatorComment(currentLineText)) {
                documentation.push(currentLineText);
            } else {
                break;
            }
        }
        documentation = documentation.reverse();
        return documentation;
    }

    /**
     * Returns true if the comment represents a separator
     *
     * @param comment comment line to be tested
     */
    private isSeparatorComment(comment: string): boolean {
        return comment.trim().includes("*>--------------------------------------------------------------------------------------------------------------<*");

    }
}