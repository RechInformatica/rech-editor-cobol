import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { ContextType } from '../context/parentContext';
import { DocumentSymbol, Position, Range, SymbolKind } from 'vscode';

/**
 * ObjectParser is responsible for parsing COBOL object blocks.
 * It identifies the start and end of an object block and updates the parse context accordingly.
 */
export class ObjectParser implements SymbolParser {

  private startRegex = /^\s*object\./i;
  private matchStart: RegExpExecArray | null = null;
  private endRegex = /^\s*end\s+object\./i;
  private matchEnd: RegExpExecArray | null = null;

  /**
   * Determines if the current line can be parsed as part of an object block.
   * @param line The current line of code.
   * @returns True if the line matches the start or end of an object block.
   */
  canParse(line: string): boolean {
    this.matchStart = this.startRegex.exec(line);
    this.matchEnd = this.endRegex.exec(line);
    return this.matchStart !== null || this.matchEnd !== null;
  }

  /**
   * Closes parent contexts when the end of an object block is encountered.
   * @param line The current line of code.
   * @param lineIndex The index of the current line.
   * @param context The parse context.
   */
  closeParents(line: string, lineIndex: number, context: ParseContext): void {
    if (!this.matchEnd) return;
    while (context.getParentType() !== undefined) {
      context.exitParent(new Position(lineIndex, line.length));
    }
  }

  /**
   * Parses the start of an object block and updates the parse context.
   * @param line The current line of code.
   * @param lineIndex The index of the current line.
   * @param context The parse context.
   */
  parse(line: string, lineIndex: number, context: ParseContext): void {
    if (!this.matchStart) return;

    const symbol = new DocumentSymbol(
      'Object',
      'Object area of the program',
      SymbolKind.Class,
      new Range(lineIndex, 0, lineIndex, line.length),
      new Range(lineIndex, 0, lineIndex, line.length)
    );
    context.enterParent(symbol, ContextType.Object);
  }
}
