import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from "vscode";
import NodeInterface from "./nodeInterface";
import { CobolFlowAnalyzer } from '../../utils/cobolFlowAnalyzer';

/**
 * A class representing a COBOL paragraph node in the tree view.
 */
export class ParagraphNode implements NodeInterface {

    private rowNumber: number;
    private treeItem: TreeItem;

    /**
     * Creates an instance of ParagraphNode.
     * @param {number} rowNumber - The line number of the paragraph in the COBOL source code.
     * @param {string} name - The name of the paragraph.
     */
    constructor(rowNumber: number, name: string) {
        this.rowNumber = rowNumber;
        this.treeItem = new TreeItem(`${this.rowNumber + 1}:${name}`, TreeItemCollapsibleState.Collapsed);
        this.treeItem.iconPath = new ThemeIcon('symbol-class');
    }

    /**
     * Retrieves the child nodes of this paragraph node.
     * @returns {NodeInterface[]} An array of child nodes.
     */
    getChildren(): NodeInterface[] {
        const children = CobolFlowAnalyzer.getInstance().getPerformGotoParagraphList(this.rowNumber);
        const parentMethod = CobolFlowAnalyzer.getInstance().getNextMethodDeclaration(this.rowNumber - 1);
        if (parentMethod) {
            children.push(parentMethod);
        }
        // TODO: Need to implement Perform Thru detection here. Search for "perform xx thru yy" in source code, create a list with paragraphs inside a perform thru. Check if this paragraph is inside the list
        const performThru = CobolFlowAnalyzer.getInstance().getPerformThruParents(this.rowNumber - 1);
        if (performThru) {
            children.push(performThru);
        }
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
     * Retrieves the row number of this paragraph node in the COBOL source code.
     * @returns {number} The row number.
     */
    getRow(): number {
        return this.rowNumber;
    }
}
