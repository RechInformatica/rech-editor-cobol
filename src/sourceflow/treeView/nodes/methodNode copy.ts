import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import NodeInterface from "./NodeInterface";
import { CobolFlowAnalyzer } from '../../utils/cobolFlowAnalyzer';

/**
 * A class representing a COBOL method node in the tree view.
 */
export class MethodNode implements NodeInterface {

    private rowNumber: number;
    private treeItem: TreeItem;

    /**
     * Creates an instance of MethodNode.
     * @param {number} rowNumber - The line number of the method in the COBOL source code.
     * @param {string} name - The name of the method.
     */
    constructor(rowNumber: number, name: string) {
        this.rowNumber = rowNumber;
        this.treeItem = new TreeItem(`${this.rowNumber + 1}:${name}`, TreeItemCollapsibleState.Collapsed);
        this.treeItem.iconPath = new ThemeIcon('symbol-method');
    }

    /**
     * Retrieves the child nodes of this method node.
     * @returns {NodeInterface[]} An array of child nodes.
     */
    getChildren(): NodeInterface[] {
        const children = CobolFlowAnalyzer.getInstance().getMethodCalls(this.rowNumber);
        return children;
    }

    /**
     * Retrieves the TreeItem representation of this node.
     * @returns {TreeItem} The TreeItem for this node.
     */
    getTreeItem(): TreeItem {
        return this.treeItem;
    }

    /**
     * Retrieves the row number of this method node in the COBOL source code.
     * @returns {number} The row number.
     */
    getRow(): number {
        return this.rowNumber;
    }
}
