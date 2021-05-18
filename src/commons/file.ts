'use babel';

import * as fs from 'fs';
import { denodeify } from 'q';

/** constant function to append file */
const appendFile = denodeify(fs.appendFile);
/** constant function to write file */
const writeFile = denodeify(fs.writeFile);

/**
 * Class to manipulate files
 */
export class File {

  /** File name */
  private _fileName: string;

  /**
   * Create a new file
   *
   */
  constructor(path: string) {
    this._fileName = path;
  }

  /**
   * Create a new temporary file
   */
  public static tmpFile(): File {
    const timestamp = Date.now().toString();
    return new File("C:\\tmp\\" + timestamp + ".txt");
  }

  /**
   * Save a buffer in file
   *
   * @param buffer
   * @param encoding
   */
  public saveBuffer(buffer: Buffer, encoding?: string): Q.Promise<any> {
    return writeFile(this.fileName, buffer, { encoding: encoding });
  }

  /**
   * Synchronously save a buffer in file
   *
   * @param buffer
   * @param encoding
   */
  public saveBufferSync(buffer: Buffer, encoding?: string): void {
    fs.writeFileSync(this.fileName, buffer, { encoding: encoding });
  }

  /**
   * Append a buffer in file
   */
  public appendBuffer(buffer: Buffer, encoding?: string): Q.Promise<any> {
    return appendFile(this.fileName, buffer, { encoding: encoding });
  }

  /**
   * Append a buffer in file Synchronously
   */
  public appendBufferSync(buffer: Buffer, encoding?: string): void {
    fs.appendFileSync(this.fileName, buffer, { encoding: encoding });
  }

  /**
   * Load the file content
   */
  public loadBuffer(encoding?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!encoding) {
        encoding = "latin1";
      }
      fs.readFile(this.fileName, { encoding: encoding }, (err, buffer)=> {
        if (err) {
          reject();
        }
        resolve(buffer)
      });
    });
  }

  /**
   * Load the file content synchronously
   */
  public loadBufferSync(encoding: string): string {
    return fs.readFileSync(this.fileName, { encoding: encoding });
  }

  /**
   * Tests whether the file exists
   */
  public exists(): boolean {
    return fs.existsSync(this.fileName.trim());
  }

  /**
   * Create a new directory
   */
  public mkdir() {
    const partsOfFileName = this.fileName.split("\\");
    let directory = "";
    partsOfFileName.forEach((currentPart) => {
      directory == "" ? directory = currentPart : directory = directory + "\\" + currentPart;
      if (!new File(directory).exists()) {
        try {
          fs.mkdirSync(directory);
        } catch (err) {
        }
      }
    });
  }

  /**
   * Copy file
   */
  public copy(dest: string, callback: () => void) {
    fs.copyFile(this.fileName, dest, callback);
  }

  /**
   * Delete file
   */
  public delete() {
    fs.unlinkSync(this.fileName);
  }

  /**
   * Returns a list of files on the current diretory considering the specified extension
   *
   * @param extensionFilter file extension to be filtered
   */
  public dirFiles(extensionFilter?: string): string[] {
    const files = fs.readdirSync(this._fileName);
    if (!extensionFilter) {
      return files;
    }
    const filtered: string[] = [];
    files.forEach(currentFile => {
      if (currentFile.endsWith(extensionFilter)) {
        filtered.push(currentFile);
      }
    });
    return filtered;
  }

  /**
   * Returns the file last modification date
   *
   * @returns Date
   */
  public lastModified(): Date {
    const stats = fs.statSync(this.fileName);
    const mtime = new Date(stats.mtime);
    return mtime;
  }

  /**
   * Return the fileName
   */
  public get fileName(): string {
    return this._fileName;
  }

}
