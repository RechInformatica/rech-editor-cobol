'use babel';

export class ParserCobol {

  /**
   * Returns if line is the element declaration
   *
   * @param element
   * @param line
   */
  public isDeclaration(element: string, line: string): boolean {
    if (this.isCommentOrEmptyLine(line)) {
      return false;
    }
    if (this.equalsIgnoreReplacing(element, this.getDeclaracaoParagrafo(line))) {
      return true;
    }
    if (this.equalsIgnoreReplacing(element, this.getDeclaracaoVariavel(line))) {
      return true;
    }
    if (this.equalsIgnoreReplacing(element, this.getDeclaracaoSelect(line))) {
      return true;
    }
    if (this.equalsIgnoreReplacing(element, this.getDeclaracaoClasse(line))) {
      return true;
    }
    if (this.equalsIgnoreReplacing(element, this.getCopyDeclaration(line))) {
      return true;
    }
    if (this.getMethodParametersDeclaration(line).includes(element.toLowerCase())) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the specified text is a comment line or an empty line
   *
   * @param line
   */
  public isCommentOrEmptyLine(line: string): boolean {
    const trimmed = line.trim();
    return trimmed.startsWith("*>") || trimmed === "";
  }

  /**
   * Returns the patagraph declared in the line
   *
   * @param line
   */
  public getDeclaracaoParagrafo(line: string): string | undefined {
    let match = /^ \s\s\s\s\s\s([\w-]+)\.(\s*\*>.*)?/g.exec(line);
    if (match == null) {
      match = /\s+procedure\s+division.+/gi.exec(line);
      if (match == null) {
        return undefined;
      } else {
        return "";
      }
    }
    return match[1];
  }

  /**
   * Returns the variable declared in the line
   *
   * @param line
   */
  public getDeclaracaoVariavel(line: string): string | undefined {
    // variable
    let match = /^ +\d\d\s+(?:\([^\s]+\))?([\w-]+)(\s+|\.).*/i.exec(line);
    if (match == null) {
      // $SET CONSTANT
      match = /^ +\$SET\s+CONSTANT\s+(?:\([^\s]+\))?([\w-]+)\s+.*/i.exec(line);
      if (match == null) {
        // declare
        match = /\s+declare\s+(\S+)\s+as[\s\S]+/i.exec(line);
        if (match == null) {
          return undefined;
        }
      }
    }
    return match[1];
  }

  /**
   * Returns the variable declared in the line ignoring replace
   *
   * @param line
   */
  public getDeclaracaoVariavelIgnoreReplace(line: string): string | undefined {
    // variable
    let match = /^ +\d\d\s+(?:[\w-]+)?(?:\(.*\))?([\w-]+)(\s+|\.).*/i.exec(line);
    if (match == null) {
      // $SET CONSTANT
      match = /^ +\$SET\s+CONSTANT\s+(?:\(.*\))?([\w-]+)\s+.*/i.exec(line);
      if (match == null) {
        return undefined;
      }
    }
    return match[1];
  }

  /**
   * Returns the copy declared in the line
   *
   * @param line
   */
  public getCopyDeclaration(line: string): string | undefined {
    const match = /^ +COPY\s+([A-Za-z0-9-_]+).(?:CPY|CPB).*/i.exec(line);
    if (match == null) {
      return undefined;
    }
    return match[1];
  }

  /**
   * Returns the select declared in the line
   *
   * @param line
   */
  private getDeclaracaoSelect(line: string): string | undefined {
    const match = /^ +SELECT ([\w-]+)\s+ASSIGN.*/i.exec(line);
    if (match == null) {
      return undefined;
    }
    return match[1];
  }

  /**
   * Returns the classe declared in the line
   *
   * @param line
   */
  public getDeclaracaoClasse(line: string): string | undefined {
    // IS Format
    let match = /^ +CLASS\s+([\w]+)\s+AS.*/i.exec(line);
    if (match == null) {
      // MF Format
      match = /^ +([\w]+)\s+IS\s+CLASS.*/i.exec(line);
      if (match == null) {
        return undefined;
      }
    }
    return match[1];
  }

  /**
   * Returns the method declared in the line
   *
   * @param line
   */
  public getDeclaracaoMethod(line: string): string | undefined {
    // IS Format
    const match = /^ +METHOD-ID\.\s+([\w]+)[\s,.]+.*/i.exec(line);
    if (match == null) {
      return undefined;
    }
    return match[1];
  }

  /**
   * Returns an array of method parameter and returning names declared in the line
   *
   * Example: method-id. testeVar(myVar as JInt, myVar2 as JString) returning woutVar as JString public.
   *
   * @param line
   */
  public getMethodParametersDeclaration(line: string): string[] {
    const params: string[] = [];
    // Parse method parameters
    const methodMatch = /method-id\.\s+[\w-]+\s*\(([^)]+)\)/i.exec(line);
    if (methodMatch) {
      const paramsString = methodMatch[1];
      const paramRegex = /([\w-]+)\s+as\s+[\w-]+/gi;
      let paramMatch;
      while ((paramMatch = paramRegex.exec(paramsString)) !== null) {
        params.push(paramMatch[1].toLowerCase());
      }
    }
    // Parse returning variable
    const returningMatch = /returning\s+([\w-]+)\s+as\s+[\w-]+/i.exec(line);
    if (returningMatch) {
      params.push(returningMatch[1].toLowerCase());
    }
    return params;
  }

  /**
   * Compare two terms ignoring replacing
   *
   * @param termo1
   * @param termo2
   */
  private equalsIgnoreReplacing(termo1: string, termo2?: string): boolean {
    if (termo1 == undefined || termo2 == undefined) {
      return false;
    }
    termo1 = termo1.toLocaleLowerCase();
    termo2 = termo2.toLocaleLowerCase();
    if (termo1 == termo2) {
      return true;
    }
    if (termo2.indexOf("(") >= 0) {
      const pattern = new RegExp(termo2.replace(/\(.*?\)/i, "(.*)"));
      if (pattern.test(termo1)) {
        return true;
      }
    }
    if (termo1.indexOf("(") >= 0) {
      const pattern = new RegExp(termo1.replace(/\(.*?\)/i, "(.*)"));
      if (pattern.test(termo1)) {
        return true;
      }
    }
    return false;
  }

}
