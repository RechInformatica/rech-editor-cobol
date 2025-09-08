import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { DocumentSymbol, Position, Range, SymbolKind } from 'vscode';
import { ContextType } from '../context/parentContext';

/**
 * Parser for handling COBOL `COPY` statements in the source code.
 * This parser identifies `COPY` statements and extracts relevant information
 * such as the copybook name and optional replacing text.
 */
export class CopyParser implements SymbolParser {

    private regex = /^\s*copy\s+([\w.-]+)(\s+replacing.+?)?\./i;
    private match: RegExpExecArray | null = null;

    /**
     * Determines if the current line can be parsed as a `COPY` statement.
     * @param line The line of code to check.
     * @returns True if the line matches the `COPY` statement pattern, otherwise false.
     */
    canParse(line: string): boolean {
        this.match = this.regex.exec(line);
        return this.match !== null;
    }

    /**
     * Handles closing parent symbols. This parser does not require any specific
     * logic for closing parent symbols, so this method is a no-op.
     * @param line The current line of code.
     * @param lineIndex The index of the current line.
     * @param context The parsing context.
     */
    closeParents(line: string, lineIndex: number, context: ParseContext): void {
        while (context.getParentType() !== undefined && context.getParentType() !== ContextType.DataDivision &&
               context.getParentType() !== ContextType.WorkingStorageSection && context.getParentType() !== ContextType.ProcedureDivision &&
               context.getParentType() !== ContextType.LinkageSection && context.getParentType() !== ContextType.Method &&
               context.getParentType() !== ContextType.Paragraph) {
            const endPos = context.getCurrentParent()?.selectionRange.end || new Position(lineIndex - 1, line.length);
            context.exitParent(endPos);
        }
    }

    /**
     * Parses a `COPY` statement and adds a corresponding symbol to the context.
     * @param line The line of code to parse.
     * @param lineIndex The index of the current line.
     * @param context The parsing context to which the symbol will be added.
     */
    parse(line: string, lineIndex: number, context: ParseContext): void {
        if (!this.match) return;

        const copyName = this.match[1]; // Extract the copybook name.
        const replacingText = this.match[2]?.trim(); // Extract optional replacing text.

        const detail = replacingText ? `${replacingText}` : '';

        // Create a DocumentSymbol representing the `COPY` statement.
        const symbol = new DocumentSymbol(
            copyName,
            detail,
            SymbolKind.File,
            new Range(lineIndex, 0, lineIndex, line.length),
            new Range(lineIndex, 0, lineIndex, line.length)
        );

        // Add the symbol to the parsing context.
        context.addSymbol(symbol);
        context.exitParent(new Position(lineIndex, line.length));
    }
}
