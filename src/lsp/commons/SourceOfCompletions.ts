import { StatusBarItem, window, StatusBarAlignment } from "vscode";

export class SourceOfCompletions {

    private static statusBarItem: StatusBarItem | undefined;
    private static source: "local" | "expanded" = "local";

    /**
     * Build the statusBar to controll the source of completions
     */
    public static buildStatusBar() {
        this.statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right)
        this.statusBarItem.command = "rech.editor.cobol.changeSource"
        this.statusBarItem.text = "Source - Local File"
        return this.statusBarItem;
    }

    /**
     * Toggle the source
     */
    public static toggleTheSource() {
        if (this.source == "local") {
            this.source = "expanded";
            this.statusBarItem!.text = "Source - Expanded File"
        } else {
            this.source = "local";
            this.statusBarItem!.text = "Source - Local File"
        }
    }

    /**
     * Returns the selected source of completions
     */
    public static getSourceOfCompletions() {
        return this.source;
    }

}