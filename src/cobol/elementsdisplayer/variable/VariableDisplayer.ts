import { ElementsDisplayer } from "../ElementsDisplayer";
import { VariableElement } from "./VariableElement";
import { CobolVariable, Type } from "../../../lsp/completion/CobolVariable";
import { Editor } from "../../../editor/editor";
import { GeradorCobol } from "../../gerador-cobol";
import { VariableUtils } from "../../../commons/VariableUtils";

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
  public show(uri: string, variable: CobolVariable, lines: string[]) {
    const elementPropertiesExtractor = Editor.getElementPropertiesExtractor();
    if (elementPropertiesExtractor) {
      const extraParams = new Map<string, string[]>();
      const scope = variable.getScope() != 'object' ? '@' + variable.getScope() : '';
      const methodNumber = VariableUtils.getMethodNumber(variable, lines);
      const methodName = scope.replace(/\./, '') + ((methodNumber > 1) ? '_' + methodNumber.toString() : '');
      extraParams.set("var", [variable.getName() + methodName]);
      elementPropertiesExtractor.setPath(uri);
      elementPropertiesExtractor.setExtraParams(extraParams);
      elementPropertiesExtractor.exec(uri).then((output) => {
        try {
          const jsonMatch = output.match(/({[\s\S]*})/);
          if (!jsonMatch) {
            throw new Error("No JSON object found in the output");
          }
          const jsonObject = JSON.parse(jsonMatch[0]);
          this.addTheBasicInformation(variable, jsonObject.length.toString());
          this.createChildrenItemsFromVariable(variable);
          this.controller.create("Variable");
          this.controller.show();
        } catch (error) {
          console.error("Failed to parse JSON: ", error);
        }
      }).catch((err) => { console.error(err); });
    } else {
      this.addTheBasicInformation(variable, variable.getByteSize().toString());
      this.createChildrenItemsFromVariable(variable);
      this.controller.create("Variable");
      this.controller.show();
    }
  }

  /**
   * Create items from variable
   *
   * @param variable
   */
  private createChildrenItemsFromVariable(variable: CobolVariable) {
    const children = variable.getChildren()
    if (children && children.length > 0) {
      const childrenItems = new VariableElement("Children");
      this.controller.addElement(this.insertChildren(childrenItems, children));
    }
  }

  /**
   * Add to displayer the basic information of the variable
   *
   * @param variable
   */
  private addTheBasicInformation(variable: CobolVariable, size: string) {
    this.controller.addElement(new VariableElement(variable.getName())
      .setDescription(variable.getPicture() + " - Size: " + size)
      .setDetail(variable.getRaw())
      .setOnSelection((selectItem) => {
        const obj = selectItem.object
        if (obj) {
          const position = (<CobolVariable>obj).getDeclarationPosition()
          if (position) {
            new Editor().openFileAndSetPosition(position);
          }
          this.controller.dispose();
        }
      })
      .setObject(variable));
    if (variable.getComment()) {
      this.controller.addElement(
        new VariableElement("Documentation")
          .setDetail(variable.getComment()!.join(" | "))
          .setOnSelection(async (selectItem) => {
            const obj = selectItem.object
            if (obj) {
              const comments = (<CobolVariable>obj).getComment();
              if (comments) {
                await this.insertCommentInEditor((<CobolVariable>obj).getComment()!)
                this.controller.dispose();
              }
            }
          })
          .setObject(variable));
    }
    if (variable.getScope()) {
      this.controller.addElement(
        new VariableElement("Scope")
          .setDetail(variable.getScope()!)
          .setOnSelection(async () => {
            this.controller.dispose();
          }));
    }
    if (variable.getSection()) {
      this.controller.addElement(
        new VariableElement("Section")
          .setDetail(variable.getSection()!)
          .setOnSelection(async () => {
            this.controller.dispose();
          }));
    }
    if (variable.isMethodReturn()) {
      this.controller.addElement(
        new VariableElement("Returning")
          .setDetail("This variable is the Returning from " + variable.getScope())
          .setOnSelection(async () => {
            this.controller.dispose();
          }));
    }
  }

  /**
   * Function to insert comment in editor
   *
   * @param comments
   */
  private async insertCommentInEditor(comments: string[]) {
    const editor = new Editor();
    const cursor = editor.getCursors()[0]
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
      const childrenItem = new VariableElement(children.getName())
        .setDescription(children.getPicture() + " - Size: " + children.getByteSize())
        .setDetail(children.getRaw())
        .setOnSelection((selectItem) => {
          const chi = children.getChildren();
          if (chi) {
            this.controller.clearElements();
            const variable = <CobolVariable>selectItem.object
            this.addTheBasicInformation(variable, variable.getByteSize().toString());
            this.createChildrenItemsFromVariable(variable)
          }
        })
        .setObject(children);
      childrenItems.add(childrenItem);
    });
    return childrenItems;
  }


}
