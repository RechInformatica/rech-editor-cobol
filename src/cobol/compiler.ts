// import { Executor } from "../commons/executor";
import { Editor } from "../editor/editor";
import { Executor } from "../commons/executor";
import { Path } from "../commons/path";
import { commands } from "vscode";

/**
 * Class to compile Cobol programs
 */
export class Compiler {
    /**
     * Compiles the file currently open on editor
     */
    compileCurrentFile() {
        let editor = new Editor();
        editor.saveActiveEditor();
        let path = new Path(editor.getCurrentFileName());
        let baseName = path.baseName();
        let extension = path.extension();
        let directory = path.directory();
        editor.showInformationMessage(`Compilando ${path.fileName()}...`);
        commands.executeCommand('workbench.output.action.clearOutput');
        let commandLine = "cmd.exe /c F:\\BAT\\VSCodeComp.bat " + baseName + " " + extension + " " + directory;
        new Executor().runAsyncOutputChannel("co", commandLine, (errorLevel: number) => {
            if (errorLevel == 0) {
                editor.showInformationMessage(`Compilação finalizada para ${path.fileName()}.`);
            } else {
                editor.showWarningMessage(`Compilação para ${path.fileName()} finalizada com erro.`);
            }
        });
        return;
    }

}
