import * as vscode from 'vscode';
import Executor from '../commons/executor';

export default class FonGrep {
    public fonGrep() {
        vscode.window.showInputBox({
            value: "",
            placeHolder: "Argumento a ser pesquisado pelo FonGrep",
            prompt: "Fongrep"
        }).then((info) => {
            if (info !== undefined && info.length > 0) {
                vscode.window.setStatusBarMessage(info);
                new Executor().exec("cmd.exe /C f:\\bat\\fongrep.bat " + info)
            } else {
                vscode.window.setStatusBarMessage("Nenhum argumento informado!");
            }
        });
    }
}
