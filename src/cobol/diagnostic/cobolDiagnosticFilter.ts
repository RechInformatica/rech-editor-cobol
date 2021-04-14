"use babel";

/**
 * Class to filter and configure diagnostics
 */
export class CobolDiagnosticFilter {

  /** Wheter auto diagnostic is active */
  public autoDiagnostic: "onChange" | "onSave" | boolean = false;
  /** Warnings that should not be considered in diagnostics */
  public noShowWarnings: string[] | undefined;
  /** Warnings indicating use of discontinued element */
  public deprecatedWarning: string[] | undefined;


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
   * Returns the warnings that indicating use of discontinued element
   */
  public getDeprecatedWarning(): string[] | undefined {
    return this.deprecatedWarning;
  }

  /**
   * Sets the warnings that indicating use of discontinued element
   */
  public setDeprecatedWarning(deprecatedWarning: string[] | undefined): void {
    this.deprecatedWarning = deprecatedWarning;
  }

  /**
   * Returns true if the diagnostic is a deprecated warning
   */
  public isDeprecatedWarning(message: string): boolean {
    if (!this.deprecatedWarning) {
      return false;
    }
    let result = false;
    this.deprecatedWarning.forEach(element => {
      if (message.trim().startsWith(element)) {
        result = true;
      }
    });
    return result;
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
