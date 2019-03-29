import { CompletionItem } from "vscode-languageserver";
import { ParserCobol } from "../../cobol/parsercobol";
import { PerformCompletion } from "./PerformCompletion";
import { MoveCompletion } from "./MoveCompletion";
import { ToCompletion } from "./ToCompletion";
import { CompletionInterface } from "./CompletionInterface";
import { EvaluateCompletion } from "./EvaluateCompletion";
import { PerformUntilExitCompletion } from "./PerformUntilExitCompletion";
import { SetCompletion } from "./SetCompletion";
import { PerformVaryingCompletion } from "./PerformVaryingCompletion";
import { AddCompletion } from "./AddCompletion";
import { SubtractCompletion } from "./SubtractCompletion";
import { FromCompletion } from "./FromCompletion";
import { CompletionUtils } from "../commons/CompletionUtils";
import { ExitParagraphCompletion } from "./ExitParagraphCompletion";
import { ExitPerformCompletion } from "./ExitPerformCompletion";
import { ExitCycleCompletion } from "./ExitCycleCompletion";
import { FlagCompletion } from "./FlagCompletion";
import { ToTrueCompletion } from "./ToTrueCompletion";
import { PictureCompletion } from "./PictureCompletion";
import { ValueCompletion } from "./ValueCompletion";
import { ElseCompletion } from "./ElseCompletion";
import Q from "q";
import { VariableCompletion } from "./variable/VariableCompletion";
import { EmptyCompletion } from "./EmptyCompletion";
import { WhenCompletion } from "./WhenCompletion";
import { EndCompletion } from "./EndCompletion";
import { VariableCompletionFactory } from "./variable/VariableCompletionFactory";
import { CommandSeparatorInsertTextBuilder } from "./variable/CommandSeparatorInsertTextBuilder";
import { CommaDotInsertTextBuilder } from "./variable/CommaDotInsertTextBuilder";
import { ToTrueInsertTextBuilder } from "./variable/ToTrueInsertTextBuilder";
import { CobolWordFinder } from "../../commons/CobolWordFinder";
import { AssignerCommandParser } from "./parser/AssignerCommandParser";


/**
 * Class to generate LSP Completion Items for Cobol language
 */
export class CobolCompletionItemFactory {
  /** Line where the cursor is positioned */
  private line: number;
  /** Column where the cursor is positioned */
  private column: number;
  /** Document lines */
  private lines: string[];
  /** Text of the current line */
  private lineText: string;
  /** Additional implementations for generating Completion Items */
  private additionalCompletions: CompletionInterface[];
  /** Completion class to generate the CompletionItem for paragraphs */
  private paragraphCompletion: CompletionInterface;
  /** Completion class to generate the CompletionItem for variables */
  private variableCompletionFactory: VariableCompletionFactory | undefined;
  /** uri of source file */
  private uri: string | undefined;

  /**
   * Creates an instance to generate LSP Completion Items for Cobol language
   *
   * @param line line where the cursor is positioned
   * @param column column where the cursor is positioned
   * @param lines document text lines
   * @param uri uri of source file
   */
  constructor(line: number, column: number, lines: string[], uri?: string) {
    this.line = line;
    this.column = column;
    this.lines = lines;
    this.lineText = this.lines[line];
    this.uri = uri;
    this.additionalCompletions = [];
    this.paragraphCompletion = new EmptyCompletion();
  }

  /**
   * Adds a implementations for generating Completion Items
   *
   * @param impl implementation to be inserted
   */
  public addCompletionImplementation(impl: CompletionInterface): CobolCompletionItemFactory {
    this.additionalCompletions.push(impl);
    return this;
  }

  /**
   * Completion class to generate the CompletionItem for paragraphs
   *
   * @param paragraphCompletion
   */
  public setParagraphCompletion(paragraphCompletion: CompletionInterface): CobolCompletionItemFactory {
    this.paragraphCompletion = paragraphCompletion;
    return this;
  }

  /**
   * Completion class to generate the CompletionItem for variables
   *
   * @param variableCompletionFactory
   */
  public setVariableCompletionFactory(variableCompletionFactory: VariableCompletionFactory): CobolCompletionItemFactory {
    this.variableCompletionFactory = variableCompletionFactory;
    return this;
  }

  /**
   * Generates completion items for Cobol paragraphs
   *
   * @param lines Cobol source code lines
   */
  public generateCompletionItems(): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      this.generateConditionalCompletionItems().then((result) => {
        if (result.length > 0) {
          let items: Promise<CompletionItem[]>[] = [];
          this.additionalCompletions.forEach(impl => {
            items = items.concat(this.generate(impl));
          });
          this.createWrappingPromise(items).then((item) => {
            result = result.concat(item);
            resolve(result);
          }).catch(() => {
            resolve([]);
          })
        } else {
          resolve([]);
        }
      }).catch(() => {
        reject();
      })
    });
  }

  /**
   * Generates completion items for Cobol
   *
   * @param lines Cobol source code lines
   */
  public generateConditionalCompletionItems(): Promise<CompletionItem[]> {
    return new Promise((resolve) => {
      switch (true) {
        case this.isCommentLine(): {
          resolve([]);
          return;
        }
        case this.isDisplay() || this.isAccept(): {
          resolve(this.generate(this.createVariableSuggestionWithoutEnum()));
          return;
        }
        case this.isIf(): {
          resolve(this.generate(this.createVariableSuggestionWithEnum()));
          return;
        }
        case this.isCompute(): {
          resolve(this.generate(this.createVariableSuggestionWithoutEnumAndDisplay()));
          return;
        }
        case this.isInitialize(): {
          resolve(this.generate(this.createVariableSuggestionWithEnum()));
          return;
        }
        case this.isWhen(): {
          resolve(this.createWhenCompletions());
          return;
        }
        case this.isVarDeclaration(): {
          resolve(this.createVariableCompletions());
          return;
        }
        case this.isMove() || this.isAdd() || this.isSet(): {
          resolve(this.createCompletionsForToCommands());
          return;
        }
        case this.isSubtract(): {
          resolve(this.createCompletionsForSubtract());
          return;
        }
        case this.isParagraphPerform(): {
          resolve(this.generate(this.paragraphCompletion));
          return;
        }
        case this.isUnhandledCommand(): {
          resolve([]);
          return;
        }
        default: {
          resolve(this.createDefaultCompletions());
          return;
        }
      }
    })
  }

  /**
   * Generate completion items for commands that considers 'to' clause
   */
  private createCompletionsForToCommands(): Promise<CompletionItem[]> {
    if (this.shouldSuggestClause("TO")) {
      return this.createToCompletions();
    } else {
      let varCompletion: VariableCompletion;
      if (this.isSet()) {
        varCompletion = this.createVariableSuggestionWithEnum();
      } else {
        varCompletion = this.createVariableSuggestionWithoutEnum();
      }
      if (this.lineContainsTo()) {
        varCompletion.setInsertTextBuilder(new CommaDotInsertTextBuilder());
      } else {
        if (!this.cursorWordContainsParentheses()) {
          if (this.isSet()) {
            varCompletion.setInsertTextBuilder(new ToTrueInsertTextBuilder());
          } else {
            varCompletion.setInsertTextBuilder(new CommandSeparatorInsertTextBuilder("to"));
          }
        }
      }
      return this.generate(varCompletion);
    }
  }

  /**
   * Generate completion items for subtract command
   */
  private createCompletionsForSubtract(): Promise<CompletionItem[]> {
    if (this.shouldSuggestClause("FROM")) {
      return this.generate(new FromCompletion());
    } else {
      let varCompletion: VariableCompletion = this.createVariableSuggestionWithoutEnum();
      if (this.lineContainsFrom()) {
        varCompletion.setInsertTextBuilder(new CommaDotInsertTextBuilder());
      } else {
        if (!this.cursorWordContainsParentheses()) {
          varCompletion.setInsertTextBuilder(new CommandSeparatorInsertTextBuilder("from"));
        }
      }
      return this.generate(varCompletion);
    }
  }

  /**
  * Returns true if the cursor is on a comment line
  */
  private isCommentLine() {
    return this.lineText.trim().startsWith("*>");
  }

  /**
   * Returns true if the word where cursor is currently positioned contains parentheses.
   * If true, it means the variable is indexed and should not suggest 'to' inside parentheses.
   */
  public cursorWordContainsParentheses(): boolean {
    let wordWithIndex = new CobolWordFinder().findWordWithIndexAt(this.lineText, this.column);
    return wordWithIndex.includes("(") && wordWithIndex.includes(")");
  }

  /**
   * Returns true if the Language Server should suggest a completion item to the
   * specified clause
   *
   * @param clause clause to be tested
   */
  public shouldSuggestClause(clause: string): boolean {
    return new AssignerCommandParser().shouldSuggestClause(this.lineText, clause);
  }

  /**
   * Creates a variable completion interface allowing enum suggestion
   */
  private createVariableSuggestionWithEnum(): VariableCompletion {
    return this.variableCompletionFactory!.create();
  }

  /**
   * Creates a variable completion interface ignoring enum suggestion
   */
  private createVariableSuggestionWithoutEnum(): VariableCompletion {
    return this.variableCompletionFactory!.create().setIgnoreEnums(true);
  }

  /**
   * Creates a variable completion interface ignoring enum variables and displays
   */
  private createVariableSuggestionWithoutEnumAndDisplay(): VariableCompletion {
    return this.variableCompletionFactory!.create().setIgnoreDisplay(true).setIgnoreEnums(true);
  }

  /**
   * Creates completion items form when clauses
   */
  private createWhenCompletions(): Promise<CompletionItem[]> {
    let items: Promise<CompletionItem[]>[] = [];
    items = items.concat(this.generate(new WhenCompletion(this.uri)));
    items = items.concat(this.generate(this.createVariableSuggestionWithEnum()));
    return this.createWrappingPromise(items);
  }

  /**
   * Creates completion items for Cobol variables
   */
  private createVariableCompletions(): Promise<CompletionItem[]> {
    return new Promise((resolve) => {
      if (!this.isVariableDeclarationFinalized()) {
        if (!this.isPictureDeclared()) {
          resolve(this.generate(new PictureCompletion()));
          return;
        }
        if (!this.isValueDeclared()) {
          resolve(this.generate(new ValueCompletion()));
          return;
        }
      }
      if (this.isFlagParent()) {
        resolve(this.generate(new FlagCompletion()));
        return;
      }
      resolve([]);
      return;
    })
  }

  /**
   * Returns true if the variable declaration has been finalized
   * and the variable is completely set
   */
  private isVariableDeclarationFinalized(): boolean {
    return this.lineText.trim().endsWith(".");
  }

  /**
   * Returns true if the variable on the current line represents a parent
   * variable of SIM and NAO flags (88).
   *
   * The parent variable needs to be PIC 9(01) because it doesn't make sense
   * to generate flags for other pictures.
   */
  private isFlagParent(): boolean {
    return this.lineText.toUpperCase().includes("9(01)");
  }

  /**
   * Returns true if the current line is a variable declaration
   */
  private isVarDeclaration(): boolean {
    if (new ParserCobol().getDeclaracaoVariavel(this.lineText)) {
      return this.isVariableLevelAndNameDeclared();
    }
    return false;
  }

  /**
   * Returns true if the var Picture is declared on the current line
   */
  private isPictureDeclared(): boolean {
    return this.lineText.toUpperCase().includes(" PIC ");
  }

  /**
   * Returns true if the var Value is declared on the current line
   */
  private isValueDeclared(): boolean {
    return this.lineText.toUpperCase().includes(" VALUE ");
  }

  /**
   * Returns true if the current line represents a 'if'
   */
  private isIf(): boolean {
    if (/\s+(IF|if).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'display'
   */
  private isDisplay(): boolean {
    if (/\s+(DISPLAY|display).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'accept'
   */
  private isAccept(): boolean {
    if (/\s+(ACCEPT|accept).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'compute'
   */
  private isCompute(): boolean {
    if (/\s+(COMPUTE|compute).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'Initialize'
   */
  private isInitialize(): boolean {
    if (/\s+(INITIALIZE|initialize).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'when'
   */
  private isWhen(): boolean {
    if (/\s+(WHEN|when).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the level and the name of the Cobol variable are declared.
   *
   * This regular expression checks if the variable is ready to receive the 'PIC'
   * and 'VALUE IS' clauses.
   */
  private isVariableLevelAndNameDeclared() {
    let result = /(\d+\w.+\s)([^\s].*)/.exec(this.lineText);
    if (result && result[2]) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'move'
   */
  private isMove(): boolean {
    if (/\s+(MOVE|move).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'add'
   */
  private isAdd(): boolean {
    if (/\s+(ADD|add).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'set'
   */
  private isSet(): boolean {
    if (/\s+(SET|set).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'subtract'
   */
  private isSubtract(): boolean {
    if (/\s+(SUBTRACT|subtract).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a paragraph perform
   */
  private isParagraphPerform(): boolean {
    if (/\s+(PERFORM|perform).*/.exec(this.lineText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a command currently unhandled by this Language Server.
   *
   * In this case, doesn't make sense to suggest default commands like 'evaluate', 'perform', etc, so
   * Language Server will resolve the promise with an empty array to possibly suggest Words as a
   * default VSCode behavior.
   *
   * This method also checks if the last character is a space because if the programmer has typed
   * 'eval', for example, he or she is typing 'evaluate' and should still suggest EVALUATE completion
   * item.
   */
  public isUnhandledCommand(): boolean {
    let unhandledCommand = /\s*[^ ]+[ ]+/.test(this.lineText);
    return unhandledCommand;
  }

  /**
   * Returns true if the current line is in a if block
   */
  private isInIfBlock(): boolean {
    let openBlocks = 0;
    let closeBlocks = 0;
    for (let i = this.line - 1; i > 0; i--) {
      if (CompletionUtils.isTheParagraphDeclaration(this.lines[i])) {
        break;
      }
      let currentLine = this.lines[i].toLowerCase().trim();
      if (currentLine.toUpperCase().startsWith("IF ")) {
        openBlocks++;
      }
      if (currentLine.toUpperCase().startsWith("END-IF")) {
        closeBlocks++;
      }
    }
    return openBlocks != closeBlocks;
  }

  /**
   * Returns true if the current line already contains 'to' clause
   */
  private lineContainsTo(): boolean {
    return this.lineText.toUpperCase().includes(" TO ");
  }

  /**
   * Returns true if the current line already contains 'from' clause
   */
  private lineContainsFrom(): boolean {
    return this.lineText.toUpperCase().includes(" FROM ");
  }

  /**
   * Fills the completion items with 'To' Cobol commands
   */
  private createToCompletions(): Promise<CompletionItem[]> {
    let items: Promise<CompletionItem[]>[] = [];
    items = items.concat(this.generate(new ToCompletion()));
    if (this.isSet()) {
      items = items.concat(this.generate(new ToTrueCompletion()));
    }
    return this.createWrappingPromise(items);
  }


  /**
   * Fills the completion items with default Cobol commands
   */
  private createDefaultCompletions(): Promise<CompletionItem[]> {
    let items: Promise<CompletionItem[]>[] = [];
    items = items.concat(this.generate(new PerformCompletion()));
    items = items.concat(this.generate(new MoveCompletion()));
    items = items.concat(this.generate(new SetCompletion()));
    items = items.concat(this.generate(new AddCompletion()));
    items = items.concat(this.generate(new ExitParagraphCompletion()));
    items = items.concat(this.generate(new ExitPerformCompletion()));
    items = items.concat(this.generate(new ExitCycleCompletion()));
    items = items.concat(this.generate(new SubtractCompletion()));
    items = items.concat(this.generate(new EvaluateCompletion()));
    items = items.concat(this.generate(new PerformUntilExitCompletion()));
    items = items.concat(this.generate(new PerformVaryingCompletion()));
    items = items.concat(this.generate(new EndCompletion()));
    if (this.isInIfBlock()) {
      items = items.concat(this.generate(new ElseCompletion()));
    }
    return this.createWrappingPromise(items);
  }

  /**
   * Generates completion items with the specified implementation
   *
   * @param completion implementation used to generate completion items
   */
  private generate(completion: CompletionInterface): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      completion.generate(this.line, this.column, this.lines).then((result) => {
        if (!CompletionUtils.isLowerCaseSource(this.lines)) {
          resolve(this.toUpperCase(result));
          return;
        }
        resolve(result);
      }).catch(() => {
        reject();
      });
    });
  }

  /**
   * Convert the result to upper case
   *
   * @param result
   */
  private toUpperCase(result: CompletionItem[]): CompletionItem[] {
    result.forEach(completionItem => {
      if (completionItem.commitCharacters) {
        completionItem.commitCharacters.forEach((commitCharacter) => {
          commitCharacter = commitCharacter.toUpperCase();
        })
      }
      if (completionItem.filterText) {
        completionItem.filterText = completionItem.filterText.toUpperCase();
      }
      if (completionItem.insertText) {
        completionItem.insertText = completionItem.insertText.toUpperCase();
      }
      if (completionItem.textEdit) {
        completionItem.textEdit.newText = completionItem.textEdit.newText.toUpperCase();
      }
      if (completionItem.additionalTextEdits) {
        completionItem.additionalTextEdits.forEach((additionalTextEdit) => {
          additionalTextEdit.newText = additionalTextEdit.newText.toUpperCase();
        })
      }
    });
    return result;
  }

  /**
   * Creates a wrapping promise to generate multiple completion items
   *
   * @param items promise items to be returned
   */
  private createWrappingPromise(items: Promise<CompletionItem[]>[]): Promise<CompletionItem[]> {
    return new Promise((resolve, reject) => {
      Q.all(items).then((result) => {
        let completions: CompletionItem[] = [];
        result.forEach((element) => {
          completions = completions.concat(element);
        });
        resolve(completions);
      }).catch(() => {
        reject();
      })
    });
  }
}
