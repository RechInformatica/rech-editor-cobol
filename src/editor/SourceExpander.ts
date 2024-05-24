import { Editor } from './editor';
import { Log } from '../commons/Log';

/**
 * Class to expand Cobol source codes
 */
export class SourceExpander {

	/**
	 * Creates a promise for Cobol Preprocessor expander execution
   *
   * This method should always be called on the client-side
	 *
	 * @param files file array with necessary files
	 */
  public createExpanderExecutionPromise(files: string[]) {
    return new Promise<string>((resolve, reject) => {
      const currentFile = files[0];
      const cacheFile = files[1];
      const executor = Editor.getSourceExpander();
      if (executor && typeof executor.setPath === 'function') {
        executor.setPath(currentFile).exec(cacheFile).then((result) => {
          Log.get().info("Source expanded Files:" + files.toString() + " - " + result);
          resolve(result);
        }).catch((e) => {
          Log.get().error("Fatal error to expand the source");
          reject(e);
        });
      } else {
        Log.get().warning("Editor.SourceExpander was undefined");
        resolve("");
      }
    });
  }

}
