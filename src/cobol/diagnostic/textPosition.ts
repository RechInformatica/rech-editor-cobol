"use babel";

/**
 * Position in text
 */
export class TextPosition {
    /** Line */
    private _line: number;
    /** Character */
    private _character: number;
  
    constructor(line: number, character: number) {
      this._line = line;
      this._character = character;
    }
  
    /**
     * Return the line
     */
    public get line() {
      return this._line;
    }
  
    /**
     * Return the character
     */
    public get character() {
      return this._character;
    }
  }