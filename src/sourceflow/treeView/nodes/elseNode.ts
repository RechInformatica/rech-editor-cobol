import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import NodeInterface from "./nodeInterface";
import { CobolFlowAnalyzer } from '../../utils/cobolFlowAnalyzer';
import { NodeType } from '../../utils/nodeType';

/**
 * A class representing an "ELSE" node in the COBOL flow analysis tree.
 */
export class ElseNode implements NodeInterface {

    private rowNumber: number;
    private treeItem: TreeItem;

    /**
     * Creates an instance of ElseNode.
     * @param {number} rowNumber - The line number of the "ELSE" statement in the COBOL source code.
     * @param {string} name - The name of the "ELSE" statement.
     */
    constructor(rowNumber: number, name: string) {
        this.rowNumber = rowNumber;
        this.treeItem = new TreeItem(`${this.rowNumber + 1}:${name}`, TreeItemCollapsibleState.Collapsed);
        this.treeItem.iconPath = new ThemeIcon('symbol-boolean');
    }

    /**
     * Retrieves the child nodes of this "ELSE" node.
     * @returns {NodeInterface[]} An array of child nodes.
     */
    getChildren(): NodeInterface[] {
        const children = [];
        children.push(CobolFlowAnalyzer.getInstance().getBlockAt(this.rowNumber - 1, NodeType.Else));
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
     * Retrieves the row number of this "ELSE" node in the COBOL source code.
     * @returns {number} The row number.
     */
    getRow(): number {
        return this.rowNumber;
    }
}
