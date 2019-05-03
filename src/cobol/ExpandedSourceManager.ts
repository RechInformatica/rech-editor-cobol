import { Path } from "../commons/path";
import { File } from "../commons/file";
import { Log } from "../commons/Log";

/**
 * Class to manager the expanded source
 */
export class ExpandedSourceManager {
  /** Expanded sources */
  private static expandedSource: Map<string, string> = new Map();
  /** callback to expander the source */
  private static callbackSourceExpander: ((uri: string, cacheFileName: string) => Thenable<{}>) | undefined;
  /** callback to show SatusBar from SourceExpander */
  private static callbackShowStatusBarFromSourceExpander: (() => void) | undefined;
  /** callback to hide SatusBar from SourceExpander */
  private static callbackHideStatusBarFromSourceExpander: (() => void) | undefined;
  /** Source to expand*/
  private source: string;

  constructor(source: string) {
    this.source = source;
  }

  /**
   * Expand the source and load the cache
   */
  public expandSource(): Promise<string> {
    if (ExpandedSourceManager.callbackShowStatusBarFromSourceExpander) {
      ExpandedSourceManager.callbackShowStatusBarFromSourceExpander();
    }
    return new Promise((resolve, reject) => {
      Log.get().info("ExpandedSourceManager.expandSource() was called");
      if (!ExpandedSourceManager.callbackSourceExpander) {
        Log.get().warning("SourceExpander is undefined");
        if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
          ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
        }
        return reject()
      }
      Log.get().info("ExpandedSourceManager has callbackSourceExpander");
      ExpandedSourceManager.callbackSourceExpander(this.source, ExpandedSourceManager.buildExpandedSourceFileName(this.source)).then(() => {
        Log.get().info("ExpandedSourceManager.callbackSourceExpander was finality");
        const file = new File(ExpandedSourceManager.buildExpandedSourceFileName(this.source));
        file.loadBuffer("latin1").then((buffer) => {
          ExpandedSourceManager.expandedSource.set(this.source, buffer);
          Log.get().info("Expanded source loaded successfully");
          if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
            ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
          }
          resolve(buffer)
        }).catch(() => {
          Log.get().error("Error to load expanded source");
          if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
            ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
          }
          reject();
        });
      });
    });
  }

  /**
   * Defines the source expander
   *
   * @param callbackSourceExpander
   */
  public static setSourceExpander(callbackSourceExpander: (uri: string, cacheFileName: string) => Thenable<{}>) {
    ExpandedSourceManager.callbackSourceExpander = callbackSourceExpander;
  }

  /**
   * Defines show and hide StatusBar callbacks
   *
   * @param callbackSourceExpander
   * @param callbackSourceExpander
   */
  public static setStatusBarFromSourceExpander(callbackShowStatusBarFromSourceExpander: () => void, callbackHideStatusBarFromSourceExpander: () => void) {
    ExpandedSourceManager.callbackShowStatusBarFromSourceExpander = callbackShowStatusBarFromSourceExpander;
    ExpandedSourceManager.callbackHideStatusBarFromSourceExpander = callbackHideStatusBarFromSourceExpander;
  }

  /**
   * Returns true if it has a sourceExpander
   */
  public static hasSourceExpander(): boolean {
    return ExpandedSourceManager.callbackSourceExpander != undefined
  }

  /**
   * Returns the cache of expanded source
   *
   * @param source
   */
  public static getExpandedSource(source: string): Promise<string> {
    Log.get().info("Expanded source requested. Source: " + source);
    return new Promise((resolve, reject) => {
      const expandedSource = ExpandedSourceManager.expandedSource.get(source);
      if (expandedSource) {
        Log.get().info("Expanded source got from cache. Source: " + source);
        return resolve(expandedSource);
      } else {
        Log.get().info("PREPROC was called to expand: " + source);
        new ExpandedSourceManager(source).expandSource().then((expandedSource) => {
          Log.get().info("Expanded source got from expanded file. Source: " + source);
          return resolve(expandedSource);
        }).catch(() => {
          Log.get().error("Error to get the expanded source. Source: " + source);
          return reject()
        });
      }
    })
  }

  /**
   * Remove the source of the cache
   *
   * @param source
   */
  public static removeSourceOfCache(source: string) {
    ExpandedSourceManager.expandedSource.delete(source);
  }

  /**
   * Builds the file name of expanded source
   *
   * @param source
   */
  public static buildExpandedSourceFileName(source: string): string {
    var path = new Path(source).fullPathWin();
    return "C:\\TMP\\PREPROC\\" + require("os").userInfo().username.toLowerCase() + "\\" +  new Path(path).fileName();
  }
}
