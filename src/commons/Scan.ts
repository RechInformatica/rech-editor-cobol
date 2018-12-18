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
  public scan(regexp: RegExp,  iterator: any) {
    var match = regexp.exec(this.buffer);
    var interrupt = false;
    while (match != null && !interrupt) {
      // callback of iteration
      iterator({
        match: match,
        row: this.countLinesTo(match.index),
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
  private countLinesTo(index: number) {
    var notProcessed = this.buffer.substring(this.lastLine.index);
    var patt = /\n/g;
    var match = patt.exec(notProcessed);
    var lastIndex = this.lastLine.index;
    while (match != null) {
      if (this.lastLine.index + match.index > index) {
        break;
      }
      this.lastLine.row++;
      lastIndex = this.lastLine.index + match.index + 1;
      match = patt.exec(notProcessed);
    }
    this.lastLine.index = lastIndex;
    return this.lastLine.row;
  }

}