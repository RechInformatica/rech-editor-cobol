'use babel';
import { Executor } from './executor';
import { Path } from './path';
import { Process } from "./Process";

export class Preproc {

  /** Options of préprocessor */
  private options = [];
  private path: string;

  /** Constructor of preprocessor */
  constructor() {
    this.path="";
  }

  /**
   * Create a new instance os preproc to update local base
   */
  static localDatabaseUpdate() {
    let newPreproc = new Preproc();
    newPreproc.addOptions(["-bd", "-bdl", "-is", "-msi"]);
    return newPreproc;
  }

  /**
   * Define the path to preprocess
   */
  public setPath(path: string | Path) {
    if (path instanceof Path) {
      this.path = path.fullPath();
    } else {
      this.path = path;
    }
    return this;
  }

  /**
   * Add Options
   */
  public addOptions(options: any) {
    this.options = this.options.concat(options);
    return this;
  }
  
  /**
   * Run preprocess
   */
  public exec() {
    return new Promise((resolve) => {
      let comandline = (this.getCmdArgs()).toString().replace(/,/g, " ");
      new Executor().runAsync(comandline, (process: Process) => {
        resolve(process);
      });
    });
  }
  
  /**
   * Return the comand line args
   */
  private getCmdArgs(): string[] {
    return ['preproc.bat'].concat(this.options).concat([this.path]);
  }

}