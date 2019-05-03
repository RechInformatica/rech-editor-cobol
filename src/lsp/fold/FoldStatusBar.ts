import { StatusBarItem, window, StatusBarAlignment } from "vscode";

export class FoldStatusBar {

    /** Fold StatusBar controll  */
    private static foldStatusBar: StatusBarItem | undefined;
    /** Indicates if the  foldStatusBar is visible*/
    private static isVisible: boolean = false;

    /**
     * Build the fold statusBar
     */
    public static buildStatusBar() {
        FoldStatusBar.foldStatusBar = window.createStatusBarItem(StatusBarAlignment.Left);
        FoldStatusBar.foldStatusBar.text = "Fold is running...";
    }

    /**
     * Show the statusBar from folding
     */
    public static show() {
        if (FoldStatusBar.isVisible) {
            return;
        }
        FoldStatusBar.isVisible = true;
        if (FoldStatusBar.foldStatusBar) {
            FoldStatusBar.foldStatusBar.show();
        }
    }

    /**
     * Hide the statusBar from folding
     */
    public static hide() {
        if (!FoldStatusBar.isVisible) {
            return;
        }
        FoldStatusBar.isVisible = false;
        if (FoldStatusBar.foldStatusBar) {
            FoldStatusBar.foldStatusBar.hide();
        }
    }

}