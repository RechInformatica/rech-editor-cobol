import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { DocumentSymbol, Position, Range, SymbolKind } from 'vscode';
import { ContextType } from '../context/parentContext';

/**
 * Parses variable declarations in a COBOL program.
 *
 * This parser identifies variable declarations, constants, and condition names,
 * creating corresponding document symbols in the outline.
 */
export class DeclareVariableParser implements SymbolParser {

  private regex = /^\s*declare\s+([\w-]+)\s+as\s+(\S+)?\./i;
  private match: RegExpExecArray | null = null;

  /**
   * Determines if the current line can be parsed as a variable declaration.
   *
   * @param line - The line to check.
   * @returns `true` if the line matches the variable declaration pattern.
   */
  canParse(line: string): boolean {
    this.match = this.regex.exec(line);
    return this.match !== null;
  }

  /**
   * Closes parent symbols in the context based on the current line's level.
   *
   * @param line - The current line being parsed.
   * @param lineIndex - The index of the current line.
   * @param context - The parsing context.
   */
  closeParents(line: string, lineIndex: number, context: ParseContext): void {
    if (context.getParentType() === ContextType.DeclareVariable) {
      const endPos = new Position(lineIndex - 1, line.length);
      context.exitParent(endPos);
    }
  }

  /**
   * Parses the current line and adds the corresponding symbol to the context.
   *
   * @param line - The current line being parsed.
   * @param lineIndex - The index of the current line.
   * @param context - The parsing context.
   */
  parse(line: string, lineIndex: number, context: ParseContext): void {
    if (!this.match) return;

    const varName = this.match[1];
    const detail = this.match[2]?.replace('as', '').trim() || '';

    let kind = SymbolKind.Variable;

    const symbol = new DocumentSymbol(
      varName,
      detail,
      kind,
      new Range(lineIndex, 0, lineIndex, line.length),
      new Range(lineIndex, 0, lineIndex, line.length)
    );

    context.enterParent(symbol, ContextType.DeclareVariable);
  }
}
