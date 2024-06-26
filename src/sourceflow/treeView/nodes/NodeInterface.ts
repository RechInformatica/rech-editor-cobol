import { TreeItem } from "vscode";

/**
 * Interface for nodes
 */
export default interface NodeInterface {

  /**
   * Returns the children
   */
  getChildren(): NodeInterface[];

  /**
   * Returns this tree item
   */
  getTreeItem(): TreeItem;

  /**
   * Returns the row number
   */
  getRow(): number;

}
