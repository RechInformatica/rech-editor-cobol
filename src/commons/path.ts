'use babel';

class Path {
  path: string;
  
  constructor(path: any) {
    if (typeof path === "string") {
      this.path = path;
    } else {
      this.path = path.toString();
    }
    this.path = this.path.replace(/\//g, "\\");
  }

  /**
   * Retorna o diretório com barra no final
   */
  directory() {
    if (this.path.endsWith("\\")) {
      return this.path;
    } else {
      return this.path.substring(0, this.path.lastIndexOf('\\') + 1);
    }
  }

  fileName() {
    return this.path.substring(this.path.lastIndexOf('\\') + 1, this.path.length);
  }

  baseName() {
    var fileName = this.fileName();
    return fileName.substring(0, fileName.lastIndexOf('.'));
  }

  extension() {
    var fileName = this.fileName();
    return fileName.substring(fileName.lastIndexOf('.'));
  }

  fullPath() {
    return this.path;
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

export {Path};