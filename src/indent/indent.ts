'use babel';

import { File } from '../commons/file';
import { Executor } from '../commons/executor';

/* Time in millis representing an old indent file */
const INDENT_OLD_FILE_IN_MILLIS: number = 3000;
/* Indent file charset */
const INDENT_FILE_CHARSET: string = "latin1";

/**
 * Class to indent sources
 */
export class Indenta {

  /**
   * Indents the specified source code
   * 
   * @param alignment indentation alignment
   * @param targetSourceCode target source code to be indented
   * @param sourceFileName name of the source file to be indented
   * @param callback callback executed when no indenting errors are found
   * @param err callback executed when indenting errors are found
   */
  public indenta(alignment: string, targetSourceCode: string[], sourceFileName: string, callback: (buffer: string[]) => any, err: (bufferErr: string) => any) {
    let inputFile = this.createInputFileInstance();
    if (inputFile.exists()) {
      return;
    }
    // Saves the target source code in the input file
    inputFile.saveBufferSync(targetSourceCode, INDENT_FILE_CHARSET);
    //
    let indentFile = this.createIndentedFileInstance();
    let errorFile = this.createErrorFileIntance();
    if (indentFile.exists() || errorFile.exists()) {
      return;
    }
    // Runs the Cobol indenter
    new Executor().runSync(this.buildCommandLine(alignment, sourceFileName));
    // If any error was found
    if (errorFile.exists()) {
      err(errorFile.loadBufferSync(INDENT_FILE_CHARSET).trim());
      errorFile.delete();
      inputFile.delete();
    } else {
      indentFile.loadBuffer(INDENT_FILE_CHARSET).then((buffer) => {
        callback(buffer);
        indentFile.delete();
        inputFile.delete();
      });
    }
  }

  /**
   * Returns the name of the input file
   */
  private createInputFileInstance(): File {
    return this.createFileWithSuffix("");
  }

  /**
   * Returns the name of the indented file
   */
  private createIndentedFileInstance(): File {
    return this.createFileWithSuffix(".ident");
  }

  /**
   * Returns an instante of the error file
   */
  private createErrorFileIntance(): File {
    return this.createFileWithSuffix(".err");
  }

  /**
   * Creates a file instance with the specified suffix
   * 
   * @param suffix filename suffix
   */
  private createFileWithSuffix(suffix: string): File {
    let file = new File(this.buildTmpFileName() + suffix);
    this.deleteOldFileIfExist(file);
    return file;
  }

  /**
   * Deletes old indented filename if needed
   * 
   * @param file old indented filename
   */
  private deleteOldFileIfExist(file: File) {
    if (file.exists()) {
      let fileLastModified = file.lastModified().getTime();
      let currentTime = new Date().getTime()
      let resultTime = currentTime - fileLastModified;
      if (resultTime > INDENT_OLD_FILE_IN_MILLIS) {
        file.delete();
      }
    }
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
    return "C:\\tmp\\" + require("os").userInfo().username + ".cbl";
  }

}