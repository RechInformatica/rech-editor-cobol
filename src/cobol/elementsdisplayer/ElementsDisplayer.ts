import { ElementInterface } from "./ElementInterface";
import { window, QuickPick} from "vscode";

/** Displayer elements */
export class ElementsDisplayer {
  /** Elements to show */
  private elements: ElementInterface[] = []
  /** history of elements displayed */
  private history: ReadonlyArray<ElementInterface>[] = []
  /** QuickPick from windows */
  private quickPick: QuickPick<ElementInterface>;

  /** Constructor of ElementsDisplayer */
  constructor() {
    this.quickPick = window.createQuickPick()
  }

  /** Create and config the ElementsDisplayer */
  public create(title: string) {
    this.quickPick.title = title;
    this.quickPick.items = this.elements
    this.quickPick.activeItems = []
    this.quickPick.onDidChangeSelection((selection) => {
      let selec = selection[0];
      let children = selec.getChildren();
      if (children.length > 0) {
        this.history.push(this.quickPick.items);
        this.quickPick.items = children
      } else {
        if (selec.onSelection) {
          this.history.push(this.quickPick.items);
          selec.onSelection(selec);
          this.quickPick.items = this.elements
        }
      }
    });
    this.quickPick.ignoreFocusOut = true;
    this.quickPick.onDidHide(() => {
      if (this.history.length > 0) {
        this.quickPick.items = this.history[this.history.length - 1];
        this.history.pop()
        this.show();
      } else {
        this.dispose()
      }
    });
  }

  /**
   * Show the displayer
   */
  public show() {
    this.quickPick.show()
  }

  /**
   * Dispose the displayer
   */
  public dispose() {
    this.quickPick.dispose()
  }

  /**
   * Add element into displayer
   *
   * @param element
   */
  public addElement(element: ElementInterface) {
    this.elements.push(element);
  }

  /**
   * Remove element from displayer
   *
   * @param element
   */
  public removeElement(element: ElementInterface) {
    this.elements.splice(this.elements.indexOf(element));
  }

  /**
   * Clear all elements
   */
  public clearElements() {
    this.elements = [];
  }
}
