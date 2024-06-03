import { Editor } from './editor';
import { Log } from '../commons/Log';
import { GenericExecutor } from '../commons/genericexecutor';

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
      const executor = Editor.getSourceExpander() as GenericExecutor;
      if (executor) {
          executor.setPath(currentFile).exec(cacheFile).then((result) => {
            Log.get().info("Source expanded Files:" + files.toString() + " - " + result);
            return resolve(result);
          }).catch((e) => {
            Log.get().error("Fatal error to expand the source");
            return reject(e);
          });
      } else {
        Log.get().warning("Editor.SourceExpander was undefined");
        return resolve("");
      }
    });
  }

}
