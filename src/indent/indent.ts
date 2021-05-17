'use babel';

import { File } from '../commons/file';
import { Executor } from '../commons/executor';
import * as iconv from 'iconv-lite';
import { BufferSplitter } from 'rech-ts-commons';
import { configuration } from '../helpers/configuration';

/** Time in millis representing an old indent file */
const INDENT_OLD_FILE_IN_MILLIS: number = 3000;
/** Binary encoding */
const BINARY_ENCODING: string = "binary";
/** Windows 1252 encoding */
const WINDOWS_1252_ENCODING: string = "win1252";
/** Limit column of line */
const INDENT_LIMIT_COLUMN: number = 120;
/** Start commentary column in the line */
const START_COMMENTARY_COLUMN: number = 7;
/** OS module */
const os = require("os");
/** Path module */
const path = require("path");

/**
 * Class to indent sources
 */
export class Indenta {

  /**
   * Indents the specified source code if this is all commentary lines
   *
   * @param targetSourceCode target source code to be indented
   */
  public indentCommentary(targetSourceCode: string[], callback: (buffer: string[]) => any): void {
    const buffer = this.buildBufferOfCommentary(targetSourceCode);
    callback([this.buildCommentaryLines(buffer)]);
  }

  /**
   * Build buffer of commentary
   *
   * @param targetSourceCode
   */
  private buildBufferOfCommentary(targetSourceCode: string[]): string[] {
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
  private buildCommentaryLines(buffer: string[]): string {
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
  private buildCommentBlock(words: string[]): string {
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
  public isAllCommentaryLines(buffer: string[]): boolean {
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
  public async indenta(alignment: string, targetSourceCode: string[], sourceFileName: string, referenceLine: number, callback: (buffer: string[]) => any, err: (bufferErr: string) => any): Promise<void> {
    const inputFile = this.createInputFileInstance();
    if (inputFile.exists()) {
      return;
    }
    // Saves the target source code in the input file
    const buffer = iconv.encode(targetSourceCode.join(), WINDOWS_1252_ENCODING);
    inputFile.saveBufferSync(buffer, BINARY_ENCODING);
    //
    const indentFile = this.createIndentedFileInstance();
    const errorFile = this.createErrorFileIntance();
    if (indentFile.exists() || errorFile.exists()) {
      return;
    }
    // Runs the Cobol indenter
    const commandLine = this.buildCommandLine(alignment, sourceFileName, referenceLine);
    if (commandLine.length == 0) {
      return err("No COBOL formatter configured! Please configure formatter location on Rech COBOL extension settings.");
    }
    new Executor().runSync(commandLine);
    // If any error was found
    if (errorFile.exists()) {
      const buffer = iconv.encode(errorFile.loadBufferSync(BINARY_ENCODING).trim(), BINARY_ENCODING);
      err(iconv.decode(buffer, WINDOWS_1252_ENCODING));
      errorFile.delete();
      inputFile.delete();
    } else {
      await indentFile.loadBuffer(BINARY_ENCODING).then((buffer) => {
        const identBuffer = iconv.encode(buffer, BINARY_ENCODING);
        callback([iconv.decode(identBuffer, WINDOWS_1252_ENCODING)]);
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
  private deleteOldFileIfExist(file: File): void {
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
    let cmd = this.getConfiguredFormatterLocation();
    if (cmd.length == 0) {
      return "";
    }
    cmd += " " + this.buildTmpFileName();
    cmd += ";" + fonte + ";" + (referenceLine + 1) + ";" + alignment + ";F;S -lines:3";
    return cmd;
  }

  /**
   * Returns the configured COBOL formatter location for this extension
   */
  private getConfiguredFormatterLocation(): string {
    const path = configuration.get("formatter.location", "").trim();
    const pathWithQuotes = this.insertQuotesIfNeeded(path);
    return pathWithQuotes;
  }

  /**
   * Insert quotes on the specified path if needed.
   * If the path already contains quotes or the path is empty, the path itself is returned.
   *
   * @param path path where quotes will be inserted
   */
  private insertQuotesIfNeeded(path: string): string {
    if (path.length == 0 || this.containsQuotes(path)) {
      return path;
    }
    return "\"" + path + "\"";
  }

  /**
   * Returns true if the specified path contains quotes at the beginning or the end of the string
   *
   * @param path path to check if already contains quotes
   */
  private containsQuotes(path: string): boolean {
    const length = path.length;
    const containsQuotes = (path.charAt(0) == "\"" && path.charAt(length - 1) == "\"");
    return containsQuotes;
  }

  /**
   * Build a temporary file name
   */
  private buildTmpFileName(): string {
    const tempDirectory = this.getTempDirectoryWithSeparator();
    const username = os.userInfo().username.toLowerCase();
    const extension = ".cbl";
    const tempFileName = tempDirectory + username + extension;
    return tempFileName;
  }

  /**
   * Returns the temp directory with separator
   */
  private getTempDirectoryWithSeparator(): string {
    const tempDirectory = os.tmpdir();
    const separator = path.sep;
    if (tempDirectory) {
      if (tempDirectory.endsWith(separator)) {
        return tempDirectory;
      }
      return tempDirectory + separator;
    }
    return "";
  }

}
