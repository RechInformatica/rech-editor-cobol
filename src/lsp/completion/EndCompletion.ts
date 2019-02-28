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
    for (let i = line; i > 0; i--) {
      const currentLine = lines[i];
      if (CompletionUtils.isTheParagraphDeclaration(currentLine)) {
        break;
      }
      if (!findIf && this.ifIfDeclaration(currentLine)) {
        let endIfClause = "end-if"
        let ifStartColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
        if (FormatterUtils.isClauseMissing(i + 1, ifStartColumn, lines, [endIfClause])) {
          result.push(this.buildEndCompletion(endIfClause, line, ifStartColumn))
          findIf = true
          continue;
        }
        continue;
      }
      if (!findEvaluate && this.evaluateDeclaration(currentLine)) {
        let endEvaluateClause = "end-evaluate"
        let evaluateStartColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
        if (FormatterUtils.isClauseMissing(i + 1, evaluateStartColumn, lines, [endEvaluateClause])) {
          result.push(this.buildEndCompletion(endEvaluateClause, line, evaluateStartColumn))
          findEvaluate = true
          continue;
        }
        continue;
      }
      if (!findPerform && this.performDeclaration(currentLine)) {
        let endPerformClause = "end-perform"
        let performColumn = CompletionUtils.countSpacesAtBeginning(currentLine)
        if (FormatterUtils.isClauseMissing(i + 1, performColumn, lines, [endPerformClause])) {
          result.push(this.buildEndCompletion(endPerformClause, line, performColumn))
          findPerform = true
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
   * Returns true if the line represents a 'perform'
   *
   * @param text
   */
  private performDeclaration(text: string): boolean {
    return /\s+perform($|\s*with\stest.*|\s*until\sexit.*)/im.test(text)
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
      preselect: true,
      kind: CompletionItemKind.Keyword
    }
  }

}