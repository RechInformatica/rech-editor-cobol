"use babel";
import { configuration } from "../../helpers/configuration";

/**
 * Class to filter diagnostics
 */
class CobolDiagnosticFilter {
  private noShowWarnings: string[] | undefined;

  constructor() {
    this.noShowWarnings = configuration.get<string[]>("diagnosticfilter");
  }

  /**
   * Return if the diagnostic is valided
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
