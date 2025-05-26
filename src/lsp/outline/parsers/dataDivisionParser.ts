import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { ContextType } from '../context/parentContext';
import { DocumentSymbol, Position, Range, SymbolKind } from 'vscode';

/**
 * Parser for the "Data Division" section in COBOL files.
 * This class implements the SymbolParser interface to identify and parse
 * the "Data Division" section, creating a corresponding symbol in the document.
 */
export class DataDivisionParser implements SymbolParser {

  private regex = /^\s*data\s+division\./i;
  private match: RegExpExecArray | null = null;

  /**
   * Determines if the current line can be parsed as a "Data Division" declaration.
   * @param line The line of text to check.
   * @returns True if the line matches the "Data Division" pattern, false otherwise.
   */
  canParse(line: string): boolean {
    this.match = this.regex.exec(line);
    return this.match !== null;
  }

  /**
   * Closes parent contexts if necessary. This implementation does nothing
   * as "Data Division" does not require closing any parent contexts.
   * @param _line The current line of text (unused).
   * @param _lineIndex The index of the current line (unused).
   * @param _context The parse context (unused).
   */
  closeParents(_line: string, _lineIndex: number, _context: ParseContext): void {
    return;
  }

  /**
   * Parses the "Data Division" declaration and adds it as a symbol to the context.
   * @param line The line of text containing the "Data Division" declaration.
   * @param lineIndex The index of the current line.
   * @param context The parse context to update with the new symbol.
   */
  parse(line: string, lineIndex: number, context: ParseContext): void {
    if (!this.match) return;

    // Create a new DocumentSymbol for the "Data Division".
    const symbol = new DocumentSymbol(
      'Data Division',
      '',
      SymbolKind.Namespace,
      new Range(lineIndex, 0, lineIndex, line.length),
      new Range(lineIndex, 0, lineIndex, line.length)
    );

    // Enter the "Data Division" context in the parse context.
    context.enterParent(symbol, ContextType.DataDivision);
  }
}
