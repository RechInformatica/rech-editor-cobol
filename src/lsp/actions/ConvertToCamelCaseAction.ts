import { ActionInterface } from "./ActionInterface";
import { CodeAction } from "vscode-languageserver";
import { CobolVariable } from "../completion/CobolVariable";
import { RechPosition } from "../../commons/rechposition";
import { CobolReferencesFinder } from "../references/CobolReferencesFinder";
import { RenamingUtils } from "../commons/RenamingUtils";

/**
 * Class to generate Code Action to rename a variable to Camel Case form
 */
export class CamelCaseAction implements ActionInterface {

    public generate(documentUri: string, line: number, _column: number, lines: string[]): Promise<CodeAction[]> {
        return new Promise((resolve) => {
            const variable = CobolVariable.parseLines(line, lines);
            const oldName = variable.getName();
            const newName = this.toCamelCase(oldName);
            this.callCobolReferencesFinder(oldName, lines.join("\n")).then((positions: RechPosition[]) => {
                const textEdits = RenamingUtils.createEditsFromPositions(positions, oldName, newName);
                resolve(
                    [{
                        title: "Convert to camelCase",
                        edit: { changes: { [documentUri]: textEdits } }
                    }]
                );
            }).catch();
        });
    }

    /**
     * Converts the specified variable to camelCase
     *
     * @param variable variable to be converted
     */
    private toCamelCase(variable: string): string {
        return variable.split('-').map(function (word: string, index: number) {
            if (index == 0) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }


    /**
     * Call the cobol word references finder
     *
     * @param word
     * @param documentFullText
     * @param uri
     */
    private callCobolReferencesFinder(word: string, documentFullText: string): Promise<RechPosition[]> {
        return new Promise((resolve, reject) => {
            new CobolReferencesFinder(documentFullText)
                .findReferences(word)
                .then((positions: RechPosition[]) => {
                    return resolve(positions);
                }).catch(() => {
                    reject();
                })
        });
    }


}
