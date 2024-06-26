import { TreeDataProvider, EventEmitter, TreeItem, commands, workspace } from "vscode";
import { Event } from "vscode-jsonrpc";
import { Editor } from "../../../editor/editor";
import { CobolFlowAnalyzer } from "../../utils/cobolFlowAnalyzer";
import NodeInterface from "../nodes/nodeInterface";
import { ParagraphNode } from "../nodes/paragraphNode";
import { MethodNode } from "../nodes/methodNode copy";
import { CommandNode } from "../nodes/commandNode";

/**
 * A class providing the COBOL flow tree data for the VS Code extension.
 */
export default class FlowProvider implements TreeDataProvider<NodeInterface> {

    private _onDidChangeTreeData: EventEmitter<NodeInterface | undefined> = new EventEmitter<NodeInterface | undefined>();
    public onDidChangeTreeData: Event<NodeInterface | undefined> = this._onDidChangeTreeData.event;

    /**
     * Initializes a new instance of the FlowProvider class and registers commands.
     * @param {any} context - The extension context provided by VS Code.
     */
    constructor(context: any) {
        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.flowparser', () => {
            this.refresh();
        }));

        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.gotoFlowLine', (node: NodeInterface) => {
            if (!node) return;
            const editor = new Editor();
            editor.setCursor(node.getRow(), 0);
        }));
    }

    /**
     * Returns a TreeItem representation of the given element.
     * @param {NodeInterface} element - The node element.
     * @returns {TreeItem | Thenable<TreeItem>} The TreeItem for the given element.
     */
    getTreeItem(element: NodeInterface): TreeItem | Thenable<TreeItem> {
        return element.getTreeItem();
    }

    /**
     * Returns the child nodes of the given element.
     * If no element is provided, returns the root nodes.
     * @param {NodeInterface | undefined} element - The parent node.
     * @returns {Thenable<NodeInterface[]>} A promise that resolves to an array of child nodes.
     */
    getChildren(element?: NodeInterface | undefined): Thenable<NodeInterface[]> {
        return new Promise((resolve, _reject) => {
            let childrens = new Array();
            if (element) {
                childrens = element.getChildren();
                const showConditionalBlockCobolFlow = <string[]>workspace.getConfiguration("rech.editor.cobol").get("showConditionalBlockCobolFlow");
                if (!showConditionalBlockCobolFlow) {
                    childrens = this.removeConditionalChildrens(childrens);
                }
            } else {
                const editor = new Editor();
                const currentLineNumber = editor.getCurrentRow();
                const sourceCode = editor.getEditorBuffer().replace(/\r/g, "").split('\n');

                const cobolAnalyzer = CobolFlowAnalyzer.getInstance();
                cobolAnalyzer.setBuffer(sourceCode);

                const node = cobolAnalyzer.getNodeFromLine(currentLineNumber);
                childrens.push(node);
            }
            resolve(childrens);
        });
    }

    /**
     * Refreshes the tree view, causing it to be re-rendered.
     */
    public refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    /**
     * Removes specific conditional nodes from a list of nodes when config is activated.
     * @param {NodeInterface[]} children - The list of nodes from which to remove conditional nodes.
     * @returns {NodeInterface[]} A new list of nodes containing only ParagraphNode and MethodNode instances.
     */
    private removeConditionalChildrens(children: NodeInterface[]): NodeInterface[] {
        const filteredChildren = new Array();
        children.forEach((node => {
            if (node instanceof ParagraphNode || node instanceof MethodNode || node instanceof CommandNode) {
                filteredChildren.push(node);
            } else {
                filteredChildren.push(...this.removeConditionalChildrens(node.getChildren()));
            }
        }));
        return filteredChildren;
    }
}
