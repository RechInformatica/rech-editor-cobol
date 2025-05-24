import { DocumentSymbol, Uri, Position, Range } from 'vscode';
import { ParentContext, ContextType } from './parentContext';

/**
 * The ParseContext class is responsible for managing the parsing context of a document.
 * It keeps track of parent symbols, child symbols, and their relationships.
 */
export class ParseContext {
  public parentStack: ParentContext[] = [];
  public symbols: DocumentSymbol[] = [];
  public lines: string[];
  public uri: Uri;

  /**
   * Constructor for ParseContext.
   * @param lines - The lines of the document being parsed.
   * @param uri - The URI of the document being parsed.
   */
  constructor(lines: string[], uri: Uri) {
    this.lines = lines;
    this.uri = uri;
  }

  /**
   * Adds a symbol to the current context. If there is a parent context, the symbol
   * is added as a child of the current parent. Otherwise, it is added as a top-level symbol.
   * @param symbol - The symbol to add.
   */
  public addSymbol(symbol: DocumentSymbol) {
    const currentParent = this.getCurrentParent();
    if (currentParent) {
      currentParent.children.push(symbol);
    } else {
      this.symbols.push(symbol);
    }
  }

  /**
   * Enters a new parent context by adding the symbol to the current context
   * and pushing it onto the parent stack.
   * @param symbol - The symbol representing the parent context.
   * @param type - The type of the parent context.
   */
  public enterParent(symbol: DocumentSymbol, type: ContextType) {
    this.addSymbol(symbol);
    this.parentStack.push(new ParentContext(symbol, type));
  }

  /**
   * Exits the current parent context by popping it from the stack and updating
   * its range to include the provided end position.
   * @param endPosition - The position where the parent context ends.
   */
  public exitParent(endPosition: Position) {
    const exited = this.parentStack.pop();
    if (exited) {
      exited.getSymbol().range = new Range(exited.getSymbol().range.start, endPosition);
    }
  }

  /**
   * Exits all parent contexts by iterating through the stack and closing each one.
   * This ensures that all open contexts are properly closed.
   */
  public exitAllParents() {
    while (true) {
      const symbol = this.getCurrentParent();
      if (symbol === undefined) {
        break;
      }
      const position = new Position(this.lines.length, this.lines[this.lines.length - 1].length);
      this.exitParent(position);
    }
  }

  /**
   * Retrieves the current parent symbol from the top of the parent stack.
   * @returns The current parent symbol, or undefined if there is no parent.
   */
  public getCurrentParent(): DocumentSymbol | undefined {
    return this.parentStack[this.parentStack.length - 1]?.getSymbol();
  }

  /**
   * Retrieves the type of the current parent context from the top of the parent stack.
   * @returns The type of the current parent context, or undefined if there is no parent.
   */
  public getParentType(): ContextType | undefined {
    return this.parentStack[this.parentStack.length - 1]?.getType();
  }
}
