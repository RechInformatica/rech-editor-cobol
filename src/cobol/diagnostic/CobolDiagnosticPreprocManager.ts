import { File } from "../../commons/file";
import { Log } from "../../commons/Log";

export class CobolDiagnosticPreprocManager {

  /** Pendings Callbacks */
  private static pendingCallbacks: ((file: string) => any)[] = [];
  /** Indicates if the preprocessor is called */
  private static PreprocessCallbackCalled: boolean = false;
  /** Last file content */
  private static lastFileContent: Buffer;

  /**
   * Run the preproc when possible and call all callbacks
   *
   * @param PreprocessCallback
   * @param file
   * @param fileContent
   * @param callback
   */
  public static runWhenPossible(
    PreprocessCallback: (uri: string) => Thenable<string>,
    file: File,
    fileContent: Buffer,
    callback: (file: string) => any,
    errorCallback: () => any
  ) {
    if (CobolDiagnosticPreprocManager.PreprocessCallbackCalled) {
      CobolDiagnosticPreprocManager.pendingCallbacks.push(callback);
      CobolDiagnosticPreprocManager.lastFileContent = fileContent;
      Log.get().info("CobolDiagnosticPreprocManager in waiting");
      return;
    }
    CobolDiagnosticPreprocManager.pendingCallbacks.push(callback);
    CobolDiagnosticPreprocManager.lastFileContent = fileContent;
    CobolDiagnosticPreprocManager.PreprocessCallbackCalled = true;
    Log.get().info("CobolDiagnosticPreprocManager fired to preproc " + file);
    CobolDiagnosticPreprocManager.saveSourceAndRunPreproc(PreprocessCallback, file, CobolDiagnosticPreprocManager.lastFileContent, errorCallback);
  }

  /**
   * Save the source and run the PreprocessCallback
   *
   * @param PreprocessCallback
   * @param file
   * @param fileContent
   * @param callback
   * @param errorCallback
   */
  private static saveSourceAndRunPreproc(PreprocessCallback: (uri: string) => Thenable<string>,
  file: File,
  fileContent: Buffer,
  errorCallback: () => any
  ) {
    file.saveBuffer(fileContent, "latin1").then(() => {
      CobolDiagnosticPreprocManager.runPreproc(
        PreprocessCallback,
        file,
        errorCallback
      );
    }).catch(() => {
      Log.get().info("CobolDiagnosticPreprocManager Error to save buffer " + file);
      errorCallback();
    }
    );
  }

  /**
   * Run the PreprocessCallback
   *
   * @param PreprocessCallback
   * @param file
   * @param fileContent
   * @param callback
   */
  private static runPreproc(
    PreprocessCallback: (uri: string) => Thenable<string>,
    file: File,
    errorCallback: () => any
  ) {
    const currentPendingCallbacks = CobolDiagnosticPreprocManager.pendingCallbacks;
    CobolDiagnosticPreprocManager.pendingCallbacks = [];
    PreprocessCallback(file.fileName).then(buffer => {
      CobolDiagnosticPreprocManager.PreprocessCallbackCalled = false;
      currentPendingCallbacks.forEach(currentCallback => {
        Log.get().info("CobolDiagnosticPreprocManager preproc was called " + file);
        currentCallback(buffer);
      });
      if (CobolDiagnosticPreprocManager.pendingCallbacks.length > 0) {
        CobolDiagnosticPreprocManager.saveSourceAndRunPreproc(
          PreprocessCallback,
          file,
          CobolDiagnosticPreprocManager.lastFileContent,
          errorCallback
        );
      }
    });
  }

}
