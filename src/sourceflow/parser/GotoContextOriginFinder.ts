import ContextOriginFinderInterface from "./ContextOriginFinderInterface";

export default class GotoContextOriginFinder implements ContextOriginFinderInterface {

    identify(_line: number, _buffer: string[]): Promise<number[]> {
        return new Promise((resolve) => {
            return resolve([])
        });
    }


}