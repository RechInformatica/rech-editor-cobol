import { File } from "../../commons/file";

/* Time in millis representing an old file */
const OLD_FILE_IN_MILLIS: number = 1000;

export class CobolDiagnosticPreprocManager {

  /** Pendings Callbacks */
  private static pendingCallbacks: ((file: string) => any)[] = [];
  /** Indicates if the preprocessor is called */
  private static PreprocessCallbackCalled: boolean = false;
  /** Last file content */
  private static lastFileContent: string[];

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
    fileContent: string[],
    callback: (file: string) => any,
    errorCallback: () => any
  ) {
    if (CobolDiagnosticPreprocManager.PreprocessCallbackCalled) {
      CobolDiagnosticPreprocManager.pendingCallbacks.push(callback);
      CobolDiagnosticPreprocManager.lastFileContent = fileContent;
      return;
    }
    CobolDiagnosticPreprocManager.pendingCallbacks.push(callback);
    CobolDiagnosticPreprocManager.lastFileContent = fileContent;
    CobolDiagnosticPreprocManager.PreprocessCallbackCalled = true;
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
  fileContent: string[],
  errorCallback: () => any
  ) {
    file.saveBuffer(fileContent, "latin1").then(() => {
      CobolDiagnosticPreprocManager.runPreproc(
        PreprocessCallback,
        file,
        errorCallback
      );
    }).catch(() => errorCallback());
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
    let currentPendingCallbacks = CobolDiagnosticPreprocManager.pendingCallbacks;
    CobolDiagnosticPreprocManager.pendingCallbacks = [];
    PreprocessCallback(file.fileName).then(buffer => {
      CobolDiagnosticPreprocManager.PreprocessCallbackCalled = false;
      currentPendingCallbacks.forEach(currentCallback => {
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
