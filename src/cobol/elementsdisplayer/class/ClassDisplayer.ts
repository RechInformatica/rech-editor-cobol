import { ElementsDisplayer } from "../ElementsDisplayer";
import { CobolVariable } from "../../../lsp/completion/CobolVariable";
import { Editor } from "../../../editor/editor";
import { ClassElement } from "./ClassElement";

export class ClassDisplayer {
  /** Display controller */
  private controller: ElementsDisplayer;

  constructor() {
    this.controller = new ElementsDisplayer();
  }

  /**
   * Show the class properties
   *
   * @param classs
   */
  public show(classs: CobolVariable) {
    this.createItemsFromClass(classs);
    this.controller.create("Class");
    this.controller.show();
  }

  /**
   * Create items from class
   *
   * @param classs
   */
  private createItemsFromClass(classs: CobolVariable) {
    this.controller.addElement(new ClassElement(classs.getName())
    .setDescription(classs.getPicture())
    .setDetail(classs.getRaw())
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
    .setObject(classs));
  }

}
