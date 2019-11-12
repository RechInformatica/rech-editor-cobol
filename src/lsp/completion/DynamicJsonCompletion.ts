import { CompletionItemKind, CompletionItem, InsertTextFormat } from "vscode-languageserver";
import { CompletionInterface } from "./CompletionInterface";
import { File } from "../../commons/file";
import { configuration } from "../../helpers/configuration";

/**
 * Snippets previously loaded from JSON file.
 * <p>
 * The first key represents the repository location like "C:\\TMP\\Snippets\\".
 * <p>
 * The key of the second map represents the name of the JSON file itself. It's value represents
 * the buffer of the JSON file.
 **/
const CACHED_REPOSITORIES: Map<string, string[]> = new Map<string, string[]>();
/* Snippets previously loaded from JSON file */
const CACHED_JSONS: Map<string, string> = new Map<string, string>();

/**
 * Class to generate LSP Completion Items for Cobol from external JSON
 * files
 */
export class DynamicJsonCompletion implements CompletionInterface {

    /** JSON repositories */
    private repositories: string[];
    /** Current source code File Name */
    private sourceFileName: string;

    constructor(repositories: string[], sourceFileName: string) {
        this.repositories = this.normalizeRepositories(repositories);
        this.sourceFileName = sourceFileName;
    }

    /**
     * Normalizes the specified repositories list adding slashes at the end if missing
     *
     * @param targetRepos target repositories
     */
    private normalizeRepositories(targetRepos: string[]) {
        for (let i = 0; i < targetRepos.length; i++) {
            if (!targetRepos[i].endsWith("\\")) {
                targetRepos[i] = targetRepos[i].concat("\\");
            }
        }
        return targetRepos;
    }

    /**
     * Generates an array of Completion Items
     *
     * @param line line number where cursor is positioned
     * @param column column number where cursor is positioned
     * @param lines document lines
     */
    public generate(line: number, _column: number, lines: string[]): Promise<CompletionItem[]> {
        return new Promise((resolve) => {
            let items: CompletionItem[] = [];
            if (this.shouldSuggestJsonCompletions(line, lines)) {
                this.repositories.forEach(currentRepo => {
                    let jsonFiles = this.retrieveJsonFilesForRepo(currentRepo);
                    jsonFiles.forEach(currentFile => {
                        items = items.concat(this.handleJsonFile(currentRepo + currentFile));
                    });
                });
            }
            resolve(items)

        });
    }

    /**
     * Returns true if JSON completions should be suggested
     *
     * @param line line number where cursor is positioned
     * @param lines document lines
     */
    private shouldSuggestJsonCompletions(line: number, lines: string[]): boolean {
        let currentLine = lines[line].trimLeft();
        if (!currentLine.includes(" ")) {
            return true;
        }
        return false;
    }

    /**
     * Retrieve a list of JSON files on the target repository from
     * file system or from cache
     *
     * @param repository repository where JSON files are located
     */
    private retrieveJsonFilesForRepo(repository: string): string[] {
        let jsonFilesForRepo = CACHED_REPOSITORIES.get(repository);
        if (jsonFilesForRepo) {
            return jsonFilesForRepo;
        }
        jsonFilesForRepo = this.loadFromDirectory(repository);
        CACHED_REPOSITORIES.set(repository, jsonFilesForRepo);
        return jsonFilesForRepo;
    }

    /**
     * Load the JSON files from file system
     *
     * @param repository respository where JSON files are located
     */
    private loadFromDirectory(repository: string): string[] {
        let jsonFilesForRepo: string[] = [];
        new File(repository).dirFiles(".json").forEach(currentFile => {
            jsonFilesForRepo.push(currentFile);
        });
        return jsonFilesForRepo;
    }

    /**
     * Handles the specified JSON file generating Completion Items if needed
     *
     * @param jsonFile target JSON file
     */
    private handleJsonFile(jsonFile: string): CompletionItem[] {
        let parsedJson = JSON.parse(this.loadJsonBuffer(jsonFile));
        if (parsedJson && this.shouldCreateItems(parsedJson.conditions)) {
            return this.createItemsFromJson(parsedJson.snippets);
        };
        return [];
    }

    /**
     * Return true if the Completion Items should be generated according to the conditions
     *
     * @param conditions target conditions
     */
    private shouldCreateItems(conditions: ConditionsStructure) {
        if (conditions && conditions.sourceFileNameRegex) {
            let result = new RegExp(conditions.sourceFileNameRegex).exec(this.sourceFileName);
            if (!result) {
                return false;
            }
        }
        return true;
    }

    /**
     * Loads the JSON buffer from the specified json file or from cache
     *
     * @param jsonFile filename of the JSON file to be read
     */
    private loadJsonBuffer(jsonFile: string): string {
        let buffer = CACHED_JSONS.get(jsonFile);
        if (buffer) {
            return buffer;
        }
        buffer = new File(jsonFile).loadBufferSync("UTF-8");
        CACHED_JSONS.set(jsonFile, buffer);
        return buffer;
    }

    /**
     * Create Completion Items from the parsed json
     *
     * @param parsedJson
     */
    private createItemsFromJson(snippets: SnippetStructure[]) {
        let items: CompletionItem[] = [];
        snippets.forEach((currentSnippet: SnippetStructure) => {
            items.push(this.createItemFromSnippet(currentSnippet));
        });
        return items;
    }

    /**
     * Creates a completion item from the specified snippet
     *
     * @param snippet
     */
    private createItemFromSnippet(snippet: SnippetStructure) {
        return {
            label: snippet.prefix,
            detail: snippet.description,
            insertText: snippet.body,
            insertTextFormat: InsertTextFormat.Snippet,
            filterText: snippet.prefix,
            preselect: false,
            kind: CompletionItemKind.Snippet
        };
    }
}

/**
 * JSON structure with conditions to insert snippets and the snippets themselves
 */
interface JsonStructure {
    conditions: ConditionsStructure;
    snippets: SnippetStructure[];
}

/**
 * Conditions do determine wheter the snippet should or should not be considered
 */
interface ConditionsStructure {
    sourceFileNameRegex: string;
}

/**
 * Snippet structure
 */
interface SnippetStructure {
    prefix: string;
    body: string;
    description: string;
}
