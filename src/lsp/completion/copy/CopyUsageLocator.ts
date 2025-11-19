import { isArray } from "util";
import { commands } from "vscode";
import { Editor } from "../../../extension";

const MAX_CACHE_TIME = 1000 * 60 * 5;

/**
 * Class responsible for finding where the copies are used
 */
export class CopyUsageLocator {

    /** Copy usage cache */
    private static cache: Map<string, CopyUsageLocatorCached> = new Map();

    /**
     * Find where the copy are used
     */
    public static findUsage(copy: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            if (this.cache.has(copy)) {
                const result = this.cache.get(copy)!;
                if (new Date().getTime() - result.time < MAX_CACHE_TIME) {
                    return resolve(result.usages);
                }
            }
            const command = Editor.getCopyUsageLocator();
			if (!command) {
				return reject("CopyUsageLocator is not defined");
			}
			commands.executeCommand(command, copy, true).then((result: unknown) => {
				if (result && isArray(result)) {
                    this.cache.set(copy, new CopyUsageLocatorCached(new Date().getTime(), result as string[]));
					return resolve(result as string[]);
				} else {
					return reject("Unexpected result of CopyUsageLocator function");
				}
			}, (err) => {
				return reject(err);
			})
        });
    }

}

/**
 * Copy Usage result for cache
 */
class CopyUsageLocatorCached {
    public time: number = 0;
    public usages: string[] = [];

    constructor(time: number, usages: string[]) {
        this.time = time;
        this.usages = usages;
    }
}
