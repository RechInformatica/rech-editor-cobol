import { TreeItem, TreeItemCollapsibleState } from "vscode";
import * as path from 'path';
import NodeInterface from "./NodeInterface";
import Flow from "../../Flow";

export default class FlowNode implements NodeInterface {

    private lineNumber: number;
    private flow: Flow;

    constructor(lineNumber: number, flow: Flow) {
        this.lineNumber = lineNumber;
        this.flow = flow;
    }

    public getTreeItem(): TreeItem {
        let item;
        let labelAux : RegExpMatchArray | null;
        let finalLabel: string;
        finalLabel = " ";
        const children = this.flow.getFlowMap() ? this.flow.getFlowMap()!.get(this.lineNumber) : undefined;
        labelAux = this.flow.getCurrentBuffer()![this.lineNumber].trim().match(/(\S+)/g)
        if (labelAux) {
            labelAux.forEach( e => {
                finalLabel += " " + e;
            });
        };
        const label = (this.lineNumber + 1) + ":" + finalLabel;
        if (children && children.length > 0) {
            item = new FlowItem(label, TreeItemCollapsibleState.Collapsed);
        } else {
            item = new FlowItem(label, TreeItemCollapsibleState.None);
        }
        item.iconPath = {
            dark: path.join(__filename, '..', '..', '..', '..', '..', 'images', 'nodes-dark.svg'),
            light: path.join(__filename, '..', '..', '..', '..', '..','images', 'nodes-light.svg'),
        }
        return item;
    };

    public getChildren(): NodeInterface[] {
        const result = new Array();
        const children = this.flow.getFlowMap() ? this.flow.getFlowMap()!.get(this.lineNumber) : undefined;
        if (children) {
            children.forEach((value) => {
                result.push(new FlowNode(value.lineNumber, this.flow));
            });
        }
        return result;
    }

    /**
     * Returns the line number
     */
    public getLineNumber() {
        return this.lineNumber;
    }
}

/**
 * Flow item
 */
export class FlowItem extends TreeItem {
    constructor(label: string, collapsibleState?: TreeItemCollapsibleState) {
        super(label, collapsibleState);
    }
}
