import { Editor } from './editor';

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
      let currentFile = files[0];
      let cacheFile = files[1];
      let executor = Editor.getSourceExpander();
      if (executor) {
        executor.setPath(currentFile).exec(cacheFile).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      } else {
        reject();
      }
    });
  }

}