import ContextFactory from "./ContextFactory";
import FlowLine from "./FlowLine";

export class FlowParser {

    /**
     * flow map from buffer
     */
    private flowMap: Map<number, Array<FlowLine>>;

    /**
     * Construct new parser
     */
    constructor() {
        this.flowMap = new Map();
    }

    /**
     * Parse the buffer and returns flowMap
     *
     * @param line
     * @param buffer
     */
    public parser(line: number, buffer: string[], ): Promise<Map<number, Array<FlowLine>>> {
        return new Promise((resolve, reject) => {
            let contextArray: Array<FlowLine> = new Array();
            ContextFactory.parseContext(line, buffer).then((result) => {
                contextArray = contextArray.concat(result);
                if (this.flowMap.has(line)) {
                    return resolve(this.flowMap)
                }
                this.flowMap.set(line, contextArray);
                if (contextArray.length > 0) {
                    contextArray.forEach((context) => {
                        this.parser(context.lineNumber, buffer).then(() => {
                            return resolve(this.flowMap);
                        }).catch(() => {
                            reject();
                        });
                    })
                } else {
                    return resolve(this.flowMap)
                }
            }).catch(() => {
                return reject();
            });
        })
    }

}