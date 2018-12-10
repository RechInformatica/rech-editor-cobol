import { CompletionItem, TextDocument } from "vscode-languageserver";
import { ParserCobol } from "../../cobol/parsercobol";
import { ParagraphCompletion } from "./ParagraphCompletion";
import { VarDeclarationCompletion } from "./VarDeclarationCompletion";
import { PerformCompletion } from "./PerformCompletion";
import { MoveCompletion } from "./MoveCompletion";
import { ToCompletion } from "./ToCompletion";
import { CompletionInterface } from "./CompletionInterface";
import { EvaluateCompletion } from "./EvaluateCompletion";
import { PerformUntilCompletion } from "./PerformUntilCompletion";
import { SetCompletion } from "./SetCompletion";
import { PerformTestBeforeCompletion } from "./PerformTestBeforeCompletion";
import { AddCompletion } from "./AddCompletion";
import { SubtractCompletion } from "./SubtractCompletion";
import { FromCompletion } from "./FromCompletion";
import { CompletionUtils } from "../commons/CompletionUtils";
import { DynamicJsonCompletion } from "./DynamicJsonCompletion";
import { timingSafeEqual } from "crypto";
import { ExitParagraphCompletion } from "./ExitParagraphCompletion";
import { ExitPerformCompletion } from "./ExitPerformCompletion";
import { ExitCycleCompletion } from "./ExitCycleCompletion";

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
      case this.isVarDeclaration(): {
        return this.generate(new VarDeclarationCompletion());
      }
      case this.isMove() || this.isAdd() || this.isSet(): {
        return this.generate(new ToCompletion());
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
   * Returns true if the editor should suggest Cobol variable declaration
   */
  private isVarDeclaration(): boolean {
    if (new ParserCobol().getDeclaracaoVariavel(this.lineText)) {
      return this.isVariableLevelAndNameDeclared();
    }
    return false;
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
   *
   * @param line target line to test variable declaration
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
    items = items.concat(this.generate(new PerformUntilCompletion()));
    items = items.concat(this.generate(new PerformTestBeforeCompletion()));
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
    if (CompletionUtils.isLowerCaseSource(this.lines)) {
        return this.toLowerCase(result);
    }
    return result;
  }

  /**
   * Convert the result to lower case
   *
   * @param result
   */
  private toLowerCase(result: CompletionItem[]): CompletionItem[] {
    result.forEach(completionItem => {
      if (completionItem.commitCharacters) {
        completionItem.commitCharacters.forEach((commitCharacter) => {
            commitCharacter = commitCharacter.toLowerCase();
        })
      }
      if (completionItem.filterText) {
        completionItem.filterText = completionItem.filterText.toLowerCase();
      }
      if (completionItem.insertText) {
        completionItem.insertText = completionItem.insertText.toLowerCase();
      }
      if (completionItem.textEdit) {
        completionItem.textEdit.newText = completionItem.textEdit.newText.toLowerCase();
      }
      if (completionItem.additionalTextEdits) {
        completionItem.additionalTextEdits.forEach((additionalTextEdit) => {
            additionalTextEdit.newText = additionalTextEdit.newText.toLowerCase();
        })
      }
    });
    return result;
  }
}
