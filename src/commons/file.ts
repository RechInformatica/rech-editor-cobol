'use babel';

import { File as AtomFile } from 'atom';

export default class File {
  path: string;
  

  constructor(path: any) {
    if (typeof path === "string") {
      this.path = path;
    } else {
      this.path = path.toString();
    }
    this.atomFile = new AtomFile(this.path, false);
    this.atomFile.setEncoding('windows-1252')
  }

  /**
   * Salva um conteúdo no arquivo. Sobreescre o conteúdo original e uma Promise que será executada quando o arquivo for
   * gravado.
   */
  saveBuffer(buffer) {
    return this.atomFile.write(buffer);
  }

  /**
   * Carrega o conteúdo do arquivo, retornando uma promise
   */
  loadBuffer() {
    return this.atomFile.read();
  }

  /**
   * Testa se um arquivo existe
   */
  exists() {
    return this.atomFile.existsSync();
  }

  /**
   * Cria o diretório
   */
  mkdir() {
    const fs = require('fs');
    try {
      fs.mkdirSync(this.path);
    } catch (err) {
    }
  }

  /**
   * Copia um arquivo
   */
  copy(dest) {
    var fs = require('fs');
    fs.createReadStream(this.path).pipe(fs.createWriteStream(dest));
  }

}
