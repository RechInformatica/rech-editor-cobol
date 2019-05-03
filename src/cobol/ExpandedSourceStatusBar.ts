import { StatusBarItem, window, StatusBarAlignment } from "vscode";

export class ExpandedSourceStatusBar {

    /** expandedSource StatusBar controll  */
    private static expandedSourceStatusBar: StatusBarItem | undefined;
    /** Indicates if the  expandedSourceStatusBar is visible*/
    private static isVisible: boolean = false;

    /**
     * Build the fold statusBar
     */
    public static buildStatusBar() {
        ExpandedSourceStatusBar.expandedSourceStatusBar = window.createStatusBarItem(StatusBarAlignment.Left);
        ExpandedSourceStatusBar.expandedSourceStatusBar.text = "SourceExpander is running...";
    }

    /**
     * Show the statusBar from expandedSource
     */
    public static show() {
        if (ExpandedSourceStatusBar.isVisible) {
            return;
        }
        ExpandedSourceStatusBar.isVisible = true;
        if (ExpandedSourceStatusBar.expandedSourceStatusBar) {
            ExpandedSourceStatusBar.expandedSourceStatusBar.show();
        }
    }

    /**
     * Hide the statusBar from expandedSource
     */
    public static hide() {
        if (!ExpandedSourceStatusBar.isVisible) {
            return;
        }
        ExpandedSourceStatusBar.isVisible = false;
        if (ExpandedSourceStatusBar.expandedSourceStatusBar) {
            ExpandedSourceStatusBar.expandedSourceStatusBar.hide();
        }
    }

}