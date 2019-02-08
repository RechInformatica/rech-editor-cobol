import { ElementsDisplayer } from "../ElementsDisplayer";
import { VariableElement } from "./VariableElement";
import { CobolVariable, Type } from "../../../lsp/completion/CobolVariable";
import { Editor } from "../../../editor/editor";

export class VariableDisplayer {
  /** Display controller */
  private controller: ElementsDisplayer;

  constructor() {
    this.controller = new ElementsDisplayer();
  }

  /**
   * Show the variables properties
   *
   * @param variable
   */
  public show(variable: CobolVariable) {
    this.createItemsFromVariable(variable);
    this.controller.create("Variable");
    this.controller.show();
  }

  /**
   * Create items from variable
   *
   * @param variable
   */
  private createItemsFromVariable(variable: CobolVariable) {
    this.addTheBasicInformation(variable);
    let childrens = variable.getChildrens()
    if (childrens && childrens.length > 0) {
      let childrensItems = new VariableElement("childrens");
      this.controller.addElement(this.insertChildren(childrensItems, childrens));
    }
  }

  /**
   * Add to displayer the basic information of the variable
   *
   * @param variable
   */
  private addTheBasicInformation(variable: CobolVariable) {
    this.controller.addElement(new VariableElement(variable.getName())
    .setDescription(variable.getPicture() + " - Size: " + variable.getByteSize().toString())
    .setDetail(variable.getRaw())
    .setOnSelection((selectItem) => {
      let obj = selectItem.object
      if (obj) {
        let position = (<CobolVariable>obj).getDeclarationPosition()
        if (position) {
          new Editor().setCursor(position.line, position.column);
          this.controller.dispose();
        }
      }
    })
    .setObject(variable));
    let type = "";
    switch(variable.getType()) {
      case Type.Integer: type = "Integer"; break;
      case Type.Decimal: type = "Decimal"; break;
      case Type.Alphanumeric: type = "Alphanumeric"; break;
    }
    this.controller.addElement(new VariableElement("Type")
    .setDetail(type));
  }

  /**
   * Inser a children in the displayer options
   *
   * @param childrensItems
   * @param childrens
   */
  private insertChildren(childrensItems: VariableElement, childrens: CobolVariable[]): VariableElement {
    childrens.forEach((children) => {
      let childrenItem = new VariableElement(children.getName())
      .setDescription(children.getPicture() + " - Size: " + children.getByteSize())
      .setDetail(children.getRaw())
      .setOnSelection((selectItem) => {
        let chi = children.getChildrens();
        if (chi) {
          this.controller.clearElements();
          this.createItemsFromVariable(<CobolVariable>selectItem.object)
        }
      })
      .setObject(children);
      childrensItems.add(childrenItem);
    });
    return childrensItems;
  }


}
