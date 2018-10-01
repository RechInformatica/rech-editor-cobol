import * as vscode from 'vscode';
import Executor from '../commons/executor';
import Editor from '../editor/editor';
import * as fs from 'fs';

/**
 * Classe para executar o FonGrep por dentro do VSCode
 */
export default class FonGrep {
    /**
     * Executa o FonGrep abrindo o arquivo de resultados no editor caso encontre algum
     */
    public fonGrep() {
        vscode.window.showInputBox({
            value: "",
            placeHolder: "Argumento a ser pesquisado pelo FonGrep",
            prompt: "Fongrep"
        }).then((info) => {
            if (info !== undefined && info.length > 0) {
                vscode.window.setStatusBarMessage(info);
                new Editor().showInformationMessage("Iniciando busca por '" + info + "'...");
                new Executor().exec("cmd.exe /C F:\\BAT\\FonGrep.bat /noOpenEditor /show /delEmptyResult " + info, (process) => {
                    this.handleResult(info, process.getStdout());
                });
            } else {
                vscode.window.setStatusBarMessage("Nenhum argumento informado!");
            }
        });
    }

    /**
     * Manipula o resultado do FonGrep
     * 
     * @param inputSearch busca previamente usada no FonGrep
     * @param output output do FonGrep
     */
    private handleResult(inputSearch: string, output: string) {
        var lines = output.split("\n");
        var resultFile = this.extractResultFileFromOutput(lines);
        this.openResultIfNeeded(resultFile, inputSearch);
    }

    /**
     * Extrai o nome do arquivo de resultado do FonGrep a partir do output
     * 
     * @param outputLines linhas de output do FonGrep
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
     * Abre o arquivo de resultado no editor se existente
     * 
     * @param resultFile nome do arquivo de resultado do FonGrep
     */
    private openResultIfNeeded(resultFile: string, inputSearch: string) {
        if (fs.existsSync(resultFile)) {
            new Editor().showInformationMessage("FonGrep executado com sucesso.");
            new Editor().openFile(resultFile);
        } else {
            new Editor().showInformationMessage("Nenhum resultado encontrado no FonGrep com a busca '" + inputSearch + "'.");
        }
    }
}
