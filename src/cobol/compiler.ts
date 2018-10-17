import { Executor } from "../commons/executor";
import { Editor } from "../editor/editor";

/**
 * Class to compile Cobol programs
 */
export default class Compiler {
    /**
     * Compiles the file currently open on editor
     */
    compileCurrentFile() {
        var baseName = new Editor().getCurrentFileBaseName();
        new Editor().showInformationMessage(`Compilando ${baseName}...`);
        var fileName = new Editor().getCurrentFileName();
        let args = this.buildArgs(fileName);
        let commandLine = "cmd.exe /c F:\\BAT\\CO.bat " + baseName + args;
        new Executor().runAsyncOutputChannel("co", commandLine, (errorLevel: number) => {
            if (errorLevel == 0) {
            new Editor().showInformationMessage(`${baseName} compilado!`);
            } else {
            new Editor().showWarningMessage(`${baseName} compilado com erro!`);
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
