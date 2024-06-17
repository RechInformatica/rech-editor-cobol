import { ElementsDisplayer } from "../ElementsDisplayer";
import { CobolCopy } from "../../CobolCopy";
import { CopyElement } from "./CopyElement";
import { Editor } from "../../../editor/editor";
import { GeradorCobol } from "../../gerador-cobol";
import { window } from "vscode";
import { PositionFinder } from "../../../editor/PositionFinder";
import { RechPosition } from "../../../commons/rechposition";
import { Path } from "../../../commons/path";

export class copyDisplayer {
  /** Display controller */
  private controller: ElementsDisplayer;

  constructor() {
    this.controller = new ElementsDisplayer();
  }

  /**
   * Show the copys properties
   *
   * @param copy
   */
  public show(copy: CobolCopy) {
    this.createItemsFromCopy(copy);
    this.controller.create("Copy");
    this.controller.show();
  }

  /**
   * Create items from copy
   *
   * @param copy
   */
  private createItemsFromCopy(copy: CobolCopy) {
    this.addTheBasicInformation(copy);
    const replacings = copy.getReplacings()
    if (replacings && replacings.size > 0) {
      const replacingsItems = new CopyElement("Replacings");
      this.controller.addElement(this.insertReplacings(replacingsItems, replacings, copy));
    }
  }

  /**
   * Add to displayer the basic information of the variable
   *
   * @param variable
   */
  private addTheBasicInformation(copy: CobolCopy) {
    this.controller.addElement(new CopyElement(copy.getName())
    .setDescription(copy.getUri())
    .setDetail(copy.getRaw())
    .setOnSelection((selectItem) => {
      const editor = new Editor();
      editor.openFile(new Path(selectItem.description).fullPathWin())
      this.controller.dispose();
    }));
    if (copy.getHeader()) {
      this.controller.addElement(
        new CopyElement("Header")
        .setDetail(copy.getHeader()!.join(" | "))
        .setOnSelection(async (selectItem) => {
          const obj = selectItem.object
          if (obj) {
            const comments = (<CobolCopy>obj).getHeader();
            if (comments) {
              await this.insertCommentInEditor((<CobolCopy>obj).getHeader()!)
              this.controller.dispose();
            }
          }
        })
        .setObject(copy));
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
   * Inser the replacing list in the displayer options
   *
   * @param childrenItems
   * @param children
   */
  private insertReplacings(replacingsItems: CopyElement, replacings: Map<string, string>, copy: CobolCopy): CopyElement {
    replacings.forEach((replace, term) => {
      const replacingItem = new CopyElement(term)
      .setDescription("by " + replace)
      .setDetail("Modify replcaement")
      .setOnSelection((selectItem) => {
        this.createReplacingOnSelecionCallback(selectItem.object, selectItem.label)
        this.controller.dispose()
      })
      .setObject(copy);
      replacingsItems.add(replacingItem);
    });
    return replacingsItems;
  }

  /**
   * Create on Selection callback
   *
   * @param copy
   */
  private createReplacingOnSelecionCallback(copy: CobolCopy, label: string) {
    const editor = new Editor();
    window.showInputBox({value: "New replace"}).then((newValue) => {
      if (newValue) {
        const document = window.activeTextEditor
        if (document) {
          const replaces = copy.getReplacings();
          const term = replaces!.get(label)!.trim();
          if (term.startsWith("==") && term.endsWith("==")) {
            if (!(newValue.startsWith("==") && newValue.endsWith("=="))) {
              newValue = `==${newValue}==`
            }
          }
          const regexp = new RegExp(label!.replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\""/g, "\""), "g")
          const positionsToReturn = new PositionFinder(document).findPositions(regexp, PositionFinder.FindNext, document.document.lineAt(copy.getLineDeclaration()), true);
          if (positionsToReturn) {
            const column = editor.getLine(positionsToReturn[0].line).indexOf(term!)
            editor.setCursor(positionsToReturn[0].line, column)
            const start = editor.getCursors()[0];
            const end = new RechPosition(start.line, start.column + term!.length)
            editor.selectRange(start, end);
            editor.replaceSelection(newValue);
          }
        }
      }
    });
  }


}
