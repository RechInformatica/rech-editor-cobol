import { TreeDataProvider, EventEmitter, TreeItem, TreeItemCollapsibleState, commands, workspace, TreeView } from "vscode";
import { Event } from "vscode-jsonrpc";
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

    private _onDidChangeTreeData: EventEmitter<NodeInterface | undefined> = new EventEmitter<NodeInterface | undefined>();
    public onDidChangeTreeData: Event<NodeInterface | undefined> = this._onDidChangeTreeData.event;
    private isAscending: boolean = true;
    private invertedTreeCache: NodeInterface[] | null = null;
    private lastOriginalNode: NodeInterface | null = null;
    private _expandAll: boolean = false;
    private _treeView: TreeView<NodeInterface> | null = null;
    private parentMap: Map<NodeInterface, NodeInterface | undefined> = new Map();

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

        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.toggleFlowOrder', () => {
            this.toggleSortOrder();
        }));

        context.subscriptions.push(commands.registerCommand('rech.editor.cobol.toggleExpandCollapseFlow', () => {
            this.toggleExpandCollapse();
        }));
    }

    /**
     * Returns a TreeItem representation of the given element.
     * When expand-all mode is active, forces collapsible nodes to be expanded.
     * @param {NodeInterface} element - The node element.
     * @returns {TreeItem | Thenable<TreeItem>} The TreeItem for the given element.
     */
    getTreeItem(element: NodeInterface): TreeItem | Thenable<TreeItem> {
        const item = element.getTreeItem();
        if (this._expandAll && item.collapsibleState === TreeItemCollapsibleState.Collapsed) {
            item.collapsibleState = TreeItemCollapsibleState.Expanded;
        }
        return item;
    }

    /**
     * Returns the child nodes of the given element.
     * If no element is provided, returns the root nodes.
     * @param {NodeInterface | undefined} element - The parent node.
     * @returns {Thenable<NodeInterface[]>} A promise that resolves to an array of child nodes.
     */
    getChildren(element?: NodeInterface | undefined): Thenable<NodeInterface[]> {
        return new Promise((resolve, _reject) => {
            let childrens = [];
            if (element) {
                childrens = element.getChildren();
                const showConditionalBlockCobolFlow = <string[]>workspace.getConfiguration("rech.editor.cobol").get("showConditionalBlockCobolFlow");
                if (!showConditionalBlockCobolFlow) {
                    childrens = this.removeConditionalChildrens(childrens);
                }

                // Track parent-child relationships
                for (const child of childrens) {
                    this.parentMap.set(child, element);
                }
            } else {
                const editor = new Editor();
                const currentLineNumber = editor.getCurrentRow();
                const sourceCode = editor.getEditorBuffer().replace(/\r/g, "").split('\n');

                const cobolAnalyzer = CobolFlowAnalyzer.getInstance();
                cobolAnalyzer.setBuffer(sourceCode);

                const node = cobolAnalyzer.getNodeFromLine(currentLineNumber);

                if (this.isAscending) {
                    childrens.push(node);
                    // Clear inverted cache when in ascending mode
                    this.invertedTreeCache = null;
                    this.lastOriginalNode = null;
                } else {
                    console.log(`[FlowProvider] Descending mode - checking cache for node at line ${node.getRow() + 1}`);

                    // Check if we need to rebuild the inverted tree
                    const needsRebuild = !this.invertedTreeCache ||
                                        this.lastOriginalNode?.getRow() !== node.getRow();

                    if (needsRebuild) {
                        console.log(`[FlowProvider] Cache miss or node changed - rebuilding inverted tree`);
                        // Build inverted tree only when needed
                        this.invertedTreeCache = this.buildInvertedTree(node);
                        this.lastOriginalNode = node;
                    } else {
                        const cacheSize = this.invertedTreeCache?.length || 0;
                        console.log(`[FlowProvider] Using cached inverted tree with ${cacheSize} root(s)`);
                    }

                    childrens = this.invertedTreeCache || [];
                }

                // Root nodes have no parent
                for (const child of childrens) {
                    this.parentMap.set(child, undefined);
                }
            }
            resolve(childrens);
        });
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
        console.log(`[FlowProvider] Refresh called - clearing cache`);
        // Clear cache on refresh to rebuild the tree
        this.invertedTreeCache = null;
        this.lastOriginalNode = null;
        this.parentMap.clear();
        this._onDidChangeTreeData.fire(undefined);
    }

    /**
     * Toggles the sort order between ascending and descending.
     */
    public toggleSortOrder(): void {
        const newMode = this.isAscending ? 'descending' : 'ascending';
        console.log(`[FlowProvider] Toggle sort order - switching to ${newMode} mode`);
        this.isAscending = !this.isAscending;
        this.refresh();
    }

    /**
     * Sets the tree view reference for programmatic expansion/collapse.
     * @param {TreeView<NodeInterface>} treeView - The tree view instance.
     */
    public setTreeView(treeView: TreeView<NodeInterface>): void {
        this._treeView = treeView;
    }

    /**
     * Toggles between expanding all and collapsing all nodes.
     * When expanding, enables expand mode and recursively expands all existing nodes.
     * This ensures that both existing and new items in the tree are properly expanded.
     */
    public toggleExpandCollapse(): void {
        console.log(`[FlowProvider] toggleExpandCollapse called. Current _expandAll: ${this._expandAll}`);

        if (this._expandAll) {
            // Currently expanded, so collapse all
            console.log('[FlowProvider] Collapsing all nodes');
            this._expandAll = false;
            commands.executeCommand('workbench.actions.treeView.cobolflowview.collapseAll');
        } else {
            // Currently collapsed, so expand all
            console.log('[FlowProvider] Expanding all nodes - setting _expandAll to true');
            this._expandAll = true;
            this._onDidChangeTreeData.fire(undefined);

            // After refresh, recursively expand all existing nodes
            if (this._treeView) {
                console.log('[FlowProvider] TreeView available, scheduling recursive expansion in 100ms');
                setTimeout(() => {
                    this.expandAllNodesRecursively();
                }, 100); // Small delay to let the refresh complete
            } else {
                console.warn('[FlowProvider] TreeView is null, cannot expand recursively');
            }
        }
    }

    /**
     * Recursively expands all nodes in the tree view.
     * Gets root nodes and expands them and all their descendants.
     */
    private async expandAllNodesRecursively(): Promise<void> {
        console.log('[FlowProvider] expandAllNodesRecursively started');

        if (!this._treeView) {
            console.warn('[FlowProvider] TreeView is null in expandAllNodesRecursively');
            return;
        }

        try {
            // Get root nodes
            console.log('[FlowProvider] Getting root nodes...');
            const rootNodes = await this.getChildren();
            console.log(`[FlowProvider] Found ${rootNodes.length} root node(s)`);

            // Recursively expand each root node and its children
            for (let i = 0; i < rootNodes.length; i++) {
                const node = rootNodes[i];
                console.log(`[FlowProvider] Expanding root node ${i + 1}/${rootNodes.length} at line ${node.getRow() + 1}`);
                await this.expandNodeAndChildren(node, 0);
            }

            console.log('[FlowProvider] expandAllNodesRecursively completed');
        } catch (error) {
            console.error('[FlowProvider] Error expanding nodes:', error);
        }
    }

    /**
     * Recursively expands a node and all its children.
     * @param {NodeInterface} node - The node to expand.
     * @param {number} depth - Current depth in the tree (for logging).
     */
    private async expandNodeAndChildren(node: NodeInterface, depth: number): Promise<void> {
        if (!this._treeView) {
            console.warn('[FlowProvider] TreeView is null in expandNodeAndChildren');
            return;
        }

        const indent = '  '.repeat(depth);

        try {
            const treeItem = node.getTreeItem();
            const nodeName = treeItem.label?.toString() || 'unknown';
            const collapsibleState = treeItem.collapsibleState;

            console.log(`${indent}[FlowProvider] Node: ${nodeName}, collapsibleState: ${collapsibleState}`);

            // Only expand if the node is collapsible
            if (collapsibleState !== TreeItemCollapsibleState.None) {
                console.log(`${indent}[FlowProvider] Revealing and expanding node: ${nodeName}`);

                // Reveal with expand to force expansion
                await this._treeView.reveal(node, { expand: true, select: false, focus: false });

                console.log(`${indent}[FlowProvider] Node revealed, getting children...`);

                // Get children and recursively expand them
                const children = await this.getChildren(node);
                console.log(`${indent}[FlowProvider] Found ${children.length} children for ${nodeName}`);

                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    console.log(`${indent}[FlowProvider] Processing child ${i + 1}/${children.length}`);
                    await this.expandNodeAndChildren(child, depth + 1);
                }
            } else {
                console.log(`${indent}[FlowProvider] Node ${nodeName} is not collapsible (state: None)`);
            }
        } catch (error) {
            // Ignore errors from reveal (e.g., if node is not visible)
            console.warn(`${indent}[FlowProvider] Could not expand node:`, error);
        }
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
    private buildInvertedTree(root: NodeInterface): NodeInterface[] {
        console.log(`[FlowProvider] Starting buildInvertedTree for root at line ${root.getRow() + 1}`);
        const startTime = Date.now();

        const showConditionalBlockCobolFlow = <string[]>workspace.getConfiguration("rech.editor.cobol").get("showConditionalBlockCobolFlow");
        console.log(`[FlowProvider] Show conditionals: ${!!showConditionalBlockCobolFlow}`);

        // Step 1: Single traversal — collect all root-to-leaf paths
        const allPaths: NodeInterface[][] = [];
        this.collectPaths(root, [], allPaths, showConditionalBlockCobolFlow);
        console.log(`[FlowProvider] Collected ${allPaths.length} path(s)`);

        // Step 2: Build inverted adjacency list and node reference map
        const nodeByRow = new Map<number, NodeInterface>();
        const invertedAdj = new Map<number, Set<number>>();

        for (const path of allPaths) {
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

        for (const path of allPaths) {
            const leafRow = path[path.length - 1].getRow();
            if (!addedRootRows.has(leafRow)) {
                addedRootRows.add(leafRow);
                invertedRoots.push(this.buildInvertedSubtree(leafRow, nodeByRow, invertedAdj, new Set()));
            }
        }

        const endTime = Date.now();
        console.log(`[FlowProvider] Returning ${invertedRoots.length} inverted root(s) at lines: ${invertedRoots.map(r => r.getRow() + 1).join(', ')}`);
        console.log(`[FlowProvider] buildInvertedTree completed in ${endTime - startTime}ms`);

        return invertedRoots;
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
        const originalNode = nodeByRow.get(row)!;
        const inverted = new InvertedNode(originalNode);

        const childRows = adjacency.get(row);
        if (!childRows) return inverted;

        const newAncestors = new Set(ancestors);
        newAncestors.add(row);

        for (const childRow of childRows) {
            if (newAncestors.has(childRow)) {
                inverted.addChild(new LoopNode(childRow, 'Loop'));
            } else {
                inverted.addChild(this.buildInvertedSubtree(childRow, nodeByRow, adjacency, newAncestors));
            }
        }

        return inverted;
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
    private collectPaths(node: NodeInterface, currentPath: NodeInterface[], allPaths: NodeInterface[][], showConditionals: string[] | undefined): void {
        const path = [...currentPath, node];

        // LoopNodes are recursion markers — terminate the path at the previous node
        if (node instanceof LoopNode) {
            if (currentPath.length > 0) {
                allPaths.push(currentPath);
            }
            return;
        }

        let children = node.getChildren();
        if (!showConditionals) {
            children = this.removeConditionalChildrens(children);
        }

        if (children.length === 0) {
            allPaths.push(path);
            return;
        }

        for (const child of children) {
            this.collectPaths(child, path, allPaths, showConditionals);
        }
    }

    /**
     * Removes specific conditional nodes from a list of nodes when config is activated.
     * @param {NodeInterface[]} children - The list of nodes from which to remove conditional nodes.
     * @returns {NodeInterface[]} A new list of nodes containing only ParagraphNode and MethodNode instances.
     */
    private removeConditionalChildrens(children: NodeInterface[]): NodeInterface[] {
        const filteredChildren: NodeInterface[] = [];
        for (const node of children) {
            // Se for condicional, não adiciona o nodo, mas segue com os filhos
            if (node instanceof ParagraphNode || node instanceof MethodNode || node instanceof CommandNode || node instanceof InvertedNode || node instanceof LoopNode) {
                filteredChildren.push(node);
            } else {
                // Não adiciona o nodo condicional, mas segue com os filhos
                const filhos = this.removeConditionalChildrens(node.getChildren());
                filteredChildren.push(...filhos);
            }
        }
        return filteredChildren;
    }
}
