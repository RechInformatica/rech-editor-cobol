
import { Path } from './path';

/**
 * Generic Executer class
 */
export interface GenericExecuter {
    
  /**
   * Define path
   * 
   * @param path 
   */
  setPath(path: string | Path): GenericExecuter;
  
  /**
   * Build command line
   * 
   * @param options
   */
  buildCommandLine(optins: any[]): GenericExecuter;
 
  /**
   * Execute
   */
  exec(): Promise<any>;

}

