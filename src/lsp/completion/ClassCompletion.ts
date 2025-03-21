import { CompletionItemKind, CompletionItem, MarkupKind } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { ParserCobol } from "../../cobol/parsercobol";
import { CobolDocParser } from "../../cobol/rechdoc/CobolDocParser";
import { Scan } from "rech-ts-commons";
import { CobolVariable } from "./CobolVariable";
import { getConfig } from "../server";

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
  /** Special class puller  */
  private specialClassPuller: () => Thenable<string>;


  constructor(cacheFileName: string, uri: string, specialClassPuller: () => Thenable<string>) {
    this.parserCobol = new ParserCobol();
    this.cobolDocParser = new CobolDocParser();
    this.cacheFileName = cacheFileName;
    this.uri = uri;
    this.specialClassPuller = specialClassPuller;
  }

  public generate(_line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
    return new Promise((resolve, _reject) => {
      this.currentLines = lines;
      this.loadCache().then().catch();
      let items: CompletionItem[] = [];
      if (ClassCompletion.cache && ClassCompletion.cacheSourceFileName == this.cacheFileName) {
        items = Array.from(ClassCompletion.cache.values());
      }
      return resolve(items);
    });
  }

  /**
   * Load the cache
   *
   * @param _line
   * @param _column
   */
  private loadCache(): Promise<void> {
    return new Promise((resolve, _reject) => {
      this.specialClassPuller().then((classes: string) => {
        this.specialClassesPullerFilter().then((filters) => {
          ClassCompletion.cache = this.parserSpecialClasses(classes, filters);
          ClassCompletion.cacheSourceFileName = this.cacheFileName;
          return resolve();
        });
      }, (_cause)=> {
        ClassCompletion.cache = this.generateClassCompletion(<string[]>this.currentLines)
        ClassCompletion.cacheSourceFileName = this.cacheFileName;
        return resolve();
      });
    });
  }

  /**
   * Parser the special class result
   *
   * @param classes
   */
  private parserSpecialClasses(classes: string, filter: RegExp[]): Map<string, CompletionItem> {
    const items: Map<string, CompletionItem> = new Map;
    const buffer = classes.replace(/\r/g, "").split("\n");
    for (let i = 0; i < buffer.length; i++) {
      const linha = buffer[i];
      if (!linha.trim().startsWith("#")) {
        const parts = linha.split("=");
        const className = parts[0];
        const packagex = parts[1] ? parts[1] : ""
        for (let j = 0; j < filter.length; j++) {
          if (filter[j].test(className) || filter[j].test(packagex)) {
            const documentation = "*>-> " + packagex.replace("\r", "");
            const classItem = this.createClassCompletion(className, [documentation], packagex);
            items.set(className, classItem);
            break;
          }
        }
      }
    }
    return items;
  }

    /**
   * Returns the configured tabstops or default values if no tabstop is configured
   * as a list of regex patterns.
   */
    private specialClassesPullerFilter(): Promise<RegExp[]> {
      return new Promise((resolve, _reject) => {
        getConfig<string[]>("specialClassesPullerFilter").then(specialClassesPullerFilter => {
          const filter = specialClassesPullerFilter;
          resolve(filter.map(pattern => new RegExp(`^${pattern}`, 'i')));
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
  private generateClassCompletion(lines: string[]): Map<string, CompletionItem> {
    const items: Map<string, CompletionItem> = new Map;
    const buffer = lines.join("\n");
    new Scan(buffer).scan(/(?:^\s+CLASS\s+([\w]+)\s+AS.*|^\s+([\w]+)\s+IS\s+CLASS.*)/gim, (iterator: any) => {
      if (this.parserCobol.getDeclaracaoClasse(iterator.lineContent.toString())) {
        const classs = CobolVariable.parseLines(iterator.row, lines, {ignoreMethodReturn: true, noChildren: true, noScope: true, noSection: true});
        const classItem = this.createClassCompletion(classs.getName(), classs.getComment(), undefined);
        items.set(classs.getName(), classItem);
      }
    });
    return items;
  }

  /**
   * Creates and pushes a completion item for the specified class
   *
   * @param classs class name
   * @param documentation documentation array
   * @param packagex package name for clas
   */
  private createClassCompletion(classs: string, documentation: string[] | undefined, packagex: string | undefined): CompletionItem {
    const cobolDoc = this.cobolDocParser.parseCobolDoc(documentation != undefined ? documentation : []);
    return {
      label: classs,
      detail: cobolDoc.comment.join(" "),
      documentation: {
        kind: MarkupKind.Markdown,
        value: cobolDoc.elementsAsMarkdown()
      },
      filterText: classs + " " + (packagex ? packagex : cobolDoc.elementsAsMarkdown()),
      kind: CompletionItemKind.Class
    };
  }

}
