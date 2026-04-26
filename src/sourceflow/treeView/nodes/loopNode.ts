import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import NodeInterface from "./NodeInterface";

/**
 * Node representing a loop in the COBOL flow tree.
 */
export class LoopNode implements NodeInterface {
    private readonly rowNumber: number;
    private readonly treeItem: TreeItem;

    constructor(rowNumber: number, name: string) {
        this.rowNumber = rowNumber;
        this.treeItem = new TreeItem(`${this.rowNumber + 1}:${name}`, TreeItemCollapsibleState.Collapsed);
        this.treeItem.iconPath = new ThemeIcon('sync');
    }

    getChildren(_parentsRows: number[] = []): NodeInterface[] {
        return [];
    }

    getTreeItem(): TreeItem {
        return this.treeItem;
    }

    getRow(): number {
        return this.rowNumber;
    }

}
