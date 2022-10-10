import { VariableCompletion } from "./VariableCompletion";

/**
 * Factory to create VariableCompletion instances
 */
export class VariableCompletionFactory {

    /** Uri of source file */
    private uri: string;
    /** Source of completions */
    private sourceOfCompletions: () => Thenable<string>;

    constructor(uri: string, sourceOfCompletions: () => Thenable<string>) {
        this.uri = uri;
        this.sourceOfCompletions = sourceOfCompletions;
    }

    /**
     * Creates a new instance of VariableCompletion
     */
    public create(): VariableCompletion {
        return new VariableCompletion(this.uri, this.sourceOfCompletions);
    }
}
