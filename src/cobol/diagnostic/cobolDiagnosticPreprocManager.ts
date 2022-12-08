import { File } from "../../commons/file";
import { Log } from "../../commons/Log";

export class CobolDiagnosticPreprocManager {

  /** Pendings Callbacks */
  private static pendingCallbacks: ((file: string) => any)[] = [];
  /** Indicates if the preprocessor is called */
  private static preprocessCallbackCalled: boolean = false;
  /** Last file content */
  private static lastFileContent: Buffer;

  /**
   * Run the preproc when possible and call all callbacks
   *
   * @param preprocessCallback
   * @param file
   * @param fileContent
   * @param callback
   */
  public static runWhenPossible(
    preprocessCallback: (uri: string) => Thenable<string>,
    file: File,
    fileContent: Buffer,
    callback: (file: string) => any,
    errorCallback: (error: any) => any
  ) {
    if (CobolDiagnosticPreprocManager.preprocessCallbackCalled) {
      CobolDiagnosticPreprocManager.pendingCallbacks.push(callback);
      CobolDiagnosticPreprocManager.lastFileContent = fileContent;
      Log.get().info("CobolDiagnosticPreprocManager in waiting");
      return;
    }
    CobolDiagnosticPreprocManager.pendingCallbacks.push(callback);
    CobolDiagnosticPreprocManager.lastFileContent = fileContent;
    CobolDiagnosticPreprocManager.preprocessCallbackCalled = true;
    Log.get().info("CobolDiagnosticPreprocManager fired to preproc " + file);
    CobolDiagnosticPreprocManager.saveSourceAndRunPreproc(preprocessCallback, file, CobolDiagnosticPreprocManager.lastFileContent, errorCallback);
  }

  /**
   * Save the source and run the preprocessCallback
   *
   * @param preprocessCallback
   * @param file
   * @param fileContent
   * @param callback
   * @param errorCallback
   */
  private static saveSourceAndRunPreproc(preprocessCallback: (uri: string) => Thenable<string>,
  file: File,
  fileContent: Buffer,
  errorCallback: (error: any) => any
  ) {
    file.saveBuffer(fileContent, "latin1").then(() => {
      CobolDiagnosticPreprocManager.runPreproc(
        preprocessCallback,
        file,
        errorCallback
      );
    }).catch((e) => {
      Log.get().info("CobolDiagnosticPreprocManager Error to save buffer " + file);
      errorCallback(e);
    }
    );
  }

  /**
   * Run the preprocessCallback
   *
   * @param preprocessCallback
   * @param file
   * @param fileContent
   * @param callback
   */
  private static runPreproc(
    preprocessCallback: (uri: string) => Thenable<string>,
    file: File,
    errorCallback: (error: any) => any
  ) {
    const currentPendingCallbacks = CobolDiagnosticPreprocManager.pendingCallbacks;
    CobolDiagnosticPreprocManager.pendingCallbacks = [];
    preprocessCallback(file.fileName).then(buffer => {
      CobolDiagnosticPreprocManager.preprocessCallbackCalled = false;
      currentPendingCallbacks.forEach(currentCallback => {
        Log.get().info("CobolDiagnosticPreprocManager preproc was called " + file);
        currentCallback(buffer);
      });
      if (CobolDiagnosticPreprocManager.pendingCallbacks.length > 0) {
        CobolDiagnosticPreprocManager.saveSourceAndRunPreproc(
          preprocessCallback,
          file,
          CobolDiagnosticPreprocManager.lastFileContent,
          errorCallback
        );
      }
    });
  }

}
