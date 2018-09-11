import * as path from 'path';
import * as vscode from 'vscode';

let taskProvider: vscode.Disposable | undefined;

export function activate(_context: vscode.ExtensionContext): void {
    let coPromise: Thenable<vscode.Task[]> | undefined = undefined;
    taskProvider = vscode.tasks.registerTaskProvider('co', {
        provideTasks: () => {
            if (!coPromise) {
                coPromise = getCoTasks();
            }
            return coPromise;
        },
        resolveTask(_task: vscode.Task): vscode.Task | undefined {
            return undefined;
        }
    });
}

export function deactivate(): void {
    if (taskProvider) {
        taskProvider.dispose();
    }
}

async function getCoTasks(): Promise<vscode.Task[]> {
    let workspaceRoot = vscode.workspace.rootPath;
    let result: vscode.Task[] = [];
    if (!workspaceRoot) {
        return result;
    }
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        return result;
    }
    const baseName = path.basename(activeEditor.document.fileName);
    let task = new vscode.Task({ type: 'shell', task: 'compile' }, "compile", 'co', new vscode.ShellExecution(`co.bat ${baseName}`));
    result.push(task);
    return result;
}
