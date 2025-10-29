'use babel';
import * as path from 'path';
import * as os from 'os';

export class Path {
  path: string;

  constructor(pathArg: any) {
    if (typeof pathArg === "string") {
      this.path = pathArg;
    } else {
      this.path = pathArg.toString();
    }
    this.path = this.path.replace(/\//g, "\\");
  }

  /**
   * Returns the default path separator
   */
  public static sep(): string {
    return path.sep;
  }

  /**
   * Returns the current user temp directory
   */
  public static tmpdir(): string {
    return os.tmpdir();
  }

  /**
   * Returns the directory with final path separator
   */
  directory() {
    if (this.path.endsWith(Path.sep())) {
      return this.path;
    } else {
      return this.path.substring(0, this.path.lastIndexOf(Path.sep()) + 1);
    }
  }

  fileName() {
    return this.path.substring(this.path.lastIndexOf(Path.sep()) + 1, this.path.length);
  }

  baseName() {
    const fileName = this.fileName();
    return fileName.substring(0, fileName.lastIndexOf('.'));
  }

  extension() {
    const fileName = this.fileName();
    return fileName.substring(fileName.lastIndexOf('.'));
  }

  fullPath() {
    return this.path;
  }

  /**
   * Return the fullPath in Windows format
   */
  fullPathWin() {
    return this.path.replace(/\//g, "\\").replace("file:\\\\\\", "").replace("%3A", ":").replace(/%5C/gi, "\\");
  }

  /**
   * Return the fullPath in Vscode format
   */
  fullPathVscode() {
    return "file:///" + this.path.replace(/\\/g, "/").replace(/:/g, "%3A").replace("%3A", ":").replace(/\\/gi, "%5C");
  }

  /**
   * Retorna um novo Path com um nome diferente
   */
  setFileName(fileName: string) {
    return new Path(this.directory() + fileName);
  }

  toString() {
    return this.path;
  }

}
