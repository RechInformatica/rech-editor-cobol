import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { ContextType } from '../context/parentContext';
import { DocumentSymbol, Position, Range, SymbolKind } from 'vscode';

/**
 * Parses the "Procedure Division" in a COBOL program.
 *
 * This parser identifies the "Procedure Division" declaration and
 * creates a corresponding document symbol in the outline.
 */
export class ProcedureDivisionParser implements SymbolParser {

  private procedureRegex = /^\s*procedure\s+division.*/i;

  /**
   * Determines if the parser can handle the given line.
   *
   * @param line - The line to check.
   * @returns `true` if the line matches the "Procedure Division" pattern.
   */
  canParse(line: string): boolean {
    return this.procedureRegex.test(line);
  }

  /**
   * Closes parent contexts until a specific context type is reached.
   *
   * @param line - The current line being parsed.
   * @param lineIndex - The index of the current line.
   * @param context - The parse context.
   */
  closeParents(line: string, lineIndex: number, context: ParseContext): void {
    while (
      context.getParentType() !== ContextType.Object &&
      context.getParentType() !== ContextType.Factory &&
      context.getParentType() !== ContextType.Method &&
      context.getParentType() !== undefined
    ) {
      context.exitParent(new Position(lineIndex - 1, line.length));
    }
  }

  /**
   * Parses a line and creates a "Procedure Division" symbol if applicable.
   *
   * @param line - The current line being parsed.
   * @param lineIndex - The index of the current line.
   * @param context - The parse context.
   */
  parse(line: string, lineIndex: number, context: ParseContext): void {
    if (this.procedureRegex.test(line)) {
      const symbol = new DocumentSymbol(
        'Procedure Division',
        '',
        SymbolKind.Namespace,
        new Range(lineIndex, 0, lineIndex, line.length),
        new Range(lineIndex, 0, lineIndex, line.length)
      );
      context.enterParent(symbol, ContextType.ProcedureDivision);
    }
  }
}
