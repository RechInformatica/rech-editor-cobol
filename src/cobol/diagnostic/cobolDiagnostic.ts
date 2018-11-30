'use babel';
import { Diagnostic } from 'vscode-languageserver';

/**
 * Class conteiner of diagnostcs of cobol language
 */
export class CobolDiagnostic {

    /** Erros found in diagnostic */
    private _errors: Diagnostic[];
    /** Warnings found in diagnostic */
    private _warnings: Diagnostic[]

    /**
     * Conteiner of diagnostics of cobol language
     * 
     * @param errors 
     * @param warnings 
     */
    constructor(errors: Diagnostic[], warnings: Diagnostic[]) {
        this._errors = errors;
        this._warnings = warnings;
    }

    /**
     * Returns the errors in the diagnostic
     */
    public get errors() {
        return this._errors
    }

    /**
     * Returns the warnings in the diagnostic
     */
    public get warnings() {
        return this._warnings
    }


}