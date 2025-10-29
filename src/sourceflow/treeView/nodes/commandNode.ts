import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import NodeInterface from "./NodeInterface";
import { CobolFlowAnalyzer } from '../../utils/cobolFlowAnalyzer';
import { NodeType } from '../../utils/nodeType';

/**
 * A class representing a command node in the COBOL flow analysis tree.
 */
export class CommandNode implements NodeInterface {

    private rowNumber: number;
    private treeItem: TreeItem;

    /**
     * Creates an instance of CommandNode.
     * @param {number} rowNumber - The line number of the command in the COBOL source code.
     * @param {string} name - The name of the command.
     */
    constructor(rowNumber: number, name: string) {
        this.rowNumber = rowNumber;
        this.treeItem = new TreeItem(`${this.rowNumber + 1}:${name}`, TreeItemCollapsibleState.Collapsed);
        this.treeItem.iconPath = new ThemeIcon('code');
    }

    /**
     * Retrieves the child nodes of this command node.
     * @returns {NodeInterface[]} An array of child nodes.
     */
    getChildren(): NodeInterface[] {
        const children = [];
        children.push(CobolFlowAnalyzer.getInstance().getBlockAt(this.rowNumber - 1, NodeType.Command));
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
     * Retrieves the row number of this command node in the COBOL source code.
     * @returns {number} The row number.
     */
    getRow(): number {
        return this.rowNumber;
    }
}
