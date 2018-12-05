"use babel";
import { TextPosition } from './textPosition'

/**
 * Position in text
 */
export class TextRange {
    /** Start position of range */
    private _start: TextPosition;
    /** End position of range */
    private _end: TextPosition;
  
    constructor(start: TextPosition, end: TextPosition) {
      this._start = start;
      this._end = end;
    }
  
    /**
     * Return the start position of range
     */
    public get start() {
      return this._start;
    }
  
    /**
     * Return the end position of range
     */
    public get end() {
      return this._end;
    }
  }