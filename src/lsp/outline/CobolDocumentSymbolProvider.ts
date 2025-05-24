import { DocumentSymbolProvider, TextDocument, DocumentSymbol } from 'vscode';
import { ParseContext } from './context/parseContext';
import { SymbolDispatcher } from './dispatcher/symbolDispatcher';
import { ParagraphParser } from './parsers/paragraphParser';
import { VariableParser } from './parsers/variableParser';
import { FactoryParser } from './parsers/factoryParser';
import { ObjectParser } from './parsers/objectParser';
import { DataDivisionParser } from './parsers/dataDivisionParser';
import { MethodParser } from './parsers/methodParser';
import { CopyParser } from './parsers/copyParser';
import { ProcedureDivisionParser } from './parsers/procedureDivisionParser';
import { WorkingStorageSectionParser } from './parsers/WorkingStorageSectionParser';
import { LinkageSectionParser } from './parsers/linkageSectionParser';

/**
 * Provides document symbols for COBOL source files.
 *
 * This class implements the `DocumentSymbolProvider` interface to analyze
 * COBOL documents and extract their structure into a list of `DocumentSymbol` objects.
 * It uses a dispatcher pattern to delegate parsing to specific parsers for
 * different COBOL sections and constructs.
 */
export class CobolDocumentSymbolProvider implements DocumentSymbolProvider {
  /**
   * Analyzes a COBOL document and extracts its structure into a list of symbols.
   *
   * @param document - The COBOL document to analyze.
   * @returns A promise that resolves to a list of `DocumentSymbol` objects.
   */
  async provideDocumentSymbols(
    document: TextDocument
  ): Promise<DocumentSymbol[]> {
    const lines = document.getText().split(/\r?\n/);
    const context = new ParseContext(lines, document.uri);
    const dispatcher = new SymbolDispatcher();

    dispatcher.register(new FactoryParser());
    dispatcher.register(new ObjectParser());
    dispatcher.register(new WorkingStorageSectionParser());
    dispatcher.register(new LinkageSectionParser());
    dispatcher.register(new DataDivisionParser());
    dispatcher.register(new ProcedureDivisionParser());
    dispatcher.register(new MethodParser());
    dispatcher.register(new CopyParser());
    dispatcher.register(new ParagraphParser());
    dispatcher.register(new VariableParser());

    dispatcher.parseDocument(context);

    return context.symbols;
  }
}
