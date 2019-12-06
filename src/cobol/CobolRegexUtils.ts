/**
 * Class with utility functions for Cobol regular expressions
 */
export class CobolRegexUtils {

    /**
     * Creates a Regular Expression used to find variable usages within source code
     */
    public static createRegexForVariableUsage(variableName: string): RegExp {
        return new RegExp(`[\\s\\.\\,\\:\\)\\(](${variableName})[\\s\\t\\n\\r\\.\\,\\:\\)\\(]`, "img");
    }

}