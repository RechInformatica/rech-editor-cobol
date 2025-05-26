import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { DocumentSymbol, Position, Range, SymbolKind } from 'vscode';
import { ContextType } from '../context/parentContext';

/**
 * Parses the "Working-Storage Section" in a COBOL program.
 *
 * This parser identifies the "Working-Storage Section" declaration and
 * creates a corresponding document symbol in the outline.
 */
export class WorkingStorageSectionParser implements SymbolParser {

  private regex = /^\s*working-storage\s+section\./i;

  /**
   * Determines if the given line matches the "Working-Storage Section" pattern.
   *
   * @param line - The line to check.
   * @returns `true` if the line matches, otherwise `false`.
   */
  canParse(line: string): boolean {
    return this.regex.test(line);
  }

  /**
   * Closes parent contexts that are not valid within the "Working-Storage Section".
   *
   * @param line - The current line being parsed.
   * @param lineIndex - The index of the current line.
   * @param context - The parse context.
   */
  closeParents(line: string, lineIndex: number, context: ParseContext): void {
    while (true) {
      const parentType = context.getParentType();
      if (
        parentType === undefined ||
        parentType === ContextType.Method ||
        parentType === ContextType.Object ||
        parentType === ContextType.Factory
      ) break;

      // Exit the current parent context if it is not valid for this section.
      const position = new Position(lineIndex - 1, line.length);
      context.exitParent(position);
    }
  }

  /**
   * Parses the "Working-Storage Section" and adds it as a symbol in the context.
   *
   * @param line - The current line being parsed.
   * @param lineIndex - The index of the current line.
   * @param context - The parse context.
   */
  parse(line: string, lineIndex: number, context: ParseContext): void {
    const symbol = new DocumentSymbol(
      'Working-Storage Section',
      '',
      SymbolKind.Namespace,
      new Range(lineIndex, 0, lineIndex, line.length),
      new Range(lineIndex, 0, lineIndex, line.length)
    );

    // Enter the "Working-Storage Section" as a parent context.
    context.enterParent(symbol, ContextType.WorkingStorageSection);
  }
}
