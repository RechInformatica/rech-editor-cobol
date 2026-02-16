'use babel';

export class ParserCobol {

  /**
   * Returns if line is the element declaration
   *
   * @param element
   * @param line
   */
  public static isDeclaration(element: string, line: string): boolean {
    if (ParserCobol.isCommentOrEmptyLine(line)) {
      return false;
    }
    if (ParserCobol.equalsIgnoreReplacing(element, ParserCobol.getDeclaracaoParagrafo(line))) {
      return true;
    }
    if (ParserCobol.equalsIgnoreReplacing(element, ParserCobol.getDeclaracaoVariavel(line))) {
      return true;
    }
    if (ParserCobol.equalsIgnoreReplacing(element, ParserCobol.getDeclaracaoSelect(line))) {
      return true;
    }
    if (ParserCobol.equalsIgnoreReplacing(element, ParserCobol.getDeclaracaoClasse(line))) {
      return true;
    }
    if (ParserCobol.equalsIgnoreReplacing(element, ParserCobol.getCopyDeclaration(line))) {
      return true;
    }
    if (ParserCobol.getMethodParametersDeclaration(line).includes(element.toLowerCase())) {
      return true;
    }
    return false;
  }

  /**
   * Returns true if the specified text is a comment line or an empty line
   *
   * @param line
   */
  public static isCommentOrEmptyLine(line: string): boolean {
    const trimmed = line.trim();
    return trimmed.startsWith("*>") || trimmed === "";
  }

  /**
   * Returns the patagraph declared in the line
   *
   * @param line
   */
  public static getDeclaracaoParagrafo(line: string): string | undefined {
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
  public static getDeclaracaoVariavel(line: string): string | undefined {
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
  public static getDeclaracaoVariavelIgnoreReplace(line: string): string | undefined {
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
  public static getCopyDeclaration(line: string): string | undefined {
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
  private static getDeclaracaoSelect(line: string): string | undefined {
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
  public static getDeclaracaoClasse(line: string): string | undefined {
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
  public static getDeclaracaoMethod(line: string): string | undefined {
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
  public static getMethodParametersDeclaration(line: string): string[] {
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
   * Verifica se uma determinada linha está dentro do contexto de um header de método
   * (entre method-id. e o próximo ponto final)
   *
   * @param lines Linhas do documento
   * @param currentLine Linha atual a verificar (0-based)
   * @returns Objeto com informações sobre o contexto do método ou null se não estiver em um header
   */
  public static isInMethodHeader(lines: string[], currentLine: number, column: number): boolean {
    const context = this.getMethodHeaderInfo(lines, currentLine, column);
    return context != null;
  }

  /**
   * Verifica se uma determinada linha está dentro do contexto de um header de método
   * (entre method-id. e o próximo ponto final)
   *
   * @param lines Linhas do documento
   * @param currentLine Linha atual a verificar (0-based)
   * @returns Objeto com informações sobre o contexto do método ou null se não estiver em um header
   */
  public static getMethodHeaderInfo(lines: string[], currentLine: number, column: number): {
    startLine: number,
    endLine: number,
    headerText: string
    cursorPositionLine: number
    cursorPositionColumn: number
  } | null {
    if (currentLine < 0 || currentLine >= lines.length) {
      return null;
    }

    // Armazena o texto da linha atual e a coluna do cursor
    const currentLineText = lines[currentLine];

    // Busca para trás até encontrar method-id. ou até sair do contexto válido
    let methodIdLine = -1;
    for (let i = currentLine; i >= 0; i--) {
      const line = lines[i];

      // Se encontrou o method-id, marca a linha
      if (/method-id\./i.test(line)) {
        methodIdLine = i;
        break;
      }

      // Se encontrou fim de método, parágrafo, ou outra declaração, não está em header
      if (/end\s+method/i.test(line) ||
        /^[^\s].*\.\s*$/i.test(line) ||  // Linha começando na coluna A terminando com ponto
        /^\s{7}[\w-]+\s+section\./i.test(line) ||
        /^\s{7}[\w-]+\s+division\./i.test(line)) {
        return null;
      }
    }

    if (methodIdLine === -1) {
      return null;
    }

    // A partir do method-id, busca para frente até encontrar o ponto final
    let endLine = -1;
    const headerLines: string[] = [];

    for (let i = methodIdLine; i < lines.length; i++) {
      const line = lines[i];
      headerLines.push(line);

      // Verifica se a linha termina com ponto (fim do header)
      if (/\.\s*$/.test(line.trim())) {
        endLine = i;
        break;
      }

      // Se encontrou end method antes do ponto, algo está errado
      if (/end\s+method/i.test(line)) {
        return null;
      }
    }

    if (endLine === -1) {
      return null;
    }

    // Verifica se a linha atual está entre methodIdLine e endLine
    if (currentLine >= methodIdLine && currentLine <= endLine) {
      const headerText = headerLines.join("");

      // Calcula a posição do cursor na string concatenada
      // Procura pela linha atual (trimmed) na string final
      const indexOfCurrentLine = headerText.indexOf(currentLineText);

      let cursorPosition = 0;

      if (indexOfCurrentLine == -1) {
        cursorPosition = column;
      } else {
        cursorPosition = column + indexOfCurrentLine;
      }

      return {
        startLine: methodIdLine,
        endLine: endLine,
        headerText: headerText,
        cursorPositionLine: currentLine - methodIdLine,
        cursorPositionColumn: cursorPosition
      };
    }

    return null;
  }

  /**
   * Compare two terms ignoring replacing
   *
   * @param termo1
   * @param termo2
   */
  private static equalsIgnoreReplacing(termo1: string, termo2?: string): boolean {
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
