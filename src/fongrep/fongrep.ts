import Executor from '../commons/executor';
import Editor from '../editor/editor';
import * as fs from 'fs';

/**
 * Class to execute FonGrep from within VSCode
 */
export default class FonGrep {

    /**
     * Executes FonGrep opening the result file on the editor
     */
    public fonGrep() {
        new Editor().showInputBox("Argumento a ser pesquisado pelo FonGrep", "FonGrep", (info) => {
            this.runFonGrep(info);
        });
    }

    /**
     * Executes the FonGrep command itself and handles the result file
     */
    runFonGrep(info: string | undefined) {
        if (info !== undefined && info.length > 0) {
            new Editor().showInformationMessage("Iniciando busca por '" + info + "'...");
            new Executor().runAsync("cmd.exe /C F:\\BAT\\FonGrep.bat /noOpenEditor /show /delEmptyResult " + info, (process) => {
                this.handleResult(info, process.getStdout());
            });
        } else {
            new Editor().showWarningMessage("Nenhum argumento informado para o FonGrep!");
        }
    }

    /**
     * Handles the result file
     * 
     * @param inputSearch Input search previously used as a FonGrep parameter
     * @param output FonGrep output
     */
    private handleResult(inputSearch: string, output: string) {
        var lines = output.split("\n");
        var resultFile = this.extractResultFileFromOutput(lines);
        this.openResultIfNeeded(resultFile, inputSearch);
    }

    /**
     * Extracts FonGrep's result filename from the console output
     * 
     * @param outputLines FonGrep output lines
     */
    private extractResultFileFromOutput(outputLines: string[]) {
        var ouputFile: string = "";
        outputLines.forEach((element) => {
            var values = element.split("=");
            if (values) {
                if (values.length >= 2) {
                    if (values[0] === "FGR_ARQRES") {
                        ouputFile = values[1].trim();
                    }
                }
            }
        });
        return ouputFile;
    }

    /**
     * Opens the result file if any result is found
     * 
     * @param resultFile FonGrep result filename
     * @param inputSearch Input search previously used as a FonGrep parameter
     */
    private openResultIfNeeded(resultFile: string, inputSearch: string) {
        if (fs.existsSync(resultFile)) {
            new Editor().showInformationMessage("FonGrep executado com sucesso.");
            new Editor().openFile(resultFile);
        } else {
            new Editor().showWarningMessage("Nenhum resultado encontrado no FonGrep com a busca '" + inputSearch + "'.");
        }
    }
}
