'use babel';

import { File } from '../commons/file';
import Executor from '../commons/executor';

/**
 * Class to indent sources
 */
export default class Indenta {
  
  /**
   * Indent the block
   * 
   * @param alignment 
   * @param bloco 
   * @param fonte 
   * @param callback 
   * @param err 
   */
  public indenta(alignment: string, bloco: string[], fonte: string, callback: (buffer: string[]) => any, err: (bufferErr: string) => any) {
    // Save the block in a file
    let file = new File(this.buildTmpFileName());
    file.saveBuffer(bloco).then(() => {
      let indentFile = new File(this.buildTmpFileName() + ".ident");
      let errFile = new File(this.buildTmpFileName() + ".err");
      // Run the indenter
      new Executor().exec(this.buildCommandLine(alignment, fonte), () => {
        // If an error occurred
        if (errFile.exists()){
          err(errFile.loadBufferSync("latin1"));
        } else {
          // Load a indent content
          indentFile.loadBuffer().then((buffer) => {
            callback(buffer);
          });
        }
      });
    });
  }

  /**
   * Build a command line to run the indenter
   */
  private buildCommandLine(alignment: string, fonte: string): string {
    let cmd = "Identa.bat ";
    cmd += this.buildTmpFileName();
    cmd += ";" + fonte + ";1;" + alignment + ";F;S -lines:3";
    return cmd;
  }
  
  /**
   * Build a temporary file name
   */
  private buildTmpFileName() {
    return "C:\\tmp\\"+ require("os").userInfo().username + ".cbl";
  }

}

export { Indenta };