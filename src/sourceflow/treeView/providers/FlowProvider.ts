import { TreeDataProvider, EventEmitter, TreeItem, ProviderResult, commands } from "vscode";
import NodeInterface from "../nodes/NodeInterface";
import { Event } from "vscode-jsonrpc";
import Flow from "../../Flow";
import FlowNode, { FlowItem } from "../nodes/FlowNode";
import { Editor } from "../../../editor/editor";

/**
 * Provider from source flow
 */
export default class FlowProvider implements TreeDataProvider<NodeInterface> {

    private flow: Flow;

    /** Controls the TreeData Events */
    private _onDidChangeTreeData: EventEmitter<NodeInterface | undefined> = new EventEmitter<NodeInterface | undefined>();
    public onDidChangeTreeData: Event<NodeInterface | undefined> = this._onDidChangeTreeData.event;

    /**
     * Build a new Flow Provider
     */
    constructor(context: any) {
        this.flow = new Flow();
        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.flowparser', () => {
            this.flow = new Flow();
            this.refresh();
            this.flow.findFlow().then(() => {
                this.refresh();
            }).catch(() => {
                console.log("Error to find flow");
            });
        }));
        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.gotoFlowLine', (node: FlowNode) => {
            if (!node) return;
            let editor = new Editor();
            editor.setCursor(node.getLineNumber(), 120);
        }));
    }

    getTreeItem(element: NodeInterface): TreeItem | Thenable<TreeItem> {
        return element.getTreeItem();
    }


    getChildren(element?: NodeInterface | undefined): ProviderResult<NodeInterface[]> {
        return new Promise((resolve, _reject) => {
            let children = new Array<NodeInterface>();
            if (element) {
                children = (<NodeInterface[]> element.getChildren());
            } else {
                if (this.flow && this.flow.getFlowMap()) {
                    let key = this.flow.getStartingLine()!;
                    if (key) children.push(new FlowNode(key, this.flow))

                }
            }
            resolve(children);
        })
    }

    /**
     * Refresh the treeView
     */
    public refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}
