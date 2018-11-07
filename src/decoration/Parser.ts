import * as vscode from 'vscode';

interface CommentTag {
	tag: string;
	escapedTag: string;
	decoration: vscode.TextEditorDecorationType;
	ranges: Array<vscode.DecorationOptions>;
}

interface Contributions {
	tags: [{
		tag: string;
		color: string;
		backgroundColor: string;
	}];
}

export class Parser {
	private tags: CommentTag[] = [];
	private expression: string = "";
	private delimiter: string = "";
	public supportedLanguage = true;
	// Read from the package.json
	private contributions: Contributions = vscode.workspace.getConfiguration('comments-highlight') as any;

	public constructor() {
		this.setTags();
	}

	/**
	 * Sets the regex to be used by the matcher based on the config specified in the package.json
	 * @param languageCode The short code of the current language
	 * https://code.visualstudio.com/docs/languages/identifiers
	 */
	public SetRegex(languageCode: string) {
		this.setDelimiter(languageCode);
		// if the language isn't supported, we don't need to go any further
		if (!this.supportedLanguage) {
			return;
		}
		let characters: Array<string> = [];
		for (let commentTag of this.tags) {
			characters.push(commentTag.escapedTag);
		}
		// start by finding the delimiter (//, --, #, ') with optional spaces or tabs
		this.expression = "(" + this.delimiter.replace(/\//ig, "\\/") + ")+( |\t)*";
		// Apply all configurable comment start tags
		this.expression += "(";
		this.expression += characters.join("|");
		this.expression += ")+(.*)";
	}

	/**
	 * Finds all single line comments delimited by a given delimeter and matching tags specified in package.json
	 * @param activeEditor The active text editor containing the code document
	 */
	public FindSingleLineComments(activeEditor: vscode.TextEditor): void {
		let text = activeEditor.document.getText();
		let regEx = new RegExp(this.expression, "ig");
		let match: any;
		while (match = regEx.exec(text)) {
			let startPos = activeEditor.document.positionAt(match.index);
			let endPos = activeEditor.document.positionAt(match.index + match[0].length);
			let range = { range: new vscode.Range(startPos, endPos) };
			// Find which custom delimiter configured on package.json in order to add it to the collection
			let matchTag = this.tags.find(item => item.tag.toLowerCase() === match[3].toLowerCase());
			if (matchTag) {
				matchTag.ranges.push(range);
			}
		}
	}

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
				let range: vscode.DecorationOptions = { range: new vscode.Range(startPos, endPos) };
				// Find which custom delimiter configured on package.json in order to add it to the collection
				let matchTag = this.tags.find(item => item.tag === "RechDocType");
				if (matchTag) {
					matchTag.ranges.push(range);
				}
				if (line[4].length != 0) {
					// Range of parameter variable 
					startPos = activeEditor.document.positionAt(match.index + line.index + line[1].length + line[2].length + line[3].length);
					endPos = activeEditor.document.positionAt(match.index + line.index + line[1].length + line[2].length + line[3].length + line[4].length);
					range = { range: new vscode.Range(startPos, endPos) };
					// Find which custom delimiter configured on package.json in order to add it to the collection
					matchTag = this.tags.find(item => item.tag === "RechDocVariable");
					if (matchTag) {
						matchTag.ranges.push(range);
					}
				}
			}
		}
	}

	/**
	 * Applies decorations previously found 
	 * @param activeEditor The active text editor containing the code document
	 */
	public ApplyDecorations(activeEditor: vscode.TextEditor): void {
		for (let tag of this.tags) {
			activeEditor.setDecorations(tag.decoration, tag.ranges);
			// Clear the ranges for the next pass
			tag.ranges.length = 0;
		}
	}

	/**
	 * Sets the comment delimiter [//, #, --, '] of a given language
	 * @param languageCode The short code of the current language
	 * https://code.visualstudio.com/docs/languages/identifiers
	 */
	private setDelimiter(languageCode: string): void {
		this.supportedLanguage = true;
		switch (languageCode) {
			case "COBOL":
				this.delimiter = this.escapeRegExp("*>->");
				break;
			default:
				this.supportedLanguage = false;
				break;
		}
	}

	/**
	 * Sets the highlighting tags up for use by the parser
	 */
	private setTags(): void {
		let items = this.contributions.tags;
		for (let item of items) {
			let options: vscode.DecorationRenderOptions = { color: item.color, backgroundColor: item.backgroundColor };
			let escapedSequence = item.tag.replace(/([()[{*+.$^\\|?])/g, '\\$1');
			this.tags.push({
				tag: item.tag,
				escapedTag: escapedSequence.replace(/\//gi, "\\/"), // ! hardcoded to escape slashes
				ranges: [],
				decoration: vscode.window.createTextEditorDecorationType(options)
			});
		}
	}

	/**
	 * Escapes a given string for use in a regular expression
	 * @param input The input string to be escaped
	 * @returns {string} The escaped string
	 */
	private escapeRegExp(input: string): string {
		return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

}