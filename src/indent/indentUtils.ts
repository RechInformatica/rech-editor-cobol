'use babel';

/**
 * Static class to do specific identation
 */
export class IndentUtils {

    /**
     * Formats a method declaration line, breaking it into multiple lines if it exceeds 120 columns.
     *
     * @param line The complete method declaration line
     * @param baseIndentation The base indentation to apply (default: 7 spaces)
     * @returns Array of formatted lines
     */
    public static formatMethodDeclarationLine(line: string, baseIndentation: string = '       '): string[] {
        const MAX_COLUMN = 120;

        // Extract the base indentation from the original line if present
        const originalIndentation = line.match(/^\s*/)?.[0] || baseIndentation;
        const trimmedLine = line.trim();

        // Parse the method declaration
        // Pattern: method-id. name(args) [returning ...] [modifiers].
        const methodMatch = /^(method-id\.\s+)([\w-]+)(\([^)]*\))?\s*(.*)\.?\s*$/.exec(trimmedLine);
        if (!methodMatch) {
            return [line]; // Return original if doesn't match pattern
        }

        const methodIdPrefix = methodMatch[1]; // "method-id. "
        const methodName = methodMatch[2]; // method name
        const argsSection = methodMatch[3] || ''; // "(arg1 as Type1, arg2 as Type2)" or empty
        const restOfDeclaration = methodMatch[4] || ''; // "returning ... static override" etc.

        // Build the initial part: "method-id. methodName"
        let currentLine = originalIndentation + methodIdPrefix + methodName;
        const lines: string[] = [];

        // Process arguments if present
        let alignmentColumn = 0;
        let firstAsPosition = -1;

        if (argsSection) {
            // Extract arguments from parentheses
            const argsContent = argsSection.substring(1, argsSection.length - 1).trim(); // Remove ( and )

            if (argsContent) {
                const args = argsContent.split(',').map(arg => arg.trim()).filter(arg => arg.length > 0);

                // Find first "as" position for alignment
                if (args.length > 0) {
                    const firstArg = args[0];
                    const firstAsMatch = /\s+(as)\s+/i.exec(firstArg);
                    if (firstAsMatch && firstAsMatch.index !== undefined) {
                        // Calculate position of "as" keyword in the full line context
                        // base indentation + "method-id. name(" + chars before "as" in first arg + 1 for space
                        firstAsPosition = originalIndentation.length + methodIdPrefix.length + methodName.length + 1 + firstAsMatch.index + 1;
                        alignmentColumn = firstAsPosition;
                    }
                }

                // Check if arguments fit in one line
                const argsOneLine = currentLine + '(' + args.join(', ') + ')';
                const closingParenPosition = argsOneLine.length;

                if (closingParenPosition <= MAX_COLUMN) {
                    // All arguments fit in one line
                    currentLine = argsOneLine;
                } else {
                    // Need to break arguments across multiple lines
                    // First argument on the same line as method-id
                    currentLine += '(' + args[0] + ',';
                    lines.push(currentLine);

                    // Remaining arguments - align their "as" keywords
                    for (let i = 1; i < args.length; i++) {
                        const arg = args[i];
                        const isLast = i === args.length - 1;

                        // Find "as" position in this argument
                        const asMatch = /^(\S+)\s+(as)\s+/i.exec(arg);
                        let argLine = '';

                        if (asMatch && firstAsPosition > 0) {
                            // Calculate indentation so this arg's "as" aligns with first arg's "as"
                            const varNameLength = asMatch[1].length;
                            const indentNeeded = firstAsPosition - varNameLength - 1; // -1 for space before varName
                            argLine = ' '.repeat(indentNeeded) + arg + (isLast ? ')' : ',');
                        } else {
                            // Fallback: use same indentation as first "as" position
                            argLine = ' '.repeat(alignmentColumn) + arg + (isLast ? ')' : ',');
                        }

                        lines.push(argLine);
                    }

                    // Start fresh line for rest of declaration
                    currentLine = '';
                }
            } else {
                // Empty parentheses
                currentLine += '()';
            }
        }

        // If alignmentColumn wasn't set (no arguments), align with first keyword after method name
        if (alignmentColumn === 0) {
            // Will be set when we encounter the first keyword (returning, static, etc.)
            alignmentColumn = originalIndentation.length + methodIdPrefix.length + methodName.length + 1;
        }

        // Process returning clause and modifiers
        if (restOfDeclaration.trim()) {
            const cleanRest = restOfDeclaration.trim().replace(/\.\s*$/, '');

            // Known simple modifiers
            const simpleModifiers = ['static', 'override', 'public', 'protected', 'private'];

            // Split into tokens
            const tokens = cleanRest.split(/\s+/);
            let i = 0;

            while (i < tokens.length) {
                const token = tokens[i].toLowerCase();

                if (token === 'returning') {
                    // Returning clause: "returning varName as Type"
                    // Capture: returning + everything until we hit a simple modifier or end
                    const returningParts = [tokens[i]]; // "returning"
                    i++;

                    // Collect tokens until we find a simple modifier or run out
                    while (i < tokens.length && !simpleModifiers.includes(tokens[i].toLowerCase())) {
                        returningParts.push(tokens[i]);
                        i++;
                    }

                    const returningClause = returningParts.join(' ');

                    // Try to add to current line
                    const testLine = (currentLine ? currentLine + ' ' : ' '.repeat(alignmentColumn)) + returningClause;

                    if (testLine.length <= MAX_COLUMN) {
                        if (currentLine) {
                            currentLine += ' ' + returningClause;
                        } else {
                            currentLine = ' '.repeat(alignmentColumn) + returningClause;
                        }
                    } else {
                        // Doesn't fit, break to new line
                        if (currentLine) {
                            lines.push(currentLine);
                        }
                        currentLine = ' '.repeat(alignmentColumn) + returningClause;
                    }
                } else {
                    // Single modifier (static, override, public, protected, etc.)
                    const modifier = tokens[i];

                    // Try to add to current line
                    const testLine = (currentLine ? currentLine + ' ' : ' '.repeat(alignmentColumn)) + modifier;

                    if (testLine.length <= MAX_COLUMN) {
                        if (currentLine) {
                            currentLine += ' ' + modifier;
                        } else {
                            currentLine = ' '.repeat(alignmentColumn) + modifier;
                        }
                    } else {
                        // Doesn't fit, break to new line
                        if (currentLine) {
                            lines.push(currentLine);
                        }
                        currentLine = ' '.repeat(alignmentColumn) + modifier;
                    }

                    i++;
                }
            }
        }

        // Add final period and push last line
        if (currentLine) {
            currentLine = currentLine.trimEnd() + '.';
            lines.push(currentLine);
        } else if (lines.length > 0) {
            // Add period to last line if currentLine is empty
            lines[lines.length - 1] = lines[lines.length - 1].trimEnd() + '.';
        }

        return lines.length > 0 ? lines : [line];
    }
}
