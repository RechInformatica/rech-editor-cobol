import { Diagnostic, CodeAction } from "vscode-languageserver";
import Q from "q";
import { UselessParenthesesAction } from "./RemoveParenthesesAction";
import { CamelCaseAction } from "./ConvertToCamelCaseAction";
import { RemoveVariableAction } from "./RemoveVariableAction";
import { ActionInterface } from "./ActionInterface";
import { ReplaceZerosBySpacesAction } from "./ReplaceZerosWithSpacesAction";
import { RemoveStaticClauseAction } from "./RemoveStaticClauseAction";
import { InsertStaticClauseAction } from "./InsertStaticClauseAction";
import { ReplaceCommaByDotAction } from "./ReplaceCommaWithDotAction";
import { RemoveRemainingClauseAction } from "./RemoveRemainingClauseAction";
import { InsertSubprogramDeclarationAction } from "./subprogram/InsertSubprogramDeclarationAction";

/**
 * Factory to generate Cobol Code Actions
 */
export class CobolActionFactory {

  /** Line where the cursor is positioned */
  private line: number;
  /** Column where the cursor is positioned */
  private column: number;
  /** Document lines */
  private lines: string[];
  /** uri of source file */
  private uri: string;

  constructor(line: number, column: number, lines: string[], uri: string) {
    this.line = line;
    this.column = column;
    this.lines = lines;
    this.uri = uri;
  }

  /**
   * Generate actions for the specified diagnostics
   *
   * @param diagnostics diagnostics to generate actions
   */
  public generateActions(diagnostics: Diagnostic[]): Promise<CodeAction[]> {
    return new Promise((resolve, reject) => {
      const actionsPromises = this.generatePromisesArray(diagnostics);
      Q.all(actionsPromises).then((result) => {
        let actions: CodeAction[] = [];
        result.forEach((currentAction) => {
          actions = actions.concat(currentAction);
        });
        resolve(actions);
      }).catch(() => {
        reject();
      });
    });
  }

  /**
   * Generate Promise array of Code Actions.
   * This array will have further handling to be transformed into a single Promise.
   *
   * @param diagnostics diagnostics array to generate an array of Code Actions.
   */
  private generatePromisesArray(diagnostics: Diagnostic[]): Promise<CodeAction[]>[] {
    const implementations = this.findActionImplementations(diagnostics);
    const actionsPromises: Promise<CodeAction[]>[] = [];
    implementations.forEach((currentImpl) => {
      actionsPromises.push(this.generate(currentImpl));
    });
    return actionsPromises;
  }

  /**
   * Generates an array of Actions to be performed into source code
   *
   * @param diagnostics diagnostics to select which actions shall be performed
   */
  private findActionImplementations(diagnostics: Diagnostic[]): ActionInterface[] {
    const implementations: ActionInterface[] = [];
    diagnostics.forEach((currentDiagnostic) => {
      switch (currentDiagnostic.code) {
        case "W024": {
          implementations.push(new InsertSubprogramDeclarationAction());
          break;
        }
        case "W028": {
          implementations.push(new RemoveVariableAction());
          break;
        }
        case "W052": {
          implementations.push(new RemoveRemainingClauseAction());
          break;
        }
        case "W053": {
          implementations.push(new ReplaceCommaByDotAction());
          break;
        }
        case "W054": {
          implementations.push(new RemoveRemainingClauseAction());
          break;
        }
        case "W055": {
          implementations.push(new ReplaceCommaByDotAction());
          break;
        }
        case "W077": {
          implementations.push(new ReplaceZerosBySpacesAction());
          break;
        }
        case "W085": {
          implementations.push(new RemoveRemainingClauseAction());
          break;
        }
        case "W108": {
          implementations.push(new UselessParenthesesAction());
          break;
        }
        case "W103": {
          implementations.push(new RemoveStaticClauseAction());
          break;
        }
        case "W104": {
          implementations.push(new InsertStaticClauseAction());
          break;
        }
        case "W106": {
          implementations.push(new CamelCaseAction());
          break;
        }
      }
    });
    return implementations;
  }

  /**
   * Fires the code action generation
   *
   * @param impl implementation of ActionInterface used to generate Code Actions
   */
  private generate(impl: ActionInterface): Promise<CodeAction[]> {
    return impl.generate(this.uri, this.line, this.column, this.lines);
  }

}
