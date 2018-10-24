
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
   * Execute
   */
  exec(file: string): Promise<any>;

}

