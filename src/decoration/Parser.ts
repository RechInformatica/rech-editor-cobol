import { Range, TextEditor, DecorationRenderOptions, window, Color } from "vscode";
import { CobolVariable } from "../lsp/completion/CobolVariable";
import { VariableUtils } from "../commons/VariableUtils";
import { Configuration } from "../helpers/configuration";


export class Parser {
  private rechDocTypeRangeList: Range[] = [];
  private rechDocVariableRangeList: Range[] = [];
  private localVariableRangeList: Range[] = [];


  public findLocalVariables(activeEditor: TextEditor): void {
    const text = activeEditor.document.getText();
    if (!this.needDifferentiateVariablesByScope(text)) {
      return;
    }
    const regex = /^\s+\d\d\s+(?:[\w\-]+)?(?:\(.*\))?([\w\-]+)(\s+|\.).*/gm
    // Find all variables in text
    let match: any;
    while (match = regex.exec(text)) {
      const variable = CobolVariable.parseLines(activeEditor.document.positionAt(match.index + match[1].length).line, text.split("\n"));
      if (VariableUtils.isLocalScope(variable)) {
        const variableUseRegex = new RegExp(`[\\s\\.\\,\\:\\)\\(](${variable.getName()})[\\s\\t\\n\\r\\.\\,\\:\\)\\(]`, "img")
        let line;
        while (line = variableUseRegex.exec(text)) {
          // Range of parameter description type
          const startPos = activeEditor.document.positionAt(line.index + 1);
          // If the line is a commentary, dont decore
          if (text.split("\n")[startPos.line].trim().startsWith("*>")) {
            continue;
          }
          const endPos = activeEditor.document.positionAt(line.index + line[1].length + 1);
          // Add the range in list to decorate
          this.localVariableRangeList.push(new Range(startPos, endPos));
        }
      }
    }
  }

  /**
   * Return if text represents a OO cobol source with methods
   *
   * @param text
   */
  private needDifferentiateVariablesByScope(text: string): boolean {
    return /^\s+method-id\./gmi.test(text);
  }

	/**
	 * Finds documentation comment blocks with Rech documentation starting with "*> @"
	 * @param activeEditor The active text editor containing the code document
	 */
  public findRechDocComments(activeEditor: TextEditor): void {
    const text = activeEditor.document.getText();
    // Regex to search documentation comment blocks between "*>/**   *>*/"
    const blockCommentRegEx = /(^|[ \t])(\*\>\/\*\*)+([\s\S]*?)(\*\/)/igm;
    // Regex to find parameter lines inside a documentation block
    const lineParameterRegEx = new RegExp(/([ \t]*\*>[ \t]*)(@param|@enum|@return|@throws|@optional|@default|@extends)([ ]*|[:])+([a-zA-Z0-9_\-(?)]*) *([^*/][^\r\n]*)/, "ig");
    // Find all documentation comment blocks on text
    let match: any;
    while (match = blockCommentRegEx.exec(text)) {
      const commentBlock = match[0];
      // Find all parameter lines inside a block
      let line;
      while (line = lineParameterRegEx.exec(commentBlock)) {
        // Range of parameter description type
        let startPos = activeEditor.document.positionAt(match.index + line.index + line[1].length);
        let endPos = activeEditor.document.positionAt(match.index + line.index + line[1].length + line[2].length);
        // Add the range in list to decorate
        this.rechDocTypeRangeList.push(new Range(startPos, endPos));
        // If documentation line have variable after type
        if (line[4].length != 0) {
          // Range of parameter variable
          startPos = activeEditor.document.positionAt(match.index + line.index + line[1].length + line[2].length + line[3].length);
          endPos = activeEditor.document.positionAt(match.index + line.index + line[1].length + line[2].length + line[3].length + line[4].length);
          // Add the range in list to decorate
          this.rechDocVariableRangeList.push(new Range(startPos, endPos));
        }
      }
    }
  }

	/**
	 * Applies decorations previously found
	 * @param activeEditor The active text editor containing the code document
	 */
  public applyDecorations(activeEditor: TextEditor): void {
    const colors = new Configuration("rech.editor.cobol").get<any>("especialColors");
    // Create decorator to RechDoc type of documentation and aply on Ranges
    let color: DecorationRenderOptions = { color: colors.rechdocToken, backgroundColor: "transparent" };
    let decorator = window.createTextEditorDecorationType(color);
    activeEditor.setDecorations(decorator, this.rechDocTypeRangeList);
    this.rechDocTypeRangeList.length = 0;
    // Create decorator to RechDoc variable documentation and aply on Ranges
    color = { color: colors.rechdocVariable, backgroundColor: "transparent" };
    decorator = window.createTextEditorDecorationType(color);
    activeEditor.setDecorations(decorator, this.rechDocVariableRangeList);
    this.rechDocVariableRangeList.length = 0;
    // Create decorator to local variable and aply on Ranges
    color = { color: colors.localScopeVariable, backgroundColor: "transparent" };
    decorator = window.createTextEditorDecorationType(color);
    activeEditor.setDecorations(decorator, this.localVariableRangeList);
    this.localVariableRangeList.length = 0;
  }

}