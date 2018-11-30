
import { Path } from './path';

/**
 * Generic Executer class
 */
export interface GenericExecutor {
    
  /**
   * Define path
   * 
   * @param path 
   */
  setPath(path: string | Path): GenericExecutor;
 
  /**
   * Execute
   */
  exec(file?: string): Promise<any>;

}

