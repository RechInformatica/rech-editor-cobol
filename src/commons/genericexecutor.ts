
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
   * Define parâmetros extras para execução
   *
   * @param params
   */
  setExtraParams(params: Map<string, string[]>): GenericExecutor;

  /**
   * Execute
   */
  exec(file?: string): Promise<any>;


}

