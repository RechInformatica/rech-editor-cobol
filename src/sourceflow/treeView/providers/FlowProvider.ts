import { TreeDataProvider, Event, EventEmitter, TreeItem, TreeItemCollapsibleState, commands, workspace, TreeView, window, Uri } from "vscode";
import { Editor } from "../../../editor/editor";
import { CobolFlowAnalyzer } from "../../utils/cobolFlowAnalyzer";
import NodeInterface from "../nodes/NodeInterface";
import { ParagraphNode } from "../nodes/paragraphNode";
import { MethodNode } from "../nodes/methodNode";
import { CommandNode } from "../nodes/commandNode";
import { InvertedNode } from "../nodes/invertedNode";
import { LoopNode } from "../nodes/loopNode";

/**
 * A class providing the COBOL flow tree data for the VS Code extension.
 */
export default class FlowProvider implements TreeDataProvider<NodeInterface> {

    // Event emitter for tree data changes
    private _onDidChangeTreeData: EventEmitter<NodeInterface | undefined> = new EventEmitter<NodeInterface | undefined>();
    public onDidChangeTreeData: Event<NodeInterface | undefined> = this._onDidChangeTreeData.event;

    // Controller properties
    private isAscending: boolean = true;
    private invertedTreeCache: NodeInterface[] | null = null;
    private expandAll: boolean = false;
    private isCancelled: boolean = false;

    // State properties
    private treeView: TreeView<NodeInterface> | null = null;
    private parentMap: Map<NodeInterface, NodeInterface | undefined> = new Map();
    private isAnalysisRunning: boolean = false;
    private lastOriginalNode: NodeInterface | null = null;
    private nodeAncestorsMap: Map<NodeInterface, number[]> = new Map();
    private analysisRootNode: NodeInterface | null = null;
    private analyzedSourceCode: string[] | null = null;
    private analyzedFileUri: Uri | null = null;
    private expandRunId: number = 0;
    private nodeCount: number = 0;
    private nodeCountLimitExceeded: boolean = false;

    /**
     * Initializes a new instance of the FlowProvider class and registers commands.
     * @param {any} context - The extension context provided by VS Code.
     */
    constructor(context: any) {
        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.flowparser', () => {
            this.analyzeFromCursor();
        }));

        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.gotoFlowLine', async (node: NodeInterface) => {
            if (!node) return;

            if (this.analyzedFileUri) {
                try {
                    await window.showTextDocument(this.analyzedFileUri, { preview: false });
                    const editor = new Editor();
                    editor.setCursor(node.getRow(), 0);
                } catch (err) {
                    console.error('[FlowProvider] Failed to show document:', err);
                }
            } else {
                const editor = new Editor();
                editor.setCursor(node.getRow(), 0);
            }
        }));

        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.toggleFlowOrder', () => {
            this.toggleSortOrder();
        }));

        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.toggleExpandCollapseFlow', () => {
            this.toggleExpandCollapse();
        }));

        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.cancelFlowAnalysis', () => {
            this.cancelAnalysis();
        }));
    }

    /**
     * Cancels the current flow analysis.
     */
    private cancelAnalysis(): void {

        if (!this.isAnalysisRunning && !this.expandAll) {
            window.showWarningMessage('Nenhum processamento de fluxo COBOL esta em execucao.');
            return;
        }

        this.isCancelled = true;
        this.expandRunId++;
        this.expandAll = false;
        this.nodeCount = 0;
        this.nodeCountLimitExceeded = false;
        this.setAnalysisRunning(false);

        // Force refresh to stop any ongoing tree building
        this.invertedTreeCache = null;
        this.lastOriginalNode = null;

        commands.executeCommand('workbench.actions.treeView.cobolflowview.collapseAll');
        window.showWarningMessage('Processamento de fluxo COBOL cancelado.');
    }

    /**
     * Sets the analysis running state and updates the context.
     * @param {boolean} running - Whether analysis is running.
     */
    private setAnalysisRunning(running: boolean): void {
        this.isAnalysisRunning = running;
        commands.executeCommand('setContext', 'rech.editor.cobol.flowAnalysisRunning', running);
    }

    /**
     * Checks if node count limit has been exceeded.
     * @returns {boolean} True if limit exceeded, false otherwise.
     */
    private checkNodeCountLimit(): boolean {
        if (this.nodeCountLimitExceeded) {
            return true;
        }

        this.nodeCount++;
        const maxNodes = workspace.getConfiguration("rech.editor.cobol").get<number>("flowAnalysisMaxNodes", 500);

        if (this.nodeCount > maxNodes) {
            this.nodeCountLimitExceeded = true;
            this.setAnalysisRunning(false);
            window.showWarningMessage(
                `Limite de ${maxNodes} nodos da análise de fluxo COBOL foi atingido. A análise foi parada para evitar processamento excessivo.`
            );
            return true;
        }

        return false;
    }

    /**
     * Returns a TreeItem representation of the given element.
     * When expand-all mode is active, forces collapsible nodes to be expanded.
     * @param {NodeInterface} element - The node element.
     * @returns {TreeItem | Thenable<TreeItem>} The TreeItem for the given element.
     */
    getTreeItem(element: NodeInterface): TreeItem | Thenable<TreeItem> {
        const item = element.getTreeItem();
        if (this.expandAll && item.collapsibleState === TreeItemCollapsibleState.Collapsed) {
            item.collapsibleState = TreeItemCollapsibleState.Expanded;
        } else if (!this.expandAll && item.collapsibleState === TreeItemCollapsibleState.Expanded) {
            item.collapsibleState = TreeItemCollapsibleState.Collapsed;
        }
        return item;
    }

    /**
     * Returns the child nodes of the given element.
     * If no element is provided, returns the root nodes.
     * @param {NodeInterface | undefined} element - The parent node.
     * @returns {Thenable<NodeInterface[]>} A promise that resolves to an array of child nodes.
     */
    async getChildren(element?: NodeInterface | undefined): Promise<NodeInterface[]> {
        // Check for cancellation
        if (this.isCancelled) {
            return [];
        }

        let childrens = [];
        if (element) {
            // Check if node count limit exceeded
            if (this.checkNodeCountLimit()) {
                return [];
            }

            this.ensureAnalyzerBuffer();
            const elementAncestors = this.nodeAncestorsMap.get(element) || [];
            childrens = element.getChildren(elementAncestors);
            const showConditionalBlockCobolFlow = <string[]>workspace.getConfiguration("rech.editor.cobol").get("showConditionalBlockCobolFlow");
            if (!showConditionalBlockCobolFlow) {
                const childrenAncestors = [...elementAncestors, element.getRow()];
                childrens = this.removeConditionalChildrens(childrens, childrenAncestors);
            }

            // Track parent-child relationships
            const childrenAncestors = [...elementAncestors, element.getRow()];
            for (const child of childrens) {
                this.parentMap.set(child, element);
                if (!this.nodeAncestorsMap.has(child)) {
                    this.nodeAncestorsMap.set(child, childrenAncestors);
                }
            }
        } else {
            if (!this.analysisRootNode) {
                this.resolveAnalysisRootFromCursor();
            }

            if (!this.analysisRootNode) {
                return [];
            }

            const node = this.analysisRootNode;
            this.ensureAnalyzerBuffer();

            if (this.isAscending) {
                childrens.push(node);
            } else {

                // Check if we need to rebuild the inverted tree
                const needsRebuild = !this.invertedTreeCache ||
                                    this.lastOriginalNode?.getRow() !== node.getRow();

                if (needsRebuild) {
                    // Build inverted tree only when needed
                    this.invertedTreeCache = await this.buildInvertedTree(node);

                    // Check if cancelled during build
                    if (this.isCancelled) {
                        return [];
                    }

                    this.lastOriginalNode = node;
                }

                childrens = this.invertedTreeCache || [];
            }

            // Root nodes have no parent
            for (const child of childrens) {
                this.parentMap.set(child, undefined);
                this.nodeAncestorsMap.set(child, []);
            }
        }

        return childrens;
    }

    /**
     * Returns the parent of the given element.
     * Required for the reveal() method to work in the tree view.
     * @param {NodeInterface} element - The node element.
     * @returns {NodeInterface | undefined} The parent node, or undefined if it's a root node.
     */
    getParent(element: NodeInterface): NodeInterface | undefined {
        return this.parentMap.get(element);
    }

    /**
     * Refreshes the tree view, causing it to be re-rendered.
     */
    public refresh(): void {
        this.analyzeFromCursor();
    }

    /**
     * Toggles the sort order between ascending and descending.
     */
    public toggleSortOrder(): void {
        this.isAscending = !this.isAscending;
        if (!this.analysisRootNode) {
            this.analyzeFromCursor();
            return;
        }

        // Order changed: rebuild only visual/cached representation from existing root
        this.invertedTreeCache = null;
        this.lastOriginalNode = null;
        this.parentMap.clear();
        this.nodeAncestorsMap.clear();
        this._onDidChangeTreeData.fire(undefined);
    }

    /**
     * Sets the tree view reference for programmatic expansion/collapse.
     * @param {TreeView<NodeInterface>} treeView - The tree view instance.
     */
    public setTreeView(treeView: TreeView<NodeInterface>): void {
        this.treeView = treeView;
    }

    /**
     * Toggles between expanding all and collapsing all nodes.
     * When expanding, enables expand mode and recursively expands all existing nodes.
     * This ensures that both existing and new items in the tree are properly expanded.
     */
    public toggleExpandCollapse(): void {

        if (!this.analysisRootNode) {
            window.showWarningMessage('A arvore de fluxo COBOL ainda nao foi carregada.');
            return;
        }

        if (this.expandAll) {
            // Currently expanded, so collapse all using current tree state only.
            this.expandAll = false;
            this.isCancelled = false;
            this.nodeCount = 0;
            this.nodeCountLimitExceeded = false;
            this.setAnalysisRunning(false);
            commands.executeCommand('workbench.actions.treeView.cobolflowview.collapseAll');
            this._onDidChangeTreeData.fire(undefined);
            return;
        }

        // Currently collapsed, so expand all from existing loaded tree (no re-analysis).
        this.isCancelled = false;
        this.expandAll = true;
        this.nodeCount = 0;
        this.nodeCountLimitExceeded = false;
        this.setAnalysisRunning(false);
        this._onDidChangeTreeData.fire(undefined);

        if (this.treeView) {
            setTimeout(async () => {
                try {
                    const roots = await this.getChildren();
                    for (let i = 0; i < roots.length; i++) {
                        await this.treeView?.reveal(roots[i], { expand: true, select: false, focus: false });
                    }
                } catch (e) {
                    console.warn('[FlowProvider] Could not reveal root nodes', e);
                }
            }, 100);
        }
    }

    /**
     * Starts a new analysis using the current cursor line and active editor buffer.
     * This defines the root context used by invert/expand/collapse actions.
     */
    private analyzeFromCursor(): void {
        this.isCancelled = false;
        this.expandRunId++;
        this.setAnalysisRunning(false);
        this.nodeCount = 0;
        this.nodeCountLimitExceeded = false;
        CobolFlowAnalyzer.getInstance().clearCache();

        this.resolveAnalysisRootFromCursor();

        // New analysis means rebuilding all visual caches from the new root
        this.invertedTreeCache = null;
        this.lastOriginalNode = null;
        this.parentMap.clear();
        this.nodeAncestorsMap.clear();
        this._onDidChangeTreeData.fire(undefined);
    }

    /**
     * Resolves and stores the analysis root from the current cursor.
     */
    private resolveAnalysisRootFromCursor(): void {
        const editor = new Editor();
        const currentLineNumber = editor.getCurrentRow();
        const sourceCode = editor.getEditorBuffer().replace(/\r/g, "").split('\n');

        this.analyzedSourceCode = sourceCode;

        // Save the currently active document URI so we can return to it later
        if (window.activeTextEditor) {
            this.analyzedFileUri = window.activeTextEditor.document.uri;
        }

        const cobolAnalyzer = CobolFlowAnalyzer.getInstance();
        cobolAnalyzer.setBuffer(sourceCode);
        this.analysisRootNode = cobolAnalyzer.getNodeFromLine(currentLineNumber);
    }

    /**
     * Ensures analyzer buffer stays aligned with the source used to build the current tree.
     */
    private ensureAnalyzerBuffer(): void {
        if (!this.analyzedSourceCode) {
            return;
                    const child = children[i];
                    await this.expandNodeAndChildren(child, depth + 1);
                }
            }
        } catch (error) {
            // Ignore errors from reveal (e.g., if node is not visible)
            console.warn(`${indent}[FlowProvider] Could not expand node:`, error);
        }
        CobolFlowAnalyzer.getInstance().setBuffer(this.analyzedSourceCode);
    }

    /**
     * Builds an inverted tree from the original tree.
     * Uses a single traversal to collect all root-to-leaf paths, builds an inverted
     * adjacency list, then constructs the tree recursively with cycle detection.
     * Each InvertedNode is a unique instance — no sharing — so cycles in the COBOL
     * code are properly terminated with LoopNode instead of creating infinite graphs.
     * @param {NodeInterface} root - The root node of the original tree.
     * @returns {NodeInterface[]} Array of leaf nodes (now roots in inverted tree).
     */
    private async buildInvertedTree(root: NodeInterface): Promise<NodeInterface[]> {
        this.setAnalysisRunning(true);

        if (this.isCancelled) {
            this.setAnalysisRunning(false);
            return [];
        }

        const showConditionalBlockCobolFlow = <string[]>workspace.getConfiguration("rech.editor.cobol").get("showConditionalBlockCobolFlow");

        // Step 1: Single traversal — collect all root-to-leaf paths
        const allPaths: NodeInterface[][] = [];
        try {
            await this.collectPaths(root, [], allPaths, showConditionalBlockCobolFlow, []);

            if (this.isCancelled) {
                this.setAnalysisRunning(false);
                return [];
            }

        } catch (error) {
            this.setAnalysisRunning(false);
            throw error;
        }

        // Step 2: Build inverted adjacency list and node reference map
        const nodeByRow = new Map<number, NodeInterface>();
        const invertedAdj = new Map<number, Set<number>>();

        for (const path of allPaths) {
            if (this.isCancelled) {
                this.setAnalysisRunning(false);
                return [];
            }

            for (const node of path) {
                if (!nodeByRow.has(node.getRow())) {
                    nodeByRow.set(node.getRow(), node);
                }
            }
            // Invert relationships: for path [root, ..., leaf],
            // each node's inverted child is its parent in the original tree
            for (let i = path.length - 1; i > 0; i--) {
                const childRow = path[i].getRow();
                const parentRow = path[i - 1].getRow();
                if (!invertedAdj.has(childRow)) {
                    invertedAdj.set(childRow, new Set());
                }
                invertedAdj.get(childRow)!.add(parentRow);
            }
        }

        // Step 3: Build inverted tree recursively with cycle detection
        const invertedRoots: NodeInterface[] = [];
        const addedRootRows = new Set<number>();

        try {
            for (const path of allPaths) {
                if (this.isCancelled) {
                    this.setAnalysisRunning(false);
                    return [];
                }

                const leafRow = path[path.length - 1].getRow();
                if (!addedRootRows.has(leafRow)) {
                    addedRootRows.add(leafRow);
                    invertedRoots.push(this.buildInvertedSubtree(leafRow, nodeByRow, invertedAdj, new Set()));
                }
            }

            const endTime = Date.now();

            this.setAnalysisRunning(false);
            return invertedRoots;
        } catch (error) {
            console.error('[FlowProvider] Error during inverted tree building:', error);
            this.setAnalysisRunning(false);
            return [];
        }
    }

    /**
     * Recursively builds an inverted subtree. Each call creates a NEW InvertedNode
     * instance (no sharing), tracking ancestors to detect and break cycles with LoopNode.
     * @param {number} row - The row number of the node to create.
     * @param {Map<number, NodeInterface>} nodeByRow - Map of row numbers to original nodes.
     * @param {Map<number, Set<number>>} adjacency - Inverted adjacency list (row → set of inverted children rows).
     * @param {Set<number>} ancestors - Set of row numbers already visited in this branch (cycle detection).
     * @returns {NodeInterface} The constructed InvertedNode subtree.
     */
    private buildInvertedSubtree(
        row: number,
        nodeByRow: Map<number, NodeInterface>,
        adjacency: Map<number, Set<number>>,
        ancestors: Set<number>
    ): NodeInterface {
        if (this.isCancelled) {
            throw new Error('Analise cancelada');
        }

        const originalNode = nodeByRow.get(row)!;
        const inverted = new InvertedNode(originalNode);

        const childRows = adjacency.get(row);
        if (!childRows) return inverted;

        const newAncestors = new Set(ancestors);
        newAncestors.add(row);

        for (const childRow of childRows) {
            if (this.isCancelled) {
                throw new Error('Analise cancelada');
            }

            if (newAncestors.has(childRow)) {
                const duplicatedNode = nodeByRow.get(childRow);
                const duplicatedName = duplicatedNode ? this.getNodeLabel(duplicatedNode) : '';
                const loopLabel = duplicatedName ? `Loop (${duplicatedName})` : 'Loop';
                inverted.addChild(new LoopNode(childRow, loopLabel));
            } else {
                inverted.addChild(this.buildInvertedSubtree(childRow, nodeByRow, adjacency, newAncestors));
            }
        }

        return inverted;
    }

    /**
     * Gets a user-friendly label from a node TreeItem.
     * @param {NodeInterface} node - Node to extract label from.
     * @returns {string} Normalized node label.
     */
    private getNodeLabel(node: NodeInterface): string {
        const rawLabel = node.getTreeItem().label;

        if (typeof rawLabel === 'string') {
            return rawLabel;
        }

        if (rawLabel && typeof rawLabel === 'object' && 'label' in rawLabel) {
            return String(rawLabel.label);
        }

        return '';
    }

    /**
     * Collects all root-to-leaf paths in a single traversal.
     * LoopNodes are excluded as endpoints — their row collides with an ancestor,
     * so the path terminates at the node before the loop.
     * @param {NodeInterface} node - The current node being visited.
     * @param {NodeInterface[]} currentPath - The path built so far from root to current.
     * @param {NodeInterface[][]} allPaths - Collection of all completed paths.
     * @param {string[] | undefined} showConditionals - Configuration for showing conditional blocks.
     */
    private async collectPaths(
        node: NodeInterface,
        currentPath: NodeInterface[],
        allPaths: NodeInterface[][],
        showConditionals: string[] | undefined,
        nodeAncestors: number[]
    ): Promise<void> {
        // Check for cancellation
        if (this.isCancelled) {
            throw new Error('Analise cancelada');
        }

        // Check for node count limit
        if (this.checkNodeCountLimit()) {
            throw new Error('Limite de nodos atingido');
        }

        // Yield for event loop to allow Cancel command to be processed
        if (this.nodeCount > 0 && this.nodeCount % 50 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        const path = [...currentPath, node];

        // LoopNodes are recursion markers — terminate the path at the previous node
        if (node instanceof LoopNode) {
            if (currentPath.length > 0) {
                allPaths.push(currentPath);
            }
            return;
        }

        const childrenAncestors = [...nodeAncestors, node.getRow()];
        let children = node.getChildren(nodeAncestors);
        if (!showConditionals) {
            children = this.removeConditionalChildrens(children, childrenAncestors);
        }

        if (children.length === 0) {
            allPaths.push(path);
            return;
        }

        for (const child of children) {
            await this.collectPaths(child, path, allPaths, showConditionals, childrenAncestors);
        }
    }

    /**
     * Removes specific conditional nodes from a list of nodes when config is activated.
     * @param {NodeInterface[]} children - The list of nodes from which to remove conditional nodes.
     * @returns {NodeInterface[]} A new list of nodes containing only ParagraphNode and MethodNode instances.
     */
    private removeConditionalChildrens(children: NodeInterface[], childrenAncestors: number[]): NodeInterface[] {
        const filteredChildren: NodeInterface[] = [];
        for (const node of children) {
            // Se for condicional, não adiciona o nodo, mas segue com os filhos
            if (node instanceof ParagraphNode || node instanceof MethodNode || node instanceof CommandNode || node instanceof InvertedNode || node instanceof LoopNode) {
                filteredChildren.push(node);
                this.nodeAncestorsMap.set(node, childrenAncestors);
            } else {
                // Não adiciona o nodo condicional, mas segue com os filhos
                const nestedChildren = node.getChildren(childrenAncestors);
                const nestedAncestors = [...childrenAncestors, node.getRow()];
                const filhos = this.removeConditionalChildrens(nestedChildren, nestedAncestors);
                filteredChildren.push(...filhos);
            }
        }
        return filteredChildren;
    }
}
