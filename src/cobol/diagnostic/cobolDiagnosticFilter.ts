"use babel";

/**
 * Class to filter and configure diagnostics
 */
export class CobolDiagnosticFilter {

  /** Wheter auto diagnostic is active */
  public autoDiagnostic: "onChange" | "onSave" | boolean = false;
  /** Warnings that should not be considered in diagnostics */
  public noShowWarnings: string[] | undefined;


  /**
   * Returns wheter auto diagnostic is active
   */
  public getAutoDiagnostic(): "onChange" | "onSave" | boolean {
    return this.autoDiagnostic;
  }

  /**
   * Sets wheter auto diagnostic is active
   */
  public setAutoDiagnostic(autoDiagnostic: "onChange" | "onSave" | boolean): void {
    this.autoDiagnostic = autoDiagnostic;
  }

  /**
   * Sets the warnings that should not be considered in diagnostics
   */
  public getNoShowWarnings(): string[] | undefined {
    return this.noShowWarnings;
  }

  /**
   * Sets the warnings that should not be considered in diagnostics
   */
  public setNoShowWarnings(noShowWarnings: string[] | undefined): void {
    this.noShowWarnings = noShowWarnings;
  }

  /**
   * Returns true if the diagnostic is valid
   */
  public isDiagnosticValid(message: string): boolean {
    if (!this.noShowWarnings) {
      return true;
    }
    let result = true;
    this.noShowWarnings.forEach(element => {
      if (message.trim().startsWith(element)) {
        result = false;
      }
    });
    return result;
  }
}

export const cobolDiagnosticFilter = new CobolDiagnosticFilter();
