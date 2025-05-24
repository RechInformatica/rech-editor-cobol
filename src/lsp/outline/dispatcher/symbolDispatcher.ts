import { SymbolParser } from '../parsers/symbolParser';
import { ParseContext } from '../context/parseContext';
import { Position, Range } from 'vscode';

/**
 * The `SymbolDispatcher` class is responsible for managing and dispatching
 * symbol parsers to process lines of a document. It allows registering
 * multiple parsers and delegates the parsing logic to the appropriate parser
 * based on the line content and context.
 */
export class SymbolDispatcher {
  private parsers: SymbolParser[] = [];

  /**
   * Registers a new symbol parser.
   * @param parser The parser to be registered.
   */
  register(parser: SymbolParser) {
    this.parsers.push(parser);
  }

  /**
   * Parses the document line by line using the registered parsers.
   * Each line is processed by the first parser that can handle it.
   * @param context The parsing context containing document lines and state.
   */
  parseDocument(context: ParseContext) {
    context.lines.forEach((line, i) => {
      for (const parser of this.parsers) {
        // Check if the parser can handle the current line
        if (parser.canParse(line, i, context)) {
          // Close any open parent structures before parsing
          parser.closeParents(line, i, context);
          // Parse the current line
          parser.parse(line, i, context);
          break; // Stop checking other parsers for this line
        }
      }
    });
    // Ensure all parent structures are properly closed after parsing
    context.exitAllParents();
  }
}
