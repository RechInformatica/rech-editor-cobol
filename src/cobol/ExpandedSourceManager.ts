import { Path } from "../commons/path";
import { File } from "../commons/file";
import { Log } from "../commons/Log";


/**
 * Class to manager the expanded source
 */
export class ExpandedSourceManager {
  /** Max cache time in ms */
  private static maxCacheTime = 300;
  /** Expanded sources */
  private static expandedSourceCache: Map<string, {time: number, expandedSource: string}> = new Map();
  /** callback to expander the source */
  private static callbackSourceExpander: ((uri: string, cacheFileName: string) => Thenable<{}>) | undefined;
  /** callback to show SatusBar from SourceExpander */
  private static callbackShowStatusBarFromSourceExpander: ((file?: string) => void) | undefined;
  /** callback to hide SatusBar from SourceExpander */
  private static callbackHideStatusBarFromSourceExpander: (() => void) | undefined;
  /** Source to expand*/
  private source: string;

  /**
   * Defines the max cache time of the cached source in ms
   *
   * @param maxCacheTime max cache time of the cached source in ms
   */
  public static setMaxCacheTime(maxCacheTime: number) {
    ExpandedSourceManager.maxCacheTime = maxCacheTime;
  }

  constructor(source: string) {
    this.source = source;
  }

  /**
   * Expand the source and load the cache
   */
  public expandSource(): Promise<string> {
    if (ExpandedSourceManager.callbackShowStatusBarFromSourceExpander) {
      ExpandedSourceManager.callbackShowStatusBarFromSourceExpander(this.source);
    }
    return new Promise((resolve, reject) => {
      Log.get().info("ExpandedSourceManager.expandSource() was called");
      if (!ExpandedSourceManager.callbackSourceExpander) {
        Log.get().warning("SourceExpander is undefined");
        if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
          ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
        }
        return reject("CallbackSourceExpander not defined")
      }
      Log.get().info("ExpandedSourceManager has callbackSourceExpander");
      ExpandedSourceManager.callbackSourceExpander(this.source, ExpandedSourceManager.buildExpandedSourceFileName(this.source)).then(() => {
        Log.get().info("ExpandedSourceManager.callbackSourceExpander was finality");
        const file = new File(ExpandedSourceManager.buildExpandedSourceFileName(this.source));
        file.loadBuffer("latin1").then((buffer) => {
          ExpandedSourceManager.setExpandedSourceInCache(this.source, buffer);
          Log.get().info("Expanded source loaded successfully");
          if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
            ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
          }
          resolve(buffer)
        }).catch((e) => {
          Log.get().error("Error to load expanded source. " + e);
          if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
            ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
          }
          reject(e);
        });
      }, (e) => {
        Log.get().error("callbackSourceExpander has returned a error to load expanded source. " + e);
        if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
          ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
        }
        reject(e);
      });
    });
  }

  /**
   * Defines the source expander
   *
   * @param callbackSourceExpander
   */
  public static setSourceExpander(callbackSourceExpander: (uri: string, cacheFileName: string) => Thenable<any>) {
    ExpandedSourceManager.callbackSourceExpander = callbackSourceExpander;
  }

  /**
   * Defines show and hide StatusBar callbacks
   *
   * @param callbackSourceExpander
   * @param callbackSourceExpander
   */
  public static setStatusBarFromSourceExpander(callbackShowStatusBarFromSourceExpander: (file?: string) => void, callbackHideStatusBarFromSourceExpander: () => void) {
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
      const expandedSource = ExpandedSourceManager.getExpandedSourceFromCache(source);
      if (expandedSource) {
        Log.get().info("Expanded source got from cache. Source: " + source);
        return resolve(expandedSource);
      } else {
        Log.get().info("PREPROC was called to expand: " + source);
        new ExpandedSourceManager(source).expandSource().then((expandedSource) => {
          Log.get().info("Expanded source got from expanded file. Source: " + source);
          return resolve(expandedSource);
        }).catch((e) => {
          Log.get().error("Error to get the expanded source. Source: " + source + " Error: " + e);
          return reject(e)
        });
      }
    })
  }

  /**
   * Returns the expanded source from cache
   */
  private static getExpandedSourceFromCache(source: string) {
    const cache = ExpandedSourceManager.expandedSourceCache.get(source);
    if (!cache) return undefined;
    const currentTime = new Date().getTime();
    if ((currentTime - cache.time) > ExpandedSourceManager.maxCacheTime) {
      return undefined;
    }
    return cache.expandedSource;
  }

  /**
   * Set source on cache
   *
   * @param source
   * @param expandedSource
   */
  private static setExpandedSourceInCache(source: string, expandedSource: string) {
    ExpandedSourceManager.expandedSourceCache.set(source, {time: new Date().getTime(), expandedSource: expandedSource});
  }

  /**
   * Remove source from cache
   *
   * @param source
   */
  public static removeSourceOfCache(source: string) {
    ExpandedSourceManager.expandedSourceCache.delete(source);
  }

  /**
   * Builds the file name of expanded source
   *
   * @param source
   */
  public static buildExpandedSourceFileName(source: string): string {
    const path = new Path(source).fullPathWin();
    return "C:\\TMP\\PREPROC\\" + require("os").userInfo().username.toLowerCase() + "\\" +  new Path(path).fileName();
  }
}
