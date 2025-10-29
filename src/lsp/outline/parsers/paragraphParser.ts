import { SymbolParser } from './symbolParser';
import { ParseContext } from '../context/parseContext';
import { DocumentSymbol, Position, Range, SymbolKind } from 'vscode';
import { ContextType } from '../context/parentContext';

/**
 * The `ParagraphParser` class is responsible for parsing COBOL paragraph definitions
 * and creating corresponding symbols for them in the document outline.
 */
export class ParagraphParser implements SymbolParser {

  private regex = /^ \s{6}([\w-]+)\.(?:\s*\*>.*)?/;
  private reservedWords = ['program-id', 'class-id', 'special-names', 'repository'];

  /**
   * Determines if the given line can be parsed as a paragraph.
   * @param line The line to check.
   * @returns True if the line matches the paragraph pattern and is not a reserved word.
   */
  canParse(line: string): boolean {
    const lower = line.toLowerCase();
    if (this.reservedWords.some(word => lower.includes(word))) {
      return false;
    }
    return this.regex.test(line);
  }

  /**
   * Closes the current paragraph context if one is open.
   * @param line The current line being processed.
   * @param lineIndex The index of the current line.
   * @param context The parsing context.
   */
  closeParents(line: string, lineIndex: number, context: ParseContext): void {
    while (context.getParentType() === ContextType.Paragraph || context.getParentType() === ContextType.DeclareVariable) {
      if (context.getParentType() === ContextType.Paragraph) {
        const endPos = new Position(lineIndex - 1, line.length);
        context.exitParent(endPos);
      } else if (context.getParentType() === ContextType.DeclareVariable) {
        const endPos = context.getCurrentParent()?.selectionRange.end || new Position(lineIndex - 1, line.length);
        context.exitParent(endPos);
      }
    }
  }

  /**
   * Parses a line to extract a paragraph symbol and updates the parsing context.
   * @param line The line to parse.
   * @param lineIndex The index of the current line.
   * @param context The parsing context.
   */
  parse(line: string, lineIndex: number, context: ParseContext): void {
    const match = this.regex.exec(line);
    if (!match || !match[1]) return;

    const name = match[1];

    const symbol = new DocumentSymbol(
      name,
      '',
      SymbolKind.Function,
      new Range(lineIndex, 0, lineIndex, line.length),
      new Range(lineIndex, 0, lineIndex, line.length)
    );

    context.enterParent(symbol, ContextType.Paragraph);
  }
}
