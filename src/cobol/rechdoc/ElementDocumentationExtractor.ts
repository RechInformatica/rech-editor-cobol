/**
 * Element Documentation Extractor
 */
export class ElementDocumentationExtractor {

    /**
     * Returns the documentation of the element on the specified line
     *
     * @param lines buffer lines
     * @param lineIndex line with the element declaration which will have the documentation extracted
     */
    public getElementDocumentation(lines: string[], lineIndex: number): string[] {
        let documentation: string[] = [];
        for (let index = lineIndex - 1; index >= 0; index--) {
            const currentLineText = lines[index];
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