import { CompletionItem, TextDocument } from "vscode-languageserver";
import { ParserCobol } from "../../cobol/parsercobol";
import { VarDeclarationCompletion } from "./VarDeclarationCompletion";
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
  private paragraphCompletion: CompletionInterface | undefined;

  /**
   * Creates an instance to generate LSP Completion Items for Cobol language
   *
   * @param line line where the cursor is positioned
   * @param column column where the cursor is positioned
   * @param fullDocument full document information
   */
  constructor(line: number, column: number, fullDocument: TextDocument) {
    this.line = line;
    this.column = column;
    this.lines = fullDocument.getText().split("\n");
    this.lineText = this.lines[line];
    this.additionalCompletions = [];
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
   * Generates completion items for Cobol paragraphs
   *
   * @param lines Cobol source code lines
   */
  public generateCompletionItems(): CompletionItem[] {
    switch (true) {
      case this.isCommentLine() || this.isIf() || this.isWhen(): {
        return [];
      }
      case this.isVarDeclaration() && !this.isVarPictureDeclared(): {
        return this.generate(new VarDeclarationCompletion());
      }
      case this.isVarDeclaration() && this.isVarPictureDeclared(): {
        return this.generate(new FlagCompletion());
      }
      case this.isMove() || this.isAdd() || this.isSet(): {
        return this.createToCompletions();
      }
      case this.isSubtract(): {
        return this.generate(new FromCompletion());
      }
      case this.isParagraphPerform(): {
        if (this.paragraphCompletion) {
          return this.generate(this.paragraphCompletion);
        }
        return [];
      }
      default: {
        return this.createDefaultCompletions();
      }
    }
  }

  /**
   * Returns true if the cursor is on a comment line
   */
  private isCommentLine() {
    return this.lineText.trim().startsWith("*>");
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
  private isVarPictureDeclared(): boolean {
    return this.lineText.toUpperCase().includes(" PIC ");
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
   * Fills the completion items with 'To' Cobol commands
   */
  private createToCompletions() {
    let items: CompletionItem[] = [];
    items = items.concat(this.generate(new ToCompletion()));
    if (this.isSet()) {
      items = items.concat(this.generate(new ToTrueCompletion()));
    }
    return items;
  }


  /**
   * Fills the completion items with default Cobol commands
   */
  private createDefaultCompletions() {
    let items: CompletionItem[] = [];
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
    this.additionalCompletions.forEach(impl => {
      items = items.concat(this.generate(impl));
    });
    return items;
  }

  /**
   * Generates completion items with the specified implementation
   *
   * @param completion implementation used to generate completion items
   */
  private generate(completion: CompletionInterface): CompletionItem[] {
    let result = completion.generate(this.line, this.column, this.lines);
    if (!CompletionUtils.isLowerCaseSource(this.lines)) {
      return this.toUpperCase(result);
    }
    return result;
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
}
