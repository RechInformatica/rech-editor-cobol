import { StatusBarItem, window, StatusBarAlignment } from "vscode";

export class ExpandedSourceCacheStatusBar {

    /** expandedSource StatusBar controll  */
    private static expandedSourceCacheStatusBar: StatusBarItem | undefined;
    /** Indicates if the  expandedSourceStatusBar is visible*/
    private static isVisible: boolean = false;

    /**
     * Build the fold statusBar
     */
    public static buildStatusBar() {
        ExpandedSourceCacheStatusBar.expandedSourceCacheStatusBar = window.createStatusBarItem(StatusBarAlignment.Left);
        ExpandedSourceCacheStatusBar.expandedSourceCacheStatusBar.text = "Cache of sourceExpander is loading...";
    }

    /**
     * Show the statusBar from expandedSource
     */
    public static show(file?: string) {
        if (ExpandedSourceCacheStatusBar.isVisible) {
            return;
        }
        ExpandedSourceCacheStatusBar.isVisible = true;
        if (ExpandedSourceCacheStatusBar.expandedSourceCacheStatusBar) {
            if (file) {
                ExpandedSourceCacheStatusBar.expandedSourceCacheStatusBar.tooltip = file;
            } else {
                ExpandedSourceCacheStatusBar.expandedSourceCacheStatusBar.tooltip = undefined;
            }
            ExpandedSourceCacheStatusBar.expandedSourceCacheStatusBar.show();
        }
    }

    /**
     * Hide the statusBar from expandedSource
     */
    public static hide() {
        if (!ExpandedSourceCacheStatusBar.isVisible) {
            return;
        }
        ExpandedSourceCacheStatusBar.isVisible = false;
        if (ExpandedSourceCacheStatusBar.expandedSourceCacheStatusBar) {
            ExpandedSourceCacheStatusBar.expandedSourceCacheStatusBar.hide();
        }
    }

}
