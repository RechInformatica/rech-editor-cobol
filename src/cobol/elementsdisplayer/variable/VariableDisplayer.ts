import { ElementsDisplayer } from "../ElementsDisplayer";
import { VariableElement } from "./VariableElement";
import { CobolVariable, Type } from "../../../lsp/completion/CobolVariable";
import { Editor } from "../../../editor/editor";
import { GeradorCobol } from "../../gerador-cobol";

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
    let children = variable.getChildren()
    if (children && children.length > 0) {
      let childrenItems = new VariableElement("Children");
      this.controller.addElement(this.insertChildren(childrenItems, children));
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
    if (variable.getComment()) {
      this.controller.addElement(
        new VariableElement("Documentation")
        .setDetail(variable.getComment()!.join(" | "))
        .setOnSelection(async (selectItem) => {
          let obj = selectItem.object
          if (obj) {
            let comments = (<CobolVariable>obj).getComment();
            if (comments) {
              await this.insertCommentInEditor((<CobolVariable>obj).getComment()!)
              this.controller.dispose();
            }
          }
        })
        .setObject(variable));
    }
  }

  /**
   * Function to insert comment in editor
   *
   * @param comments
   */
  private async insertCommentInEditor(comments: string[]) {
    let editor = new Editor();
    let cursor = editor.getCursors()[0]
    for (let i = comments.length - 1; i >= 0; i--) {
      await new GeradorCobol().insertCommentLineWithText(comments[i]);
    }
    await editor.setCursor(cursor.line + comments.length, cursor.column);
  }

  /**
   * Inser a children in the displayer options
   *
   * @param childrenItems
   * @param children
   */
  private insertChildren(childrenItems: VariableElement, children: CobolVariable[]): VariableElement {
    children.forEach((children) => {
      let childrenItem = new VariableElement(children.getName())
      .setDescription(children.getPicture() + " - Size: " + children.getByteSize())
      .setDetail(children.getRaw())
      .setOnSelection((selectItem) => {
        let chi = children.getChildren();
        if (chi) {
          this.controller.clearElements();
          this.createItemsFromVariable(<CobolVariable>selectItem.object)
        }
      })
      .setObject(children);
      childrenItems.add(childrenItem);
    });
    return childrenItems;
  }


}
