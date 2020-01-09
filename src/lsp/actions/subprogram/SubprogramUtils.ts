import { ActionInterface } from "../ActionInterface";
import { CodeAction, TextEdit, Range, Position } from "vscode-languageserver";
import { CompletionUtils } from "../../commons/CompletionUtils";

/** Max number of lines to be considered on the top or the bottom of buffer lines */
const MAX_SEARCH_LINES = 500;

/**
 * Class to generate Code Action to insert subprogram dependencies
 */
export class SubprogramUtils {

     /**
      * Extracts subprogram name from current line
      *
      * @param line current line number
      * @param lines buffer lines
      */
     public static extractSubprogramName(line: number, lines: string[]): string {
          const currentLineText = lines[line];
          const result = /\s+perform\s+(\w\w\w\w\w\w)-/.exec(currentLineText);
          if (result && result.length > 1) {
               return result[1];
          }
          return "";
     }

     /**
      * Generates subprogram copy declaration
      *
      * @param subprogramName subprogram name
      * @param suffix copy suffix
      */
     public static generateCopyDeclaration(subprogramName: string, suffix: string): string {
          const declarationText = "           copy                   " + subprogramName + suffix + ".cpy.\n";
          return declarationText;
     }

     /**
      * Generates the paragraph perform command
      *
      * @param name paragraph name
      */
     public static generateParagraphPerform(name: string): string {
          const command = "           perform                " + name + ".\n";
          return command;
     }

}
