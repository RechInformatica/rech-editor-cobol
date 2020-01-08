import { RechPosition } from "../../commons/rechposition";
import { TextEdit, Range, Position } from "vscode-languageserver";

/**
 * Utility class for renaming Cobol elements
 */
export class RenamingUtils {

  /**
   * Creates an array of TextEdit instances, representing the changes on the source code caused by the element renaming.
   *
   * @param positions positions where the element is used within source code (including element declaration)
   * @param oldName old element name
   * @param newName new element name
   */
  public static createEditsFromPositions(positions: RechPosition[], oldName: string, newName: string): TextEdit[] {
    const textEdits: TextEdit[] = [];
    positions.forEach((currentPosition) => {
      textEdits.push({
        newText: newName,
        range: Range.create(
          Position.create(currentPosition.line, currentPosition.column),
          Position.create(currentPosition.line, currentPosition.column + oldName.length)
        )
      });
    });
    return textEdits;
  }
}
