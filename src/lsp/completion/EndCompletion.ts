import {
  CompletionItemKind,
  CompletionItem,
  InsertTextFormat
} from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { CompletionUtils } from "../commons/CompletionUtils";
import { FormatterUtils } from "../formatter/FormatterUtils";

// Cobol column for 'FROM' clause declaration
const FROM_COLUMN_DECLARATION = 30;

/**
 * Class to generate LSP Completion Items for Cobol 'from' clause
 */
export class EndCompletion implements CompletionInterface {
  public generate(line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
    return new Promise(resolve => {
      resolve(this.findOpenBlocks(line, lines));
    });
  }

  /**
   * Return the opens blocks to suggest the end command
   */
  private findOpenBlocks(line: number, lines: string[]): CompletionItem[] {
    let result: CompletionItem[] = [];
    let findIf = false
    let findEvaluate = false
    let findPerform = false
    let findMethod = false
    let findTry = false
    for (let i = line; i > 0; i--) {
      const currentLine = lines[i];
      if (CompletionUtils.isTheParagraphOrMethodDeclaration(currentLine)) {
        break;
      }
      if (!findIf && this.ifIfDeclaration(currentLine)) {
        let endIfClause = "end-if"
        let ifStartColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
        if (FormatterUtils.isClauseMissing(i + 1, ifStartColumn, lines, endIfClause, [endIfClause, "else"])) {
          result.push(this.buildEndCompletion(endIfClause, line, ifStartColumn))
          findIf = true
          continue;
        }
        continue;
      }
      if (!findEvaluate && this.evaluateDeclaration(currentLine)) {
        let endEvaluateClause = "end-evaluate"
        let evaluateStartColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
        if (FormatterUtils.isClauseMissing(i + 1, evaluateStartColumn, lines, endEvaluateClause, [endEvaluateClause, "when"])) {
          result.push(this.buildEndCompletion(endEvaluateClause, line, evaluateStartColumn))
          findEvaluate = true
          continue;
        }
        continue;
      }
      if (!findMethod && this.methodDeclaration(currentLine)) {
        let endMethodClause = "end method"
        let methodStartColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
        let identClauses = [endMethodClause, "working-storage", "linkage", "procedure", "environment", "data", "77", "01",
                            "configuration", "input-output", "file-control", "i-o-control", "source-computer", "object-computer",
                            "special-names", "repository", "file", "local-storage", "report", "screen"];
        if (FormatterUtils.isClauseMissing(i + 1, methodStartColumn, lines, endMethodClause, identClauses)) {
          result.push(this.buildEndCompletion(endMethodClause, line, methodStartColumn))
          findMethod = true
          continue;
        }
        continue;
      }
      if (!findPerform && this.performDeclaration(currentLine)) {
        let endPerformClause = "end-perform"
        let performColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
        if (FormatterUtils.isClauseMissing(i + 1, performColumn, lines, endPerformClause, [endPerformClause])) {
          result.push(this.buildEndCompletion(endPerformClause, line, performColumn))
          findPerform = true
          continue;
        }
        continue;
      }
      if (!findTry && this.tryDeclaration(currentLine)) {
        let endTryClause = "end-try"
        let tryColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
        if (FormatterUtils.isClauseMissing(i + 1, tryColumn, lines, endTryClause, [endTryClause, "catch", "finally"])) {
          result.push(this.buildEndCompletion(endTryClause, line, tryColumn))
          findTry = true
          continue;
        }
        continue;
      }
    }
    return result;
  }

  /**
   * Returns true if the line represents a 'if'
   *
   * @param text
   */
  private ifIfDeclaration(text: string): boolean {
    return /\s+if\s.*/i.test(text)
  }

  /**
   * Returns true if the line represents a 'evaluate'
   *
   * @param text
   */
  private evaluateDeclaration(text: string): boolean {
    return /\s+evaluate\s.*/i.test(text)
  }

  /**
   * Returns true if the line represents a method declaration
   *
   * @param text
   */
  private methodDeclaration(text: string): boolean {
    return /\s+method-id.\s.*/i.test(text)
  }

  /**
   * Returns true if the line represents a 'perform'
   *
   * @param text
   */
  private performDeclaration(text: string): boolean {
    return /\s+perform(?:$|\s*with\stest.*|\s*until\sexit.*|\s+varying\s.*)/im.test(text)
  }

  /**
   * Returns true if the line represents a 'try'
   *
   * @param text
   */
  private tryDeclaration(text: string): boolean {
    return /\s+try\s*/im.test(text)
  }

  /**
   * Build the completion items from endCompletion
   *
   * @param generateIf
   * @param generateEvaluate
   * @param generatePerform
   */
  private buildEndCompletion(label: string, line: number, column: number): CompletionItem {
    let text = CompletionUtils.fillSpacesBetween(0, column) + label + CompletionUtils.separatorForColumn(column);
    return {
      label: label,
      insertText: "\n",
      additionalTextEdits:[ {
        range: {
            start: {
                line: line,
                character: 0
            },
            end: {
                line: line,
                character: 0
            }
        },
        newText: text
      }],
      detail: "Generates " + label.toUpperCase() + " to end the command block",
      insertTextFormat: InsertTextFormat.Snippet,
      kind: CompletionItemKind.Keyword
    }
  }

}
