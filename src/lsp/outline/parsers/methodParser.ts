import * as vscode from 'vscode';
import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { ContextType } from '../context/parentContext';

/**
 * The `MethodParser` class is responsible for parsing COBOL method definitions
 * and their corresponding end statements. It implements the `SymbolParser` interface
 * to identify and process method symbols in the document.
 */
export class MethodParser implements SymbolParser {

    private startRegex = /^\s*method-id\.\s+([a-z0-9\-]+)(?:\s+private)?\./i;
    private matchStart: RegExpExecArray | null = null;
    private endRegex = /^\s*end\s+method\./i;
    private matchEnd: RegExpExecArray | null = null;

    /**
     * Determines if the current line can be parsed as either the start or end
     * of a COBOL method definition.
     *
     * @param line - The current line of text to evaluate.
     * @returns `true` if the line matches the start or end of a method, otherwise `false`.
     */
    canParse(line: string): boolean {
        this.matchStart = this.startRegex.exec(line);
        this.matchEnd = this.endRegex.exec(line);
        return this.matchStart !== null || this.matchEnd !== null;
    }

    /**
     * Closes any open parent contexts until the current context is a method or undefined.
     * This is triggered when an `end method.` statement is encountered.
     *
     * @param line - The current line of text being processed.
     * @param lineIndex - The index of the current line in the document.
     * @param context - The parsing context used to manage parent symbols.
     */
    closeParents(line: string, lineIndex: number, context: ParseContext): void {
        if (!this.matchEnd) return;

        const endPos = new vscode.Position(lineIndex, line.length);
        while (context.getParentType() !== ContextType.Method &&
            context.getParentType() !== undefined) {
            context.exitParent(endPos);
        }
        context.exitParent(endPos);
    }

    /**
     * Parses a line that starts a COBOL method definition and creates a corresponding
     * `DocumentSymbol` for the method. The symbol is added to the parsing context.
     *
     * @param line - The current line of text being processed.
     * @param lineIndex - The index of the current line in the document.
     * @param context - The parsing context used to manage parent symbols.
     */
    parse(line: string, lineIndex: number, context: ParseContext): void {
        if (!this.matchStart) return;

        const methodName = this.matchStart[1];

        const symbol = new vscode.DocumentSymbol(
            methodName,
            '',
            vscode.SymbolKind.Method,
            new vscode.Range(lineIndex, 0, lineIndex, line.length),
            new vscode.Range(lineIndex, 0, lineIndex, line.length)
        );
        context.enterParent(symbol, ContextType.Method);
    }
}
