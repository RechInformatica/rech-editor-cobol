
export default interface ContextOriginFinderInterface {

    /**
     * Identify from where flow came according to line context and returns possible origin lines
     *
     * @param line
     * @param buffer
     */
    identify(line: number, buffer: string[]): Promise<number[]>

}