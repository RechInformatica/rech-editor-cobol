import { ParserCobol } from "../../cobol/parsercobol";
import { TextEdit, TextDocument } from "vscode-languageserver";
import { FormatterInterface } from "./FormatterInterface";
import { IfFormatter } from "./IfFormatter";
import { CommandSeparatorFormatter } from "./CommandSeparatorFormatter";
import { EvaluateFormatter } from "./EvaluateFormatter";
import { FormatterUtils } from "./FormatterUtils";
import { WhenFormatter } from "./WhenFormatter";
import { PerformUntilFormatter } from "./PerformUntilFormatter";
import { ElseFormatter } from "./ElseFormatter";
import { CompletionItem } from "vscode";
import { CompletionUtils } from "../commons/CompletionUtils";
import { PerformTestBeforeFormatter } from "./PerformTestBeforeFormatter";

/**
 * Class to format Cobol source code
 */
export class CobolFormatter {
  /** Cobol parser */
  private parser: ParserCobol;
  /** Line where the cursor is positioned */
  private line: number;
  /** Column where the cursor is positioned */
  private column: number;
  /** Document lines */
  private lines: string[];

  /**
   * Creates an instance to generate LSP Completion Items for Cobol language
   *
   * @param line line where the cursor is positioned
   * @param column column where the cursor is positioned
   * @param fullDocument full document information
   */
  constructor(line: number, column: number, fullDocument: TextDocument) {
    this.parser = new ParserCobol();
    this.line = line;
    this.column = column;
    this.lines = fullDocument.getText().split("\r\n");
  }

  /**
   * Formats the Cobol source when Enter is pressed
   */
  public formatWhenEnterIsPressed(): TextEdit[] {
    let currentText = this.lines[this.line - 1];
    if (this.isIfCondition(currentText)) {
      return this.generate(new IfFormatter());
    }
    if (this.isElseCondition(currentText)) {
      return [FormatterUtils.createIndentTextEdit(this.line, 0)];
    }
    if (this.isEvaluateCondition(currentText)) {
      return this.generate(new EvaluateFormatter());
    }
    if (this.isPerformUntil(currentText)) {
      return this.generate(new PerformUntilFormatter());
    }
    if (this.isPerformTestBefore(currentText)) {
      return this.generate(new PerformTestBeforeFormatter());
    }
    if (this.isWhenCondition(currentText)) {
      return [FormatterUtils.createIndentTextEdit(this.line, 0)];
    }
    if (this.parser.getDeclaracaoParagrafo(currentText)) {
      return [FormatterUtils.createIndentTextEdit(this.line, 0, 4)];
    }
    if (this.shouldKeepDotOrComma(this.lines[this.line], this.column)) {
      return this.generate(new CommandSeparatorFormatter());
    }
    return [];
  }

  /**
   * Formats the Cobol source when the 'E' letter is pressed
   */
  public formatWhenEIsPressed(): TextEdit[] {
    let currentText = this.lines[this.line];
    if (this.isElseCondition(currentText)) {
      return this.generate(new ElseFormatter());
    }
    return [];
  }

  /**
   * Formats the Cobol source when 'N' is pressed
   */
  public formatWhenNIsPressed(): TextEdit[] {
    let currentText = this.lines[this.line];
    if (this.isWhenCondition(currentText)) {
      return this.generate(new WhenFormatter());
    }
    return [];
  }

  /**
   * Returns true if the current line represents an 'if' condition
   */
  private isIfCondition(currentText: string): boolean {
    if (IfFormatter.IF_REGEXP.exec(currentText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents an 'if' condition
   */
  private isElseCondition(currentText: string): boolean {
    if (ElseFormatter.ELSE_REGEXP.exec(currentText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'when' condition
   */
  private isWhenCondition(currentText: string): boolean {
    if (WhenFormatter.WHEN_REGEXP.exec(currentText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'evaluate' condition
   */
  private isEvaluateCondition(currentText: string): boolean {
    if (EvaluateFormatter.EVALUATE_REGEXP.exec(currentText)) {
      return true;
    }
    return false;
  }
  
  /**
   * Returns true if the current line represents a 'perform until' condition
   */
  private isPerformUntil(currentText: string) {
    if (PerformUntilFormatter.PERFORM_UNTIL_REGEXP.exec(currentText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the current line represents a 'perform until' condition
   */
  private isPerformTestBefore(currentText: string) {
    if (PerformTestBeforeFormatter.UNTIL_REGEXP.exec(currentText)) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the editor should keep dot/comma at the end of the line
   *
   * @param currentText current line text
   * @param column column where the cursor is positioned
   */
  private shouldKeepDotOrComma(currentText: string, column: number): boolean {
    return (
      this.endsWithDotOrComma(currentText) && column == currentText.length - 1
    );
  }

  /**
   * Returns true if the current line ends with dot or comma
   *
   * @param currentText current line text
   */
  private endsWithDotOrComma(currentText: string): boolean {
    return currentText.endsWith(".") || currentText.endsWith(",");
  }

  /**
   * Generates completion items with the specified implementation
   *
   * @param completion implementation used to generate completion items
   */
  private generate(completion: FormatterInterface): TextEdit[] {
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
  private toLowerCase(result: TextEdit[]): TextEdit[] {
    result.forEach(textEdit => {
      textEdit.newText = textEdit.newText.toLowerCase();
    });
    return result;
  }

}
