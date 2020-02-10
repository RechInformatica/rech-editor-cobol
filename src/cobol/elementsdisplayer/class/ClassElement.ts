import { ElementInterface } from "../ElementInterface";

/** Class to represent a Class Element to displayer */
export class ClassElement implements ElementInterface {

  _label: string;
  _description?: string | undefined;
  _detail?: string | undefined;
  _picked?: boolean | undefined;
  _onSelection: ((element: ElementInterface) => any) | undefined
  _object: any
  private children: ElementInterface[]

  constructor(label: string) {
    this.children = [];
    this._label = label;
  }

  /**
   * Defines the description
   *
   * @param description
   */
  public setDescription(description: string) {
    this._description = description;
    return this;
  }

  /**
   * Defines the detail
   *
   * @param detail
   */
  public setDetail(detail: string) {
    this._detail = detail;
    return this;
  }

  /**
   * Defines the picked
   *
   * @param picked
   */
  public setPicked(picked: boolean) {
    this._picked = picked;
    return this;
  }

  /**
   * Defines the object
   *
   * @param object
   */
  public setObject(object: any) {
    this._object = object;
    return this;
  }

  /**
   * Defines the onSelection
   *
   * @param onSelection
   */
  public setOnSelection(onSelection: ((element: ElementInterface) => any)) {
    this._onSelection = onSelection;
    return this;
  }

  /**
   * Add a children
   *
   * @param children
   */
  public add(children: ElementInterface) {
    this.children.push(children);
  }

  getChildren(): ElementInterface[] {
    return this.children;
  }

  get onSelection() {
    return this._onSelection;
  }

  get label(): string {
    return this._label
  }

  get description(): string | undefined {
    return this._description
  }

  get detail(): string | undefined {
    return this._detail
  }

  get picked(): boolean | undefined {
    return this._picked;
  }

  get object(): any {
    return this._object;
  }

}