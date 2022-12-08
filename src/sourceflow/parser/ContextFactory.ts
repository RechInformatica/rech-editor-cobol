import FlowLine from "./FlowLine";
import ContextOriginFinderInterface from "./ContextOriginFinderInterface";
import DefaultContextOriginFinder from "./DefaultContextOriginFinder";
import ParagraphContextOriginFinder from "./ParagraphContextOriginFinder";
import GotoContextOriginFinder from "./GotoContextOriginFinder";

/**
 * Class responsible to create a ContextOriginFinder and returning the origins
 */
export default class ContextFactory {

    /**
     * Parser the line and returns the context origins
     *
     * @param line
     * @param buffer
     */
    public static parseContext(line: number, buffer: string[]): Promise<Array<FlowLine>> {
        return new Promise((resolve, reject) => {
            const result: Array<FlowLine> = new Array();
            const contextOriginFinder = this.selectContextFinder(line, buffer);
            this.identifyContextOrigin(contextOriginFinder, line, buffer).then((originsLines) => {
                originsLines.forEach((l) => {
                    result.push({
                        line: buffer[l].trim(),
                        lineNumber: l
                    });
                });
                return resolve(result);
            }).catch((e) => {
                return reject(e);
            })
        })
    }

    /**
     * Select the most appropriate ContextOriginFinder
     *
     * @param line
     * @param buffer
     */
    private static selectContextFinder(line: number, buffer: string[]): ContextOriginFinderInterface {
        const currentLine = buffer[line];
        switch(true) {
            case this.isParagraph(currentLine): return new ParagraphContextOriginFinder();
            case this.isGoto(currentLine): return new GotoContextOriginFinder();
            default: return new DefaultContextOriginFinder();
        }
    }

    /**
     * Returns true if line is a paragraph definition
     *
     * @param currentLine
     */
    private static isParagraph(currentLine: string) {
        return /^ {7}([\w\-]+)\.(?:\s*\*\>.*)?/gi.test(currentLine);
    }
    /**
     * Returns true if line is a goto
     *
     * @param currentLine
     */
    private static isGoto(currentLine: string) {
        return /\s+go to/gi.test(currentLine);
    }

    /**
     * Identify the context origins
     *
     * @param contextOriginFinder
     * @param line
     * @param buffer
     */
    private static identifyContextOrigin(contextOriginFinder: ContextOriginFinderInterface, line: number, buffer: string[]): Promise<Array<number>> {
        return contextOriginFinder.identify(line, buffer);
    }

}