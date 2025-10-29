import { CommandNode } from "../treeView/nodes/commandNode";
import NodeInterface from "../treeView/nodes/nodeInterface";
import { ParagraphNode } from "../treeView/nodes/paragraphNode";
import { NodeType } from "./nodeType";
import { MethodNode } from "../treeView/nodes/methodNode copy";
import { IfNode } from "../treeView/nodes/ifNode";
import { ElseNode } from "../treeView/nodes/elseNode";
import { WhenNode } from "../treeView/nodes/whenNode";
import { PerformLoopNode } from "../treeView/nodes/performLoopNode";
import { Scan } from "rech-ts-commons";

/**
 * A class for analyzing COBOL source code, identifying various structural elements such as methods,
 * paragraphs, and control flow constructs.
 */
export class CobolFlowAnalyzer {

    private static instance: CobolFlowAnalyzer;
    private buffer: string[];

    /**
    * Returns the singleton instance of the CobolFlowAnalyzer class.
    * If the instance does not exist, it creates a new one.
    * @returns {CobolFlowAnalyzer} The singleton instance.
    */
    public static getInstance(): CobolFlowAnalyzer {
        if (!this.instance) {
            this.instance = new CobolFlowAnalyzer();
        }
        return this.instance;
    }

    constructor() {
        this.buffer = [];
    }

    /**
     * Sets the buffer for the analyzer.
     * @param {string[]} value - The COBOL source code split into an array of lines.
     */
    public setBuffer(value: string[]) {
        this.buffer = value;
    }

    /**
     * Retrieves a a node representing command for perform thru call for the given row.
     * @param {number} currentRow - The current row in the buffer.
     * @returns {NodeInterface} A node representing paragraph perform thru statement.
     */
    public getPerformThruParents(currentRow: number): NodeInterface | undefined {
        const performThruDeclarationList = [];
        const regex = new RegExp(`\\s+perform\\s+([\\w-]+)\\s+thru\\s+([\\w-]+).*$`, 'gm');
        new Scan(this.buffer.join('\n')).scan(regex, (iterator: any) => {
            const beginParagraph = iterator.match[1];
            const endParagraph = iterator.match[2];
            performThruDeclarationList.push({
                row: iterator.row,
                begin: beginParagraph,
                end: endParagraph
            });
        });

        const performInsideThruList = new Map();
        performThruDeclarationList.forEach((performThru) => {
            const regexBegin = new RegExp(`^ {7}${performThru.begin}\.(?:\\s*\\*\\>.*)?`, 'gm');
            let firstParagraphPosition = 0;
            new Scan(this.buffer.join('\n')).scan(regexBegin, (iterator: any) => {
                firstParagraphPosition = iterator.row;
            });

            const regexEnd = new RegExp(`^ {7}${performThru.end}\.(?:\\s*\\*\\>.*)?`, 'gm');
            let lastParagraphPosition = 0;
            new Scan(this.buffer.join('\n')).scan(regexEnd, (iterator: any) => {
                lastParagraphPosition = iterator.row;
            });

            const paragraphRows = [];
            for (let row = firstParagraphPosition; row < lastParagraphPosition; row++) {
                const paragraphDeclaration = CobolFlowAnalyzer.getParagraphDeclaration(this.buffer[row]);
                if (paragraphDeclaration) {
                    paragraphRows.push(row - 1);
                }
            }
            performInsideThruList.set(performThru.row, paragraphRows);
        });

        for (const [declarationRow, paragraphInsideRows] of performInsideThruList.entries()) {
            if (paragraphInsideRows.includes(currentRow)) {
                return new CommandNode(declarationRow, this.buffer[declarationRow].trim());
            }
        }
        return undefined;
    }

    /**
     * Retrieves a list of nodes representing method calls for the given row.
     * @param {number} currentRow - The current row in the buffer.
     * @returns {NodeInterface[]} A list of nodes representing method calls statements.
     */
    public getMethodCalls(currentRow: number): NodeInterface[] {
        const performList = [];
        const currentLine = this.buffer[currentRow];
        const methodName = CobolFlowAnalyzer.getMethodDeclaration(currentLine);
        const regex = new RegExp(`^.*self:>${methodName}[.,\\s$]`, 'gm');
        new Scan(this.buffer.join('\n')).scan(regex, (iterator: any) => {
            performList.push(this.getNodeFromLine(iterator.row));
        });
        return performList;
    }

    /**
     * Retrieves a list of nodes representing perform/goto statements for the given row.
     * @param {number} currentRow - The current row in the buffer.
     * @returns {NodeInterface[]} A list of nodes representing perform/goto statements.
     */
    public getPerformGotoParagraphList(currentRow: number): NodeInterface[] {
        const performList = [];
        const currentLine = this.buffer[currentRow];
        const paragraphName = CobolFlowAnalyzer.getParagraphDeclaration(currentLine);
        const regex = new RegExp(`^\\s*(perform|go to)\\s+${paragraphName}[.,\\s$]`, 'gm');
        new Scan(this.buffer.join('\n')).scan(regex, (iterator: any) => {
            performList.push(this.getNodeFromLine(iterator.row));
        });
        return performList;
    }

    /**
     * Retrieves the next method declaration starting from the given row.
     * @param {number} currentRow - The current row in the buffer.
     * @returns {NodeInterface | undefined} The next method declaration node or undefined if not found.
     */
    public getNextMethodDeclaration(currentRow: number): NodeInterface | undefined {
        let nextMethodDeclaration;
        for (let i = currentRow; i >= 0; i--) {
            const currentLine = this.buffer[i]
            const nodeInfo = CobolFlowAnalyzer.getInfoFromLine(currentLine);
            if (nodeInfo.nodeType == NodeType.Method) {
                nextMethodDeclaration = new MethodNode(i, nodeInfo.nodeName);
                break;
            }
            if (nodeInfo.nodeType == NodeType.Paragraph) {
                break;
            }
        }
        return nextMethodDeclaration;
    }

    /**
     * Retrieves the block of code at the given row and node type.
     * @param {number} currentRow - The current row in the buffer.
     * @param {NodeType} nodeTypeCommand - The type of node to search for.
     * @returns {NodeInterface} The block node found at the specified location.
     */
    public getBlockAt(currentRow: number, nodeTypeCommand: NodeType): NodeInterface {
        let openBlocks = 0;
        for (let i = currentRow; i >= 0; i--) {
            const currentLine = this.buffer[i]
            const nodeInfo = CobolFlowAnalyzer.getInfoFromLine(currentLine)
            if (CobolFlowAnalyzer.isEndBlock(currentLine)) {
                openBlocks++;
                continue;
            }
            if (openBlocks > 0) {
                if (nodeInfo.nodeType == NodeType.PerformLoop || nodeInfo.nodeType == NodeType.If || nodeInfo.nodeType == NodeType.Evaluate) {
                    openBlocks--;
                }
                continue;
            }
            if (openBlocks == 0) {
                if (nodeTypeCommand == nodeInfo.nodeType) {
                    continue;
                }
                switch (nodeInfo.nodeType) {
                    case NodeType.Paragraph:
                        return new ParagraphNode(i, nodeInfo.nodeName);
                    case NodeType.Method:
                        return new MethodNode(i, nodeInfo.nodeName);
                    case NodeType.If:
                        return new IfNode(i, nodeInfo.nodeName);
                    case NodeType.Else:
                        return new ElseNode(i, nodeInfo.nodeName);
                    case NodeType.PerformLoop:
                        return new PerformLoopNode(i, nodeInfo.nodeName);
                    case NodeType.When:
                        return new WhenNode(i, nodeInfo.nodeName);
                }
            }
        }
        return this.getNodeFromLine(0);
    }

    /**
     * Retrieves the node from the specified row number.
     * @param {number} rowNumber - The row number in the buffer.
     * @returns {NodeInterface} The node corresponding to the given row.
     */
    public getNodeFromLine(rowNumber: number): NodeInterface {
        const currentLine = this.buffer[rowNumber];
        const nodeInfo = CobolFlowAnalyzer.getInfoFromLine(currentLine);
        switch (nodeInfo.nodeType) {
            case NodeType.Paragraph:
                return new ParagraphNode(rowNumber, nodeInfo.nodeName);
            case NodeType.Method:
                return new MethodNode(rowNumber, nodeInfo.nodeName);
            case NodeType.If:
                return new IfNode(rowNumber, nodeInfo.nodeName);
            case NodeType.Else:
                return new ElseNode(rowNumber, nodeInfo.nodeName);
            case NodeType.When:
                return new WhenNode(rowNumber, nodeInfo.nodeName);
            case NodeType.PerformLoop:
                return new PerformLoopNode(rowNumber, nodeInfo.nodeName);
            default:
                return new CommandNode(rowNumber, nodeInfo.nodeName);
        }
    }

    private static getInfoFromLine(currentLine: string): { nodeType: NodeType, nodeName: string } {

        const methodName = CobolFlowAnalyzer.getMethodDeclaration(currentLine)
        if (methodName) {
            return {
                nodeType: NodeType.Method,
                nodeName: methodName
            };
        }

        const paragraphName = CobolFlowAnalyzer.getParagraphDeclaration(currentLine)
        if (paragraphName) {
            return {
                nodeType: NodeType.Paragraph,
                nodeName: paragraphName
            };
        }

        const ifCommand = CobolFlowAnalyzer.getIfCommand(currentLine)
        if (ifCommand) {
            return {
                nodeType: NodeType.If,
                nodeName: ifCommand
            };
        }

        const elseCommand = CobolFlowAnalyzer.getElseCommand(currentLine)
        if (elseCommand) {
            return {
                nodeType: NodeType.Else,
                nodeName: elseCommand
            };
        }

        const whenCommand = CobolFlowAnalyzer.getWhenCommand(currentLine)
        if (whenCommand) {
            return {
                nodeType: NodeType.When,
                nodeName: whenCommand
            };
        }

        const performLoopCommand = CobolFlowAnalyzer.getPerformLoopCommand(currentLine)
        if (performLoopCommand) {
            return {
                nodeType: NodeType.PerformLoop,
                nodeName: performLoopCommand
            };
        }

        const evaluateCommand = CobolFlowAnalyzer.getEvaluateCommand(currentLine)
        if (evaluateCommand) {
            return {
                nodeType: NodeType.Evaluate,
                nodeName: evaluateCommand
            };
        }

        return {
            nodeType: NodeType.Command,
            nodeName: currentLine.trim()
        };

    }

    private static getMethodDeclaration(line: string): string | undefined {
        const methodDeclarationRegex = /^ {7}method-id\.\s*(\w+)[\s.$].*/gi;
        const match = methodDeclarationRegex.exec(line);
        let methodName;
        if (match && match[1]) {
            methodName = match[1];
        }
        return methodName?.trim();
    }

    private static getParagraphDeclaration(line: string): string | undefined {
        const paragraphDeclarationRegex = /^ {7}([\w\-]+)\.(?:\s*\*\>.*)?/gi;
        const match = paragraphDeclarationRegex.exec(line);
        let paragraphName;
        if (match && match[1]) {
            paragraphName = match[1];
        }
        return paragraphName?.trim();
    }

    private static getIfCommand(line: string): string | undefined {
        const ifCommandRegex = /^ *if\s+.*/gi;
        const match = ifCommandRegex.exec(line);
        let ifCommand;
        if (match) {
            ifCommand = line;
        }
        return ifCommand?.trim();
    }

    private static getElseCommand(line: string): string | undefined {
        const elseCommandRegex = /^\s+else([ ,]|$)/gi;
        const match = elseCommandRegex.exec(line);
        let elseCommand;
        if (match) {
            elseCommand = line;
        }
        return elseCommand?.trim();
    }

    private static getWhenCommand(line: string): string | undefined {
        const whenCommandRegex = /^\s+when\s+.*/gi;
        const match = whenCommandRegex.exec(line);
        let whenCommand;
        if (match) {
            whenCommand = line;
        }
        return whenCommand?.trim();
    }

    private static getPerformLoopCommand(line: string): string | undefined {
        const performLoopCommandRegex = /^\s+perform(\s*$|\s+varying|\s+until)/gi;
        const match = performLoopCommandRegex.exec(line);
        let performLoopCommand;
        if (match) {
            performLoopCommand = line;
        }
        return performLoopCommand?.trim();
    }

    private static getEvaluateCommand(line: string): string | undefined {
        const performLoopCommandRegex = /^\s+evaluate\s+.*/gi;
        const match = performLoopCommandRegex.exec(line);
        let evaluateCommand;
        if (match) {
            evaluateCommand = line;
        }
        return evaluateCommand?.trim();
    }

    private static isEndBlock(line: string): boolean {
        const endBlockRegex = /^\s+end-[\w]*/gi;
        const match = endBlockRegex.exec(line);
        if (match) {
            return true;
        }
        return false;
    }
}
