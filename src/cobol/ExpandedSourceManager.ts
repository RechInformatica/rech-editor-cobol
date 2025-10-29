import * as os from "os";
import { Path } from "../commons/path";
import { File } from "../commons/file";
import { Log } from "../commons/Log";


/**
 * Class to manage the expanded source
 */
export class ExpandedSourceManager {
  /** Max cache time in ms */
  private static maxCacheTime = 30000;
  /** Indicates whether to return the last cache when reaching the maximum time */
  private static returnsLastCache = false;
  /** Expanded sources */
  private static expandedSourceCache: Map<string, {time: number, expandedSource: string}> = new Map();
  /** callback to expander the source */
  private static callbackSourceExpander: ((uri: string, cacheFileName: string) => Thenable<{unknown: any}>) | undefined;
  /** callback to show SatusBar from SourceExpander */
  private static callbackShowStatusBarFromSourceExpander: ((file?: string) => void) | undefined;
  /** callback to hide SatusBar from SourceExpander */
  private static callbackHideStatusBarFromSourceExpander: (() => void) | undefined;
  /** callback to show SatusBar from SourceExpander Cache*/
  private static callbackShowStatusBarFromSourceExpanderCache: ((file?: string) => void) | undefined;
  /** callback to hide SatusBar from SourceExpander Cache */
  private static callbackHideStatusBarFromSourceExpanderCache: (() => void) | undefined;

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

  /**
   * Sets cache behavior when reaching maximum time
   *
   * @param returnsLastCache
   */
  public static setReturnLastCache(returnsLastCache: boolean) {
    ExpandedSourceManager.returnsLastCache = returnsLastCache;
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
        if (!file.exists()) {
          if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
            ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
          }
          return reject(`File ${file.fileName} not exist`);
        }
        file.loadBuffer("latin1").then((buffer) => {
          ExpandedSourceManager.setExpandedSourceInCache(this.source, buffer);
          Log.get().info("Expanded source loaded successfully");
          if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
            ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
          }
          return resolve(buffer)
        }).catch((e) => {
          Log.get().error("Error to load expanded source. " + e);
          if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
            ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
          }
          return reject(e);
        });
      }, (e) => {
        Log.get().error("callbackSourceExpander has returned a error to load expanded source. " + e);
        if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpander) {
          ExpandedSourceManager.callbackHideStatusBarFromSourceExpander();
        }
        return reject(e);
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
  public static setStatusBarFromSourceExpander(callbackShowStatusBarFromSourceExpander: (file?: string) => void,
                                               callbackHideStatusBarFromSourceExpander: () => void,
                                               callbackShowStatusBarFromSourceExpanderCache: (file?: string) => void,
                                               callbackHideStatusBarFromSourceExpanderCache: () => void) {
    ExpandedSourceManager.callbackShowStatusBarFromSourceExpander = callbackShowStatusBarFromSourceExpander;
    ExpandedSourceManager.callbackHideStatusBarFromSourceExpander = callbackHideStatusBarFromSourceExpander;
    ExpandedSourceManager.callbackShowStatusBarFromSourceExpanderCache = callbackShowStatusBarFromSourceExpanderCache;
    ExpandedSourceManager.callbackHideStatusBarFromSourceExpanderCache = callbackHideStatusBarFromSourceExpanderCache;
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
    const cacheTime = currentTime - cache.time;
    if (cacheTime > ExpandedSourceManager.maxCacheTime) {
      Log.get().info("ExpandedSourceManager timeout of cache. Source: " + source + " cache time: " + cacheTime);
      // Request a new ExpandedSource for update cache
      Log.get().info("Called expandSource from " + source + " to refresh cache");
      if (ExpandedSourceManager.callbackShowStatusBarFromSourceExpanderCache) {
        ExpandedSourceManager.callbackShowStatusBarFromSourceExpanderCache(source);
      }
      new ExpandedSourceManager(source).expandSource().then(() => {
        Log.get().info("expandSource from " + source + " called to refresh cache has finished");
        if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpanderCache) {
          ExpandedSourceManager.callbackHideStatusBarFromSourceExpanderCache();
        }
      }).catch((err) => {
        Log.get().info("expandSource from " + source + " called to refresh cache has finished with error" + err);
        if (ExpandedSourceManager.callbackHideStatusBarFromSourceExpanderCache) {
          ExpandedSourceManager.callbackHideStatusBarFromSourceExpanderCache();
        }
      });
      if (ExpandedSourceManager.returnsLastCache) {
        if (!cache.expandedSource) {
          Log.get().info("Cache of " + source + " is empty, whaiting 500 miliseconds");
          new Promise((resolve) => {
            setTimeout(resolve, 500);
          }).then(() => {
            Log.get().info("Returned cache of " + source + " after wait.");
            if (!cache.expandedSource) {
              Log.get().info("The returned cache of " + source + " after wait is undefined");
            }
            return cache.expandedSource;
          }).catch((err) => {
            Log.get().info("expandSource from " + source + " called to return last cache has finished with error" + err);
          })
        } else {
          return cache.expandedSource;
        }
      } else {
        Log.get().info("The returned undefined cache from " + source + " because returnsLastCache config is false");
        return undefined;
      }
    }
    // Ensures that expandedSource is loaded
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
   * returns all sources on cache
   */
  public static getSourcesOnCache(): Array<string> {
    const result: Array<string> = [];
    ExpandedSourceManager.expandedSourceCache.forEach((_v, k) => {
      result.push(k);
    });
    return result;
  }

  /**
   * Builds the file name of expanded source
   *
   * @param source
   */
  public static buildExpandedSourceFileName(source: string): string {
    const path = new Path(source).fullPathWin();
    return Path.tmpdir() + Path.sep() + "PREPROC" + Path.sep() + os.userInfo().username.toLowerCase() + Path.sep() +  new Path(path).fileName();
  }
}
