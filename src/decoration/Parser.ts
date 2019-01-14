import * as vscode from 'vscode';

export class Parser {
	private rechDocTypeRangeList: vscode.Range[] = [];
	private rechDocVariableRangeList: vscode.Range[] = [];

	/**
	 * Finds documentation comment blocks with Rech documentation starting with "*> @"
	 * @param activeEditor The active text editor containing the code document
	 */
	public FindRechDocComments(activeEditor: vscode.TextEditor): void {
		let text = activeEditor.document.getText();
		// Regex to search documentation comment blocks between "*>/**   *>*/"
		let blockCommentRegEx = /(^|[ \t])(\*\>\/\*\*)+([\s\S]*?)(\*\/)/igm;
		// Regex to find parameter lines inside a documentation block
		let lineParameterRegEx = new RegExp(/([ \t]*\*>[ \t]*)(@param|@enum|@return|@throws|@optional|@default|@extends)([ ]*|[:])+([a-zA-Z0-9_\-(?)]*) *([^*/][^\r\n]*)/, "ig");
		// Find all documentation comment blocks on text
		let match: any;
		while (match = blockCommentRegEx.exec(text)) {
			let commentBlock = match[0];
			// Find all parameter lines inside a block
			let line;
			while (line = lineParameterRegEx.exec(commentBlock)) {
				// Range of parameter description type
				let startPos = activeEditor.document.positionAt(match.index + line.index + line[1].length);
				let endPos = activeEditor.document.positionAt(match.index + line.index + line[1].length + line[2].length);
				// Add the range in list to decorate
				this.rechDocTypeRangeList.push(new vscode.Range(startPos, endPos));
				// If documentation line have variable after type
				if (line[4].length != 0) {
					// Range of parameter variable
					startPos = activeEditor.document.positionAt(match.index + line.index + line[1].length + line[2].length + line[3].length);
					endPos = activeEditor.document.positionAt(match.index + line.index + line[1].length + line[2].length + line[3].length + line[4].length);
					// Add the range in list to decorate
					this.rechDocVariableRangeList.push(new vscode.Range(startPos, endPos));
				}
			}
		}
	}

	/**
	 * Applies decorations previously found
	 * @param activeEditor The active text editor containing the code document
	 */
	public ApplyDecorations(activeEditor: vscode.TextEditor): void {
		// Create decorator to RechDoc type of documentation and aply on Ranges
		let color: vscode.DecorationRenderOptions = { color: "#b294bb", backgroundColor: "transparent" };
		let decorator = vscode.window.createTextEditorDecorationType(color);
		activeEditor.setDecorations(decorator, this.rechDocTypeRangeList);
		this.rechDocTypeRangeList.length = 0;
		// Create decorator to RechDoc variable documentation and aply on Ranges
		color = { color: "#c5c8c6", backgroundColor: "transparent" };
		decorator = vscode.window.createTextEditorDecorationType(color);
		activeEditor.setDecorations(decorator, this.rechDocVariableRangeList);
		this.rechDocVariableRangeList.length = 0;
	}

}