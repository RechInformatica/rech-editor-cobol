export class CompletionConfig {

    private static verboseSuggestion = false;

    public static getVerboseSuggestion() {
        return CompletionConfig.verboseSuggestion;
    }
    public static setVerboseSuggestion(verboseSuggestion: boolean) {
        CompletionConfig.verboseSuggestion = verboseSuggestion;
    }


}
