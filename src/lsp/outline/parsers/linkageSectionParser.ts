import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { DocumentSymbol, Position, Range, SymbolKind } from 'vscode';
import { ContextType } from '../context/parentContext';

/**
 * Parser for the Linkage Section in COBOL code.
 * This class identifies and processes the "Linkage Section" in a COBOL source file.
 */
export class LinkageSectionParser implements SymbolParser {

  private regex = /^\s*linkage\s+section\./i;

  /**
   * Determines if the current line matches the "Linkage Section" declaration.
   * @param line The line of code to check.
   * @returns True if the line matches the "Linkage Section" declaration, false otherwise.
   */
  canParse(line: string): boolean {
    return this.regex.test(line);
  }

  /**
   * Closes parent contexts until a specific context type is reached.
   * This ensures that the "Linkage Section" is not nested within invalid parent contexts.
   * @param line The current line of code.
   * @param lineIndex The index of the current line.
   * @param context The parse context.
   */
  closeParents(line: string, lineIndex: number, context: ParseContext): void {
    let shouldCloseParents = true;
    while (shouldCloseParents) {
      const parentType = context.getParentType();
      if (parentType === undefined ||
        parentType === ContextType.Method ||
        parentType === ContextType.Object ||
        parentType === ContextType.Factory) {
        shouldCloseParents = false;
      } else {
        // Exit the current parent context.
        const position = new Position(lineIndex - 1, line.length);
        context.exitParent(position);
      }
    }
  }

  /**
   * Parses the "Linkage Section" declaration and adds it to the parse context.
   * @param line The current line of code.
   * @param lineIndex The index of the current line.
   * @param context The parse context.
   */
  parse(line: string, lineIndex: number, context: ParseContext): void {
    const symbol = new DocumentSymbol(
      'Linkage Section',
      '',
      SymbolKind.Namespace,
      new Range(lineIndex, 0, lineIndex, line.length),
      new Range(lineIndex, 0, lineIndex, line.length)
    );

    // Enter the "Linkage Section" as a new parent context.
    context.enterParent(symbol, ContextType.LinkageSection);
  }
}
