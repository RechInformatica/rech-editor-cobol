import ContextOriginFinderInterface from "./ContextOriginFinderInterface";

export default class DefaultContextOriginFinder implements ContextOriginFinderInterface {

    identify(line: number, buffer: string[]): Promise<number[]> {
        return new Promise((resolve, reject) => {
            for (let index = line - 1; index > 0; index--) {
                const currentLine = buffer[index];
                if (this.isConditionalLine(currentLine)) {
                    return resolve([index]);
                }
            }
            return reject();
        });
    }

    /**
     * Returns true if current line is a paragraph declaration
     *
     * @param currentLine
     */
    private isConditionalLine(currentLine: string): boolean {
        if (currentLine.match(/^ {7}([\w\-]+)\.(?:\s*\*\>.*)?/gi)) {
            return true;
        }
        return false;
    }

}