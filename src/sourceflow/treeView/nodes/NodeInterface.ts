import { TreeItem } from "vscode";

/**
 * Interface for nodes
 */
export default interface NodeInterface {

  /**
   * Returns the children
   */
  getChildren(): NodeInterface[] | Promise<NodeInterface[]>;

  /**
   * Returns this tree item
   */
  getTreeItem(): TreeItem | Promise<TreeItem>;

}