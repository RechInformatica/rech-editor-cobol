import { TreeItem } from "vscode";
import NodeInterface from "./NodeInterface";

/**
 * A class representing an inverted node in the tree view.
 * This wrapper maintains the inverted tree structure.
 */
export class InvertedNode implements NodeInterface {

    private readonly node: NodeInterface;
    private readonly invertedChildren: NodeInterface[] = [];
    private parentsRows: number[] = [];

    /**
     * Creates an instance of InvertedNode.
     * @param {NodeInterface} node - The original node being wrapped.
     */
    constructor(node: NodeInterface, parentsRows: number[] = []) {
        this.node = node;
        this.parentsRows = parentsRows;
    }

    /**
     * Adds a child to this inverted node.
     * @param {NodeInterface} child - The child node to add.
     */
    public addChild(child: NodeInterface): void {
        this.invertedChildren.push(child);
    }

    /**
     * Retrieves the child nodes of this inverted node.
     * @returns {NodeInterface[]} An array of inverted child nodes.
     */
    getChildren(): NodeInterface[] {
        return this.invertedChildren;
    }

    /**
     * Retrieves the TreeItem representation of this node.
     * @returns {TreeItem} The TreeItem for this node.
     */
    getTreeItem(): TreeItem {
        return this.node.getTreeItem();
    }

    /**
     * Retrieves the row number of this node.
     * @returns {number} The row number.
     */
    getRow(): number {
        return this.node.getRow();
    }

    /**
     * Retrieves the node object being wrapped.
     * @returns {NodeInterface} The original node object.
     */
    getNode(): NodeInterface {
        return this.node;
    }
}
