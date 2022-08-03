/**
 * Class to invert COBOL 'move' operators
 */
export class MoveInverter {

    /**
     * Applies Regex to find and replace all COBOL MOVE commands in current selection. There are 6 elements between () used to replace
     *    1º - Spaces starting line. These keep the current indent level
     *    2º - 1st MOVE's variable
     *    3º - Optional indexes of 1st variable. E.g.: (w-idv, w-iit)
     *    4º - 2st MOVE's variable
     *    5º - Optional indexes of 2st variable. E.g.: (w-idv, w-iit)
     *    6º - Other elements endind line (dot/comma, inline comments and line break character)
     *
     * @param buffer buffer with move commands to be inverted
     */
    public invertOperators(buffer: string): string {
        const regex = /^( +)move\s+([\w\-]+)([\(\w\-\)\, ]*)\s+to\s+([\w\-]+)(\(\w+\-\w+\,\s+\w+\-\w+\)|\(\w+\-\w+\))*(.*$)/gmi;
        const replacedBuffer = buffer.replace(regex, "$1move $4$5 to $2$3$6");
        return replacedBuffer;
    }

};
