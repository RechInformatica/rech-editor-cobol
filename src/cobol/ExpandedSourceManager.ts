import { Path } from "../commons/path";
import { File } from "../commons/file";

/**
 * Class to manager the expanded source
 */
export class ExpandedSourceManager {
  /** Expanded sources */
  private static expandedSource: Map<string, string[]> = new Map();
  /** callback to expander the source */
  private static callbackSourceExpander: ((uri: string, cacheFileName: string) => Thenable<{}>) | undefined;
  /** Source to expand*/
  private source: string;

  constructor(source: string) {
    this.source = source;
  }

  /**
   * Expand the source and load the cache
   */
  public expandSource(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      if (!ExpandedSourceManager.callbackSourceExpander) {
        return reject()
      }
      ExpandedSourceManager.callbackSourceExpander(this.source, ExpandedSourceManager.buildExpandedSourceFileName(this.source)).then(() => {
        let file = new File(ExpandedSourceManager.buildExpandedSourceFileName(this.source));
        file.loadBuffer("latin1").then((buffer) => {
          ExpandedSourceManager.expandedSource.set(this.source, buffer);
          resolve(buffer)
        }).catch(() => {
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
  public static getExpandedSource(source: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let expandedSource = ExpandedSourceManager.expandedSource.get(source);
      if (expandedSource) {
        return resolve(expandedSource);
      } else {
        new ExpandedSourceManager(source).expandSource().then((expandedSource) => {
          return resolve(expandedSource);
        }).catch(() => {
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
