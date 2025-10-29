import { CobolMethod } from "../completion/CobolMethod";

export class MethodChainResolver {

    constructor(private splittedLines: string[]) {
    }

    public resolveFullChain(line: number, column: number): string[] {
        let chain = [];
        const currentLine = this.splittedLines[line].substr(0, column).trim().replace(/\(.*?\)/g, "");
        const partsFromLine = currentLine.match(/[\w:>\-_]+/g);
        if (!partsFromLine) {
            return [];
        }
        const currentCommand = partsFromLine[partsFromLine.length - 1];
        const parts = currentCommand.split(CobolMethod.TOKEN_INVOKE_METHOD);
        for (let i = parts.length - 1; i >= 0; i--) {
            if (parts[i].includes(" ")) {
                break;
            }
            if (parts[i] == "" && currentLine.startsWith(CobolMethod.TOKEN_INVOKE_METHOD)) {
                continue;
            }
            chain.push(parts[i])
        }
        if (currentCommand.startsWith(CobolMethod.TOKEN_INVOKE_METHOD)) {
            chain = chain.concat(this.resolveFullChain(line - 1, 120));
        }
        return chain;
    }

}
