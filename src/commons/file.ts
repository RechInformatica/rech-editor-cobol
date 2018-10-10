'use babel';

import * as fs from 'fs';
import { denodeify } from 'q';

/** constant function to append file */
const appendFile = denodeify(fs.appendFile);
/** constant function to write file */
const writeFile = denodeify(fs.writeFile);
/** constant function to read file */
const readFile = denodeify<string[]>(fs.readFile);

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
    let timestamp = Date.now().toString();
    return new File("C:\\tmp\\" + timestamp + ".txt");
  }

  /**
   * Save a buffer in file
   * 
   * @param buffer 
   * @param encoding 
   */
  public saveBuffer(buffer: string[], encoding?: string): Q.Promise<{}> {
    return writeFile(this.fileName, buffer, { encoding: encoding });
  }

  /**
   * Append a buffer in file
   */
  public appendBuffer(buffer: string[]): Q.Promise<{}> {
    return appendFile(this.fileName, buffer);
  }

  /**
   * Load the file content
   */
  public loadBuffer(encoding?: string): Q.Promise<string[]> {
    return readFile(this.fileName, { encoding: encoding });
  }

  /**
   * load the file content synchronously
   */
  public loadBufferSync(encoding: string): string {
    return fs.readFileSync(this.fileName, {encoding: encoding});
  }


  /**
   * Tests whether the file exists
   */
  public exists(): boolean {
      return fs.existsSync(this.fileName);
  }

  /**
   * Create a new directory
   */
  public mkdir() {
    try {
      fs.mkdirSync(this.fileName);
    } catch (err) {
    }
  }

  /**
   * Copy file
   */
  public copy(dest: string) {
    fs.createReadStream(this.fileName).pipe(fs.createWriteStream(dest));
  }

  /**
   * Return the fileName
   */
  public get fileName(): string {
    return this._fileName;
  }

}