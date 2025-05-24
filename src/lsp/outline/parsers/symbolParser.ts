import { ParseContext } from '../context/parseContext';

/**
 * Interface for parsers that identify and process specific COBOL constructs.
 *
 * Implementations of this interface should provide logic to determine
 * whether they can parse a given line, handle closing parent constructs,
 * and perform the actual parsing of the line.
 */
export interface SymbolParser {
  /**
   * Determines if the parser can handle the given line.
   *
   * @param line - The content of the line to be analyzed.
   * @param lineIndex - The index of the line in the document.
   * @param context - The parsing context containing state and metadata.
   * @returns `true` if the parser can process the line, otherwise `false`.
   */
  canParse(line: string, lineIndex: number, context: ParseContext): boolean;

  /**
   * Handles the logic for closing parent constructs if necessary.
   *
   * @param line - The content of the line being analyzed.
   * @param lineIndex - The index of the line in the document.
   * @param context - The parsing context containing state and metadata.
   */
  closeParents(line: string, lineIndex: number, context: ParseContext): void;

  /**
   * Performs the parsing of the given line and updates the context accordingly.
   *
   * @param line - The content of the line to be parsed.
   * @param lineIndex - The index of the line in the document.
   * @param context - The parsing context containing state and metadata.
   */
  parse(line: string, lineIndex: number, context: ParseContext): void;
}
