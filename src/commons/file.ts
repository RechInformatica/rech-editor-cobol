'use babel';

import * as fs from 'fs';
import { denodeify } from 'q';

const appendFile = denodeify(fs.appendFile);
const writeFile = denodeify(fs.writeFile);
const readFile = denodeify<string[]>(fs.readFile);

/**
 * Classe de manipulação de arquivos
 */
export default class File {

  private _fileName: string;
  
  /**
   * Cria um novo arquivo
   * 
   */
  constructor(path: string) {
    this._fileName = path;
  }

  /**
   * Retorna um arquivo temporário
   */
  public static tmpFile(): File {
    let timestamp = Date.now().toString();
    return new File("C:\\teste\\" + timestamp + ".txt");
  }

  /**
   * Salva um conteúdo no arquivo. Sobreescre o conteúdo original e retorna uma Promise quando o arquivo for
   * gravado.
   */
  public saveBuffer(buffer: string[]) {
    return writeFile(this.fileName, buffer);
  }

  /**
   * Apenda o conteúdo no arquivo. Cria o arquivo caso não exista e retorna um Promise quando for gravado
   */
  public appendBuffer(buffer: string[]) {
    return appendFile(this.fileName, buffer);
  }

  /**
   * Carrega o conteúdo do arquivo, retornando uma promise
   */
  public loadBuffer() {
    return readFile(this.fileName);
  }


  /**
   * Testa se um arquivo existe
   */
  public exists(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fs.exists(this.fileName, exists => {
        resolve(exists);
      });
    });
  }

  /**
   * Cria o diretório
   */
  public mkdir() {
    try {
      fs.mkdirSync(this.fileName);
    } catch (err) {
    }
  }

  /**
   * Copia um arquivo
   */
  public copy(dest: string) {
    var fs = require('fs');
    fs.createReadStream(this.fileName).pipe(fs.createWriteStream(dest));
  }

  /**
   * Retorna o nome do arquivo
   */
  public get fileName(): string {
    return this._fileName;
  }

}

export { File };