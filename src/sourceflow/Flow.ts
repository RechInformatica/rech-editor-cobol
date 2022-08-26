import { Editor } from "../editor/editor";
import { FlowParser } from "./parser/FlowParser";
import FlowLine from "./parser/FlowLine";

export default class Flow {

    /** Map with all nodes */
    private flowMap: Map<number, Array<FlowLine>>| undefined;
    /** Start line of the flow */
    private startingLine: number | undefined;
    /** The content of the currentBuffer */
    private currentBuffer: string[] | undefined;

    /**
     * Find all possible flows starting from current line
     */
    public findFlow(): Promise<Flow> {
        const editor = new Editor();
        editor.showInformationMessage("Finding possible flows starting from current line...");
        return new Promise((resolve, reject) => {
            this.startingLine = editor.getCurrentRow();
            this.currentBuffer = editor.getEditorBuffer().replace(/\r/g, "").split("\n");
            new FlowParser().parser(this.startingLine, this.currentBuffer).then((map) => {
                this.flowMap = map;
                editor.showInformationMessage("Flow finding ended successfully!");
                return resolve(this);
            }).catch((e) => {
                editor.showInformationMessage("Fail to find Flow!              Error: " + (<Error>e).message);
                return reject(this);
            });
        })
    }

    public getCurrentBuffer(): string[] | undefined {
        return this.currentBuffer;
    }

    public getFlowMap(): Map<number, Array<FlowLine>>| undefined {
        return this.flowMap;
    }

    public getStartingLine(): number | undefined {
        return this.startingLine;
    }


}
