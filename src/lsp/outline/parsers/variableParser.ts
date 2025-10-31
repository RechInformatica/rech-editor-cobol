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
export class VariableParser implements SymbolParser {

  private regex = /^\s*(\d{2})\s+([\w-]+)(?:\s+((?:[^."]|"[^"]*")+))?\./i;
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
    if (!this.match) return;

    const level = parseInt(this.match[1], 10);

    // Special handling for level 78 (constants)
    if (level === 78) {
      let isParentVariable = false;
      while (!isParentVariable) {
        const parentType = context.getParentType();
        if (parentType == ContextType.Variable) {
          context.exitParent(new Position(lineIndex - 1, line.length));
          continue;
        }
        isParentVariable = true;
      }
    }

    // Close parents with levels greater than or equal to the current level
    let foundLevel = false;
    while (!foundLevel) {
      const parent = context.getCurrentParent();
      if (parent) {
        const parentLine = parent.range.start.line;
        const parentMatch = this.regex.exec(context.lines[parentLine]);
        if (parentMatch) {
          const parentLevel = parseInt(parentMatch[1], 10);
          if (parentLevel >= level) {
            context.exitParent(new Position(lineIndex - 1, line.length));
            continue;
          }
        }
      }
      foundLevel = true;
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

    const level = parseInt(this.match[1], 10);
    const varName = this.match[2];
    const detail = this.match[3]?.replace('object reference', '').replace('pic', '').trim() || '';

    let kind = SymbolKind.Variable;
    if (level === 78) {
      kind = SymbolKind.Constant;
    } else if (level === 88) {
      kind = SymbolKind.EnumMember;
    }

    const symbol = new DocumentSymbol(
      varName,
      detail,
      kind,
      new Range(lineIndex, 0, lineIndex, line.length),
      new Range(lineIndex, 0, lineIndex, line.length)
    );

    // Add the symbol to the context or set it as a parent based on its level
    if (level === 88 || level === 78) {
      context.addSymbol(symbol);
    } else {
      context.enterParent(symbol, ContextType.Variable);
    }
  }
}
