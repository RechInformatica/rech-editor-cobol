import { CompletionItemKind, CompletionItem, MarkupKind } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { ParserCobol } from "../../cobol/parsercobol";
import { CobolDocParser } from "../../cobol/rechdoc/CobolDocParser";
import { ExpandedSourceManager } from "../../cobol/ExpandedSourceManager";
import { Scan } from "../../commons/Scan";
import { CobolVariable } from "./CobolVariable";
import { BufferSplitter } from "../../commons/BufferSplitter";

/**
 * Class to generate LSP Completion Items for Cobol 'add' clause
 */
export class ClassCompletion implements CompletionInterface {

  /** Cache of completion itens of the last source preprocessed*/
  private static cache: Map<string, CompletionItem> | undefined;
  /** File name of the source in cahce */
  private static cacheSourceFileName: string;
  /** Cobol parser */
  private parserCobol: ParserCobol;
  /** Cobol documentation parser */
  private cobolDocParser: CobolDocParser;
  /** Cache file name */
  private cacheFileName: string;
  /** uri of file */
  private uri: string;
  /** Current lines in the source */
  private currentLines: string[] | undefined;
  /** Source of completions */
  private sourceOfCompletions: Thenable<string>;


  constructor(cacheFileName: string, uri: string, sourceOfCompletions: Thenable<string>) {
    this.parserCobol = new ParserCobol();
    this.cobolDocParser = new CobolDocParser();
    this.cacheFileName = cacheFileName;
    this.uri = uri;
    this.sourceOfCompletions = sourceOfCompletions;
  }

  public generate(_line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      this.currentLines = lines;
      this.loadCache().catch(() => {
        reject();
      });
      const items: CompletionItem[] = [];
      if (ClassCompletion.cache && ClassCompletion.cacheSourceFileName == this.cacheFileName) {
        for (const value of ClassCompletion.cache.values()){
          items.push(value);
        }
      }
      resolve(items);
    });
  }

  /**
   * Load the cache
   *
   * @param _line
   * @param _column
   */
  private loadCache() {
    return new Promise((resolve, reject) => {
      this.sourceOfCompletions.then((sourceOfCompletions) => {
        if (sourceOfCompletions == "local") {
          ClassCompletion.cache = this.generateClassCompletion(<string[]>this.currentLines, false)
          ClassCompletion.cacheSourceFileName = this.cacheFileName;
          return resolve();
        }
        ExpandedSourceManager.getExpandedSource(this.uri).then((buffer) => {
          ClassCompletion.cacheSourceFileName = this.cacheFileName;
          ClassCompletion.cache = this.generateClassCompletion(BufferSplitter.split(buffer.toString()), true);
          return resolve();
        }).catch(() => {
          return reject();
        })
      });
    });
  }

  /**
   * Generates completions based on statement of class
   *
   * @param _line
   * @param _column
   * @param lines
   * @param useCache
   */
  private generateClassCompletion(lines: string[], useCache: boolean): Map<string, CompletionItem> {
    const items: Map<string, CompletionItem> = new Map;
    const buffer = lines.join("\n");
    new Scan(buffer).scan(/(?:^\s+CLASS\s+([\w]+)\s+AS.*|^\s+([\w]+)\s+IS\s+CLASS.*)/gim, (iterator: any) => {
      if (this.parserCobol.getDeclaracaoClasse(iterator.lineContent.toString())) {
        const classs = CobolVariable.parseLines(iterator.row, lines, {ignoreMethodReturn: true, noChildren: true, noScope: true, noSection: true});
        const classItem = this.createClassCompletion(classs.getName(), classs.getComment());
        items.set(classs.getName(), classItem);
      }
    });
    // Merge the cache with the local class
    if (useCache) {
      this.generateClassCompletion(<string[]>this.currentLines, false).forEach((value, key) => {
        if (!items.has(key)){
          items.set(key, value);
        }
      })
    }
    return items;
  }

  /**
   * Creates and pushes a completion item for the specified class
   *
   * @param classs class name
   * @param documentation documentation array
   */
  private createClassCompletion(classs: string, documentation: string[] | undefined): CompletionItem {
    const cobolDoc = this.cobolDocParser.parseCobolDoc(documentation != undefined ? documentation : []);
    return {
      label: classs,
      detail: cobolDoc.comment.join(" "),
      documentation: {
        kind: MarkupKind.Markdown,
        value: cobolDoc.elementsAsMarkdown()
      },
      kind: CompletionItemKind.Class
    };
  }

}