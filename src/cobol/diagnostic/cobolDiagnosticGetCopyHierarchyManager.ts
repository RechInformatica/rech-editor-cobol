import { kill } from "process";
import { Log } from "../../commons/Log";

export class CobolDiagnosticGetCopyHierarchyManager {

  /** Pendings Callbacks */
  private static pendingCallbacks: Map<string, ((buffer: string) => any)[]> = new Map;
  /** Indicates if the preprocessor is called */
  private static PreprocessCallbackCalled: boolean = false;

  /**
   * Run the preproc when possible and call all callbacks
   *
   * @param PreprocessCallback
   * @param file
   * @param fileContent
   * @param callback
   */
  public static runWhenPossible(
    externalGetCopyHierarchy: (uri: string) => Thenable<string>,
    fileName: string,
    callback: (resultCopyHierarchy: string) => any,
    errorCallback: () => any
  ) {
    if (CobolDiagnosticGetCopyHierarchyManager.PreprocessCallbackCalled) {
      CobolDiagnosticGetCopyHierarchyManager.addPendingCallbacks(fileName, callback)
      Log.get().info("CobolDiagnosticGetCopyHierarchyManager in waiting");
      return;
    }
    CobolDiagnosticGetCopyHierarchyManager.addPendingCallbacks(fileName, callback);
    CobolDiagnosticGetCopyHierarchyManager.PreprocessCallbackCalled = true;
    Log.get().info("CobolDiagnosticGetCopyHierarchyManager fired to preproc " + fileName);
    CobolDiagnosticGetCopyHierarchyManager.runGetCopyHierarchy(externalGetCopyHierarchy, fileName, errorCallback);
  }

  /**
   * Add fileName and callback to pending queue
   *
   * @param fileName
   * @param callback
   */
  private static addPendingCallbacks(fileName: string, callback: (resultCopyHierarchy: string) => any) {
    let pendingCallbacksFromFile: ((buffer: string) => any)[] = [];
    if (CobolDiagnosticGetCopyHierarchyManager.pendingCallbacks.get(fileName) == undefined) {
      CobolDiagnosticGetCopyHierarchyManager.pendingCallbacks.set(fileName, pendingCallbacksFromFile);
    } else {
      pendingCallbacksFromFile = CobolDiagnosticGetCopyHierarchyManager.pendingCallbacks.get(fileName)!;
    }
    pendingCallbacksFromFile.push(callback);
  }

  /**
   * Run the PreprocessCallback
   *
   * @param PreprocessCallback
   * @param file
   * @param fileContent
   * @param callback
   */
  private static runGetCopyHierarchy(
    externalGetCopyHierarchy: (uri: string) => Thenable<string>,
    fileName: string,
    errorCallback: () => any
  ) {
    let currentPendingCallbacks: ((buffer: string) => any)[];
    if (CobolDiagnosticGetCopyHierarchyManager.pendingCallbacks.get(fileName) != undefined) {
      currentPendingCallbacks = CobolDiagnosticGetCopyHierarchyManager.pendingCallbacks.get(fileName)!;
    } else {
      currentPendingCallbacks = [];
    }
    CobolDiagnosticGetCopyHierarchyManager.pendingCallbacks.delete(fileName);
    externalGetCopyHierarchy(fileName).then(buffer => {
      CobolDiagnosticGetCopyHierarchyManager.PreprocessCallbackCalled = false;
      currentPendingCallbacks.forEach(currentCallback => {
        Log.get().info("CobolDiagnosticGetCopyHierarchyManager preproc was called " + fileName);
        currentCallback(buffer);
      });
      let remaining = CobolDiagnosticGetCopyHierarchyManager.pendingCallbacks;
      if (remaining.size > 0) {
        remaining.forEach((_callback, file) => {
          CobolDiagnosticGetCopyHierarchyManager.runGetCopyHierarchy(
            externalGetCopyHierarchy,
            file,
            errorCallback
          );
        });
      }
      return;
    }, () => {
      return errorCallback()
    });
  }

}
