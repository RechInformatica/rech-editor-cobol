'use babel';

import * as fs from 'fs';
import { denodeify } from 'q';
import { Log } from './Log';
import { Path } from './path';

/** constant function to append file */
const appendFile = denodeify(fs.appendFile);
/** constant function to write file */
const writeFile = denodeify(fs.writeFile);
/** maximum number of deletion attempts */
const max_deletion_attempts = 30;
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
    return new File(Path.tmpdir() + Path.sep() + timestamp + ".txt");
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
          return reject(err);
        }
        return resolve(buffer)
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
          console.log(err);
        }
      }
    });
  }

  /**
   * Remove directory
   */
  public rmdir() {
    try {
      fs.rmdirSync(this.fileName);
    } catch (err) {
      console.log(err);
    }
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
    try {
      fs.unlinkSync(this.fileName);
    } catch (e) {
      Log.get().error((e as Error).message);
    }
  }

  /**
   * Delete file Retrying
   */
  public async deleteRetrying() {
    try {
      await this.deleteRetryingLoop(0);
    } catch (e) {
      Log.get().error((e as any));
    }
  }

  /**
   * Delete file Retrying loop
   */
  private deleteRetryingLoop(i: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.delete();
      if (!this.exists()) {
        return resolve(true);
      } else {
        if (i >= max_deletion_attempts) {
          return reject(false);
        } else {
          setTimeout(() => {
            return this.deleteRetryingLoop(i + 1).then((r) => {
              return resolve(r);
            }).catch((e) => {
              return reject(e);
            });
          }, 1000);
        }
      }
    });
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
