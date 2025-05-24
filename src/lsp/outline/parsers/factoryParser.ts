import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { ContextType } from '../context/parentContext';
import { DocumentSymbol, Position, Range, SymbolKind } from 'vscode';

/**
 * FactoryParser is responsible for parsing "factory" blocks in the source code.
 * It identifies the start and end of a "factory" block and updates the parsing context accordingly.
 */
export class FactoryParser implements SymbolParser {

  private startRegex = /^\s*factory\./i;
  private matchStart: RegExpExecArray | null = null;
  private endRegex = /^\s*end\s+factory\./i;
  private matchEnd: RegExpExecArray | null = null;

  /**
   * Determines if the current line can be parsed as part of a "factory" block.
   * @param line - The current line of code.
   * @returns True if the line matches the start or end of a "factory" block.
   */
  canParse(line: string): boolean {
    this.matchStart = this.startRegex.exec(line);
    this.matchEnd = this.endRegex.exec(line);
    return this.matchStart !== null || this.matchEnd !== null;
  }

  /**
   * Closes any open parent contexts if the current line marks the end of a "factory" block.
   * @param line - The current line of code.
   * @param lineIndex - The index of the current line.
   * @param context - The parsing context.
   */
  closeParents(line: string, lineIndex: number, context: ParseContext): void {
    if (!this.matchEnd) return;

    // Exit all parent contexts until no parent context remains
    while (context.getParentType() !== undefined) {
      context.exitParent(new Position(lineIndex, line.length));
    }
  }

  /**
   * Parses the current line as the start of a "factory" block and updates the parsing context.
   * @param line - The current line of code.
   * @param lineIndex - The index of the current line.
   * @param context - The parsing context.
   */
  parse(line: string, lineIndex: number, context: ParseContext): void {
    if (!this.matchStart) return;

    // Create a new DocumentSymbol for the "factory" block
    const symbol = new DocumentSymbol(
      'Factory',
      'Static area of the program',
      SymbolKind.Class,
      new Range(lineIndex, 0, lineIndex, line.length),
      new Range(lineIndex, 0, lineIndex, line.length)
    );
    context.enterParent(symbol, ContextType.Factory);
  }
}
