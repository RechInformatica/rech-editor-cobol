// import { Executor } from "../commons/executor";
import { Editor } from "../editor/editor";
import { Executor } from "../commons/executor";

/**
 * Class to compile Cobol programs
 */
export default class Compiler {
    /**
     * Compiles the file currently open on editor
     */
    compileCurrentFile() {
        let editor = new Editor();
        editor.saveActiveEditor();
        var baseName = editor.getCurrentFileBaseName();
        editor.showInformationMessage(`Compilando ${baseName}...`);
        var fileName = editor.getCurrentFileName();
        let args = this.buildArgs(fileName);
        let commandLine = "cmd.exe /c F:\\BAT\\CO.bat " + baseName + args;
        new Executor().runAsyncOutputChannel("co", commandLine, (errorLevel: number) => {
            if (errorLevel == 0) {
                editor.showInformationMessage(`${baseName} compilado!`);
            } else {
                editor.showWarningMessage(`${baseName} compilado com erro!`);
            }
        });
        return;
    }

    /**
     * Build the compilation arguments for the final command-line
     *
     * @param program program name
     */
    private buildArgs(program: string) {
        if (this.isTrunk(program)) {
            return " /F";
        }
        return "";
    }

    /**
     * Returns if the program is located on trunk directory
     *
     * @param program program name
     */
    private isTrunk(program: string) {
        let upper: string = program.toUpperCase();
        return (upper.startsWith("F:\\FONTES\\") || upper.startsWith("F:\\SIGER\\DES\\FON\\"));
    }
}
