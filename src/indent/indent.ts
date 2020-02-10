'use babel';

import { File } from '../commons/file';
import { Executor } from '../commons/executor';
import * as iconv from 'iconv-lite';
import { BufferSplitter } from 'rech-ts-commons';

/** Time in millis representing an old indent file */
const INDENT_OLD_FILE_IN_MILLIS: number = 3000;
/** Indent file charset */
const INDENT_FILE_CHARSET: string = "binary";
/** Limit column of line */
const INDENT_LIMIT_COLUMN: number = 120;
/** Start commentary column in the line */
const START_COMMENTARY_COLUMN: number = 7;

/**
 * Class to indent sources
 */
export class Indenta {

    /**
   * Indents the specified source code if this is all commentary lines
   *
   * @param targetSourceCode target source code to be indented
   */
  public indentCommentary(targetSourceCode: string[], callback: (buffer: string[]) => any,) {
    const buffer = this.buildBufferOfCommentary(targetSourceCode);
    callback([this.buildCommentaryLines(buffer)]);
  }

  /**
   * Build buffer of commentary
   *
   * @param targetSourceCode
   */
  private buildBufferOfCommentary(targetSourceCode: string[]) {
    const buffer: string[] = [];
    targetSourceCode.forEach((occurs) => {
      BufferSplitter.split(occurs).forEach((line) => {
        line = line.replace(/\*>->/g, "").replace(/\n/g, " ").trim();
        if (line.startsWith("...")) {
          line = line.replace("...", "");
          buffer[buffer.length - 1] += line + " ";
        } else {
          if (buffer.length > 0) {
            buffer[buffer.length - 1].trim().replace(/\s{2,}/g, ' ');
          }
          if (line != "") {
            buffer.push(line + " ");
          }
        }
      });
    });
    return buffer;
  }

  /**
   * Build Commentary lines
   *
   * @param buffer
   */
  private buildCommentaryLines(buffer: string[]) {
    let result = "";
    buffer.forEach((commentary) => {
      const words = commentary.trim().split(" ");
      result += this.buildCommentBlock(words)
    })
    return result;
  }

  /**
   * Build comment block
   *
   * @param words
   */
  private buildCommentBlock(words: string[]) {
    let result: string[] = [];
    for (let i = 0; i < words.length; i++) {
      if (result.length == 0) {
        result = this.startCommentary(result, false);
      }
      const word = words[i];
      if (result[result.length - 1].length + word.length > INDENT_LIMIT_COLUMN) {
        result[result.length - 1] = result[result.length - 1].trimRight() + "\n"
        result = this.startCommentary(result, true);
      }
      result[result.length - 1] += word + " "
    }
    result[result.length - 1] += "\n"
    return result.join("");
  }

  /**
   * Start new commentary line in the buffer
   *
   * @param buffer
   */
  private startCommentary(buffer: string[], withReticences: boolean): string[] {
    const commentaryToken = "*>->";
    let commentary = ""
    for (let i = 1; i < START_COMMENTARY_COLUMN; i++) {
      commentary = commentary.concat(" ");
    }
    commentary = commentary.concat(commentaryToken);
    commentary = commentary.concat(" ");
    if (withReticences) {
      commentary = commentary.concat("...");
    }
    buffer.push(commentary);
    return buffer;
  }

  /**
   * Returns true if all lines of the buffer are commentaries
   *
   * @param buffer
   */
  public isAllCommentaryLines(buffer: string[]) {
    let result = true;
    buffer.forEach((occurs) => {
      BufferSplitter.split(occurs).forEach((line) => {
        if (!line.trimLeft().startsWith("*>->") && line !== "") {
          result = false;
        }
      });
    });
    return result;
  }

  /**
   * Indents the specified source code
   *
   * @param alignment indentation alignment
   * @param targetSourceCode target source code to be indented
   * @param sourceFileName name of the source file to be indented
   * @param callback callback executed when no indenting errors are found
   * @param err callback executed when indenting errors are found
   */
  public async indenta(alignment: string, targetSourceCode: string[], sourceFileName: string, referenceLine: number, callback: (buffer: string[]) => any, err: (bufferErr: string) => any) {
    const inputFile = this.createInputFileInstance();
    if (inputFile.exists()) {
      return;
    }
    // Saves the target source code in the input file
    const buffer = iconv.encode(targetSourceCode.join(), "win1252");
    inputFile.saveBufferSync([buffer.toString("binary")], INDENT_FILE_CHARSET);
    //
    const indentFile = this.createIndentedFileInstance();
    const errorFile = this.createErrorFileIntance();
    if (indentFile.exists() || errorFile.exists()) {
      return;
    }
    // Runs the Cobol indenter
    new Executor().runSync(this.buildCommandLine(alignment, sourceFileName, referenceLine));
    // If any error was found
    if (errorFile.exists()) {
      const buffer = iconv.encode(errorFile.loadBufferSync(INDENT_FILE_CHARSET).trim(), "binary");
      err(iconv.decode(buffer, "win1252"));
      errorFile.delete();
      inputFile.delete();
    } else {
      await indentFile.loadBuffer(INDENT_FILE_CHARSET).then((buffer) => {
        const identBuffer = iconv.encode(buffer, "binary");
        callback([iconv.decode(identBuffer, "win1252")]);
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
    const file = new File(this.buildTmpFileName() + suffix);
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
      const fileLastModified = file.lastModified().getTime();
      const currentTime = new Date().getTime()
      const resultTime = currentTime - fileLastModified;
      if (resultTime > INDENT_OLD_FILE_IN_MILLIS) {
        file.delete();
      }
    }
  }

  /**
   * Build a command line to run the indenter
   */
  private buildCommandLine(alignment: string, fonte: string, referenceLine: number): string {
    let cmd = "Identa.bat ";
    cmd += this.buildTmpFileName();
    cmd += ";" + fonte + ";" + (referenceLine + 1) + ";" + alignment + ";F;S -lines:3";
    return cmd;
  }

  /**
   * Build a temporary file name
   */
  private buildTmpFileName() {
    return "C:\\tmp\\" + require("os").userInfo().username.toLowerCase() + ".cbl";
  }

}