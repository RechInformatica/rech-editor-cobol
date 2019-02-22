import { QuickPickItem } from "vscode";

export interface ElementInterface extends QuickPickItem {

  /**
   * Callback to execute when select the element
   */
  onSelection?: ((element: ElementInterface) => any) | undefined

  /**
   * Returns the element children
   */
  getChildren(): ElementInterface[];

  /**
   * Object related to element
   */
  object?: any

}