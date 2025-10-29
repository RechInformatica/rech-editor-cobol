import { CompletionItem } from "vscode-languageserver";
import { ParserCobol } from "../../cobol/parsercobol";
import { PerformCompletion } from "./PerformCompletion";
import { DeclareCompletion } from "./DeclareCompletion";
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
import { UsageCompletion } from "./UsageCompletion";
import { TypedefClauseCompletion } from "./TypedefClauseCompletion";
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
import { ObjectReferenceCompletion } from "./ObjectReferenceCompletion";
import { AnyLengthCompletion } from "./AnyLengthCompletion";
import { MethodIdCompletion } from "./MethodIdCompletion";
import { MethodModifyersCompletion } from "./MethodModifyersCompletion";
import { WorkingStorageCompletion } from "./WorkingStorageCompletion";
import { LinkageCompletion } from "./LinkageCompletion";
import { ProcedureCompletion } from "./ProcedureCompletion";
import { TryCompletion } from "./TryCompletion";
import { FinallyCompletion } from "./FinallyCompletion";
import { CatchCompletion } from "./CatchCompletion";


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
  /** Completion class to generate the CompletionItem for class */
  private classCompletion: CompletionInterface;
  /** Completion class to generate the CompletionItem for mthods */
  private methodCompletion: CompletionInterface;
  /** Completion class to generate the CompletionItem for variables */
  private variableCompletionFactory: VariableCompletionFactory | undefined;
  /** Completion class to generate the CompletionItem for typedef */
  private typedefCompletion: CompletionInterface;
  /** Completion class to generate the CompletionItem for value */
  private valueCompletion: CompletionInterface;
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
    this.classCompletion = new EmptyCompletion();
    this.methodCompletion = new EmptyCompletion();
    this.typedefCompletion = new EmptyCompletion();
    this.valueCompletion = new EmptyCompletion();
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
   * Completion class to generate the CompletionItem for class
   *
   * @param classCompletion
   */
  public setClassCompletion(classCompletion: CompletionInterface): CobolCompletionItemFactory {
    this.classCompletion = classCompletion;
    return this;
  }

  /**
   * Completion class to generate the CompletionItem for methods
   *
   * @param classCompletion
   */
  public setMethodCompletion(methodCompletion: CompletionInterface): CobolCompletionItemFactory {
    this.methodCompletion = methodCompletion;
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
   * Completion class to generate the CompletionItem for typedefs
   *
   * @param typedefCompletion
   */
  public setTypedefCompletion(typedefCompletion: CompletionInterface): CobolCompletionItemFactory {
    this.typedefCompletion = typedefCompletion;
    return this;
  }

  /**
   * Completion class to generate the CompletionItem for value
   *
   * @param valueCompletion
   */
  public setValueCompletion(valueCompletion: CompletionInterface): CobolCompletionItemFactory {
    this.valueCompletion = valueCompletion;
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
        if (result.length && result.length > 0) {
          let items: Promise<CompletionItem[]>[] = [];
          this.additionalCompletions.forEach(impl => {
            items = items.concat(this.generate(impl));
          });
          this.createWrappingPromise(items).then((item) => {
            result = result.concat(item);
            return resolve(result);
          }).catch(() => {
            return resolve([]);
          })
        } else {
          return resolve([]);
        }
      }).catch((e) => {
        return reject(e);
      })
    });
  }

  /**
   * Generates completion items for Cobol
   *
   * @param lines Cobol source code lines
   */
  public generateConditionalCompletionItems(): Promise<CompletionItem[]> {
    return new Promise(async (resolve) => {
      try {
        switch (true) {
          case this.isCommentLine(): {
            return resolve([]);
          }
          case this.isMethod(): {
            return resolve(await this.generate(this.methodCompletion));
          }
          case this.isDisplay() || this.isAccept(): {
            let result = [];
            result = result.concat(await this.generate(this.createVariableSuggestionWithoutEnum()));
            result = result.concat(await this.generate(this.classCompletion))
            return resolve(result);
          }
          case this.isIf(): {
            let result = [];
            result = result.concat(await this.generate(this.createVariableSuggestionWithEnum()));
            result = result.concat(await this.generate(this.classCompletion))
            return resolve(result);
          }
          case this.isCompute(): {
            let result = [];
            result = result.concat(await this.generate(this.createVariableSuggestionWithoutEnumAndDisplay()));
            result = result.concat(await this.generate(this.classCompletion))
            return resolve(result);
          }
          case this.isMethodDeclaration(): {
            let result = [];
            result = result.concat(await this.generate(new MethodModifyersCompletion("public")));
            result = result.concat(await this.generate(new MethodModifyersCompletion("protected")));
            result = result.concat(await this.generate(new MethodModifyersCompletion("static")));
            result = result.concat(await this.generate(new MethodModifyersCompletion("override")));
            return resolve(result);
          }
          case this.isInitialize(): {
            return resolve(await this.generate(this.createVariableSuggestionWithEnum()));
          }
          case this.isWhen(): {
            return resolve(await this.createWhenCompletions());
          }
          case this.isUsageClause(): {
            return resolve(await this.generate(this.typedefCompletion));
          }
          case this.isVarDeclaration(): {
            return resolve(await this.createVariableCompletions());
          }
          case this.isMove() || this.isAdd() || this.isSet(): {
            return resolve(await this.createCompletionsForToCommands());
          }
          case this.isSubtract(): {
            return resolve(await this.createCompletionsForSubtract());
          }
          case this.isParagraphPerform(): {
            return resolve(await this.generate(this.paragraphCompletion));
          }
          case this.isUnhandledCommand(): {
            return resolve([]);
          }
          default: {
            return resolve(await this.createDefaultCompletions());
          }
        }
      } catch(e) {
        return resolve([]);
      }
    });
  }

  /**
   * Generate completion items for commands that considers 'to' clause
   */
  private createCompletionsForToCommands(): Promise<CompletionItem[]> {
    return new Promise(async (resolve, _reject) => {
      if (this.shouldSuggestClause("TO")) {
        return resolve(await this.createToCompletions());
      } else {
        let result = [];
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
        result = result.concat(await this.generate(varCompletion));
        result = result.concat(await this.generate(this.classCompletion))
        return resolve(result);
      }
    });
  }

  /**
   * Generate completion items for subtract command
   */
  private createCompletionsForSubtract(): Promise<CompletionItem[]> {
    return new Promise(async (resolve, _reject) => {
      if (this.shouldSuggestClause("FROM")) {
        return resolve(await this.generate(new FromCompletion()));
      } else {
        let result = [];
        const varCompletion: VariableCompletion = this.createVariableSuggestionWithoutEnum();
        if (this.lineContainsFrom()) {
          varCompletion.setInsertTextBuilder(new CommaDotInsertTextBuilder());
        } else {
          if (!this.cursorWordContainsParentheses()) {
            varCompletion.setInsertTextBuilder(new CommandSeparatorInsertTextBuilder("from"));
          }
        }
        result = result.concat(await this.generate(varCompletion));
        result = result.concat(await this.generate(this.classCompletion))
        return resolve(result);
      }
    });
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
    const wordWithIndex = new CobolWordFinder().findWordWithIndexAt(this.lineText, this.column);
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
   * Creates a variable completion interface ignoring enum variables and displays
   */
  private createVariableSuggestionForObjectReference(): VariableCompletion {
    return this.variableCompletionFactory!.create().setConsiderOnlyObjectReference(true);
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
        if (!this.isPictureOrUsageOrObjectReferenceDeclared()) {
          let items: Promise<CompletionItem[]>[] = [];
          items = items.concat(this.generate(new PictureCompletion()));
          items = items.concat(this.generate(new UsageCompletion()));
          items = items.concat(this.generate(new ObjectReferenceCompletion()));
          return resolve(this.createWrappingPromise(items));
        }
        if (this.isObjectReferenceDeclared()) {
          return resolve(this.generate(this.classCompletion));
        }
        if (!this.isValueDeclared()) {
          let items: Promise<CompletionItem[]>[] = [];
          items = items.concat(this.generate(this.valueCompletion));
          if (!this.isUsageDeclared()){
            items = items.concat(this.generate(new TypedefClauseCompletion()));
          }
          if (this.isInPictureXDeclaration()) {
            items = items.concat(this.generate(new AnyLengthCompletion()));
          }
          return resolve(this.createWrappingPromise(items));
        }
      }
      if (this.isFlagParent()) {
        return resolve(this.generate(new FlagCompletion()));
      }
      return resolve([]);
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
 private isPictureOrUsageOrObjectReferenceDeclared(): boolean {
   return this.lineText.toUpperCase().includes(" PIC ") || this.isUsageDeclared() || this.isObjectReferenceDeclared();
  }

  /**
   * Returns true if the usage clause is declared on the current line
   */
  private isUsageDeclared(): boolean {
    return this.lineText.toUpperCase().includes(" USAGE ")
  }

  /**
   * Returns true if the var usage clause is the last word on the current line
   */
  private isUsageClause(): boolean {
    const match = this.lineText.match(/^.*USAGE *$/gi);
    return match != null;
  }

  /**
   * Returns true if the var is declared with Object Reference
   */
  private isObjectReferenceDeclared(): boolean {
    return this.lineText.toUpperCase().includes(" OBJECT REFERENCE ");
  }

  /**
   * Returns true if the cursor is in Picture X declaration
   */
  private isInPictureXDeclaration(): boolean {
    const text = this.lineText.substr(0, this.column);
    const match = text.match(/^.*\sPIC(?:\sIS)?\sX(?:\(\w*\)?)?\s?$/gi);
    return match != null;
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
   * Returns true if the current line represents a method invocation
   */
  private isMethod(): boolean {
    if (/.*\:\>[^\s]*/.exec(this.lineText.substr(0, this.column))) {
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
   * Returns true if the current line is a method declaration
   */
  private isMethodDeclaration(): boolean {
    return this.lineText.toUpperCase().includes(" METHOD-ID. ");
  }

  /**
   * Returns true if the current program is a COBOL class
   */
  private isCobolClass(): boolean {
    for (let index = 0; index < this.lines.length; index++) {
      const line = this.lines[index];
      if (line.toUpperCase().includes(" CLASS-ID. ")) {
        return true;
      }
      if (line.toUpperCase().includes(" PROGRAM-ID. ")) {
        return false;
      }
    }
    return false;
  }

  /**
   * Returns true if the level and the name of the Cobol variable are declared.
   *
   * This regular expression checks if the variable is ready to receive the 'PIC',
   * 'USAGE' and 'VALUE IS' clauses.
   */
  private isVariableLevelAndNameDeclared() {
    const variableNamePositionOnDeclaration = 2;
    const result = /(\d+\w.+\s)([^\s].*)/.exec(this.lineText);
    if (result && result[variableNamePositionOnDeclaration]) {
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
    const unhandledCommand = /\s*[^ ]+[ ]+/.test(this.lineText);
    return unhandledCommand;
  }

  /**
   * Returns true if current line is empty
   *
   * @returns
   */
  public isEmptyLine(): boolean {
    const EMPTY_LENGHT = 1
    return this.lineText.trim().split(" ").length <= EMPTY_LENGHT;
  }

  /**
   * Returns true if the current line is in a if block
   */
  private isInIfBlock(): boolean {
    let openBlocks = 0;
    let closeBlocks = 0;
    for (let i = this.line - 1; i > 0; i--) {
      if (CompletionUtils.isTheParagraphOrMethodDeclaration(this.lines[i])) {
        break;
      }
      const currentLine = this.lines[i].toLowerCase().trim();
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
   * Returns true if the current line is in a if try block
   */
  private isInTryBlock(): boolean {
    let openBlocks = 0;
    let closeBlocks = 0;
    for (let i = this.line - 1; i > 0; i--) {
      if (CompletionUtils.isTheParagraphOrMethodDeclaration(this.lines[i])) {
        break;
      }
      const currentLine = this.lines[i].toLowerCase().trim();
      if (currentLine.toUpperCase() == "TRY") {
        openBlocks++;
      }
      if (currentLine.toUpperCase().startsWith("END-TRY")) {
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
    items = items.concat(this.generate(new DeclareCompletion()));
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
    items = items.concat(this.generate(this.classCompletion));
    if (this.isEmptyLine()) {
      items = items.concat(this.generate(new WorkingStorageCompletion()));
      items = items.concat(this.generate(new LinkageCompletion()));
      items = items.concat(this.generate(new ProcedureCompletion()));
      if (this.isCobolClass()) {
        items = items.concat(this.generate(new MethodIdCompletion()));
      }
      items = items.concat(this.generate(new TryCompletion()));
    }
    if (this.isInIfBlock()) {
      items = items.concat(this.generate(new ElseCompletion()));
    }
    if (this.isInTryBlock()) {
      items = items.concat(this.generate(new FinallyCompletion()));
      items = items.concat(this.generate(new CatchCompletion()));
    }
    items = items.concat(this.generate(this.createVariableSuggestionForObjectReference()));
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
          return resolve(this.toUpperCase(result));
        }
        return resolve(result);
      }).catch((e) => {
        return reject(e);
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
        return resolve(completions);
      }).catch((e) => {
        return reject(e);
      })
    });
  }
}
