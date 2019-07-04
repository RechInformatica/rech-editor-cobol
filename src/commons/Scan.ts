/**
 * Class to Scan buffers
 */
export class Scan {

  /** Buffer */
  private buffer: string;
  /** last line */
  private lastLine: {row: number,
                      index: number};

  /**
   * Constructor of Scan
   *
   * @param buffer
   */
  public constructor(buffer: string) {
    this.buffer = buffer;
    this.lastLine = {
      row: 0,
      index: 0
    };
  }

/**
   * Scan the buffer
   */
  public reverseScan(regexp: RegExp,  startLine: number, iterator: any) {
    const bufferLines = this.buffer.split("\n");
    let buffer = "";
    buffer = bufferLines.slice(0, startLine + 1).reverse().join("\n") + "\n";
    buffer += bufferLines.slice(startLine + 1, bufferLines.length).join("\n");
    var match = regexp.exec(buffer);
    var interrupt = false;
    while (match != null && !interrupt) {
      // callback of iteration
      iterator({
        match: match,
        row: this.countLinesTo(match.index, buffer, startLine),
        column: match.index - this.lastLine.index,
        lineContent: buffer.substring(this.lastLine.index, buffer.indexOf('\n', this.lastLine.index)).replace("\r", ""),
        stop: function() {
          interrupt = true;
        }
      });
      match = regexp.exec(buffer);
    }
  }

  /**
   * Scan the buffer
   */
  public scan(regexp: RegExp,  iterator: any) {
    var match = regexp.exec(this.buffer);
    var interrupt = false;
    while (match != null && !interrupt) {
      // callback of iteration
      iterator({
        match: match,
        row: this.countLinesTo(match.index, this.buffer, 0),
        column: match.index - this.lastLine.index,
        lineContent: this.buffer.substring(this.lastLine.index, this.buffer.indexOf('\n', this.lastLine.index)).replace("\r", ""),
        stop: function() {
          interrupt = true;
        }
      });
      match = regexp.exec(this.buffer);
    }
  }

  /**
   * Count lines to the specified index
   */
  private countLinesTo(index: number, buffer: string, startLine: number) {
    const notProcessed = buffer.substring(this.lastLine.index);
    const patt = /\n/g;
    let match = patt.exec(notProcessed);
    let lastIndex = this.lastLine.index;
    while (match != null) {
      if (this.lastLine.index + match.index > index) {
        break;
      }
      this.lastLine.row++;
      lastIndex = this.lastLine.index + match.index + 1;
      match = patt.exec(notProcessed);
    }
    this.lastLine.index = lastIndex;

    if (this.lastLine.row > startLine) {
      return this.lastLine.row;
    } else {
      return startLine - this.lastLine.row;
    }

  }

}