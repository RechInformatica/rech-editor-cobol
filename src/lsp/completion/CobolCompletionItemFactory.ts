import {
    CompletionItem,
    TextDocument
} from "vscode-languageserver";
import { ParserCobol } from '../../cobol/parsercobol';
import { ParagraphCompletion } from './ParagraphCompletion';
import { VarDeclarationCompletion } from "./VarDeclarationCompletion";
import { PerformCompletion } from "./PerformCompletion";
import { MoveCompletion } from "./MoveCompletion";
import { ToCompletion } from "./ToCompletion";
import { CompletionInterface } from "./CompletionInterface";
import { EvaluateCompletion } from "./EvaluateCompletion";
import { PerformUntilCompletion } from "./PerformUntilCompletion";
import { SetCompletion } from "./SetCompletion";
import { PerformTestBeforeCompletion } from "./PerformTestBeforeCompletion";
import { AddCompletion } from "./AddCompletion";
import { SubtractCompletion } from "./SubtractCompletion";
import { FromCompletion } from "./FromCompletion";

/**
 * Class to generate LSP Completion Items for Cobol language
 */
export class CobolCompletionItemFactory {

    /** Line where the cursor is positioned */
    private line: number;
    /** Column where the cursor is positioned */
    private column: number;
    /** Document lines */
    private lines: string[];
    /** Text of the current line */
    private lineText: string;

    /**
     * Creates an instance to generate LSP Completion Items for Cobol language
     *
     * @param line line where the cursor is positioned
     * @param column column where the cursor is positioned
     * @param fullDocument full document information
     */
    constructor(line: number, column: number, fullDocument: TextDocument) {
        this.line = line;
        this.column = column;
        this.lines = fullDocument.getText().split("\n");
        this.lineText = this.lines[line];
    }

    /**
     * Generates completion items for Cobol paragraphs
     *
     * @param lines Cobol source code lines
     */
    public generateCompletionItems(): CompletionItem[] {
        switch (true) {
            case this.isCommentLine(): {
                return []
            }
            case this.isVarDeclaration(): {
                return this.generate(new VarDeclarationCompletion());
            }
            case this.isMove() || this.isAdd() || this.isSet() : {
                return this.generate(new ToCompletion());
            }
            case this.isSubtract(): {
                return this.generate(new FromCompletion());
            }
            case this.isParagraphPerform(): {
                return this.generate(new ParagraphCompletion());
            }
            default: {
                return this.createDefaultCompletions();
            }
        }
    }

    /**
     * Returns true if the cursor is on a comment line
     */
    private isCommentLine() {
        return this.lineText.trim().startsWith("*>");
    }

    /**
     * Returns true if the editor should suggest Cobol variable declaration
     */
    private isVarDeclaration(): boolean {
        if (new ParserCobol().getDeclaracaoVariavel(this.lineText)) {
            return this.isVariableLevelAndNameDeclared();
        }
        return false;
    }

    /**
     * Returns true if the level and the name of the Cobol variable are declared.
     *
     * This regular expression checks if the variable is ready to receive the 'PIC'
     * and 'VALUE IS' clauses.
     *
     * @param line target line to test variable declaration
     */
    private isVariableLevelAndNameDeclared() {
        let result = /(\d+\w.+\s)([^\s].*)/.exec(this.lineText);
        if (result && result[2]) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the current line represents a 'move'
     */
    private isMove(): boolean {
        if (/\s+(MOVE|move).*/.exec(this.lineText)) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the current line represents a 'add'
     */
    private isAdd(): boolean {
        if (/\s+(ADD|add).*/.exec(this.lineText)) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the current line represents a 'set'
     */
    private isSet(): boolean {
        if (/\s+(SET|set).*/.exec(this.lineText)) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the current line represents a 'subtract'
     */
    private isSubtract(): boolean {
        if (/\s+(SUBTRACT|subtract).*/.exec(this.lineText)) {
            return true;
        }
        return false;
    }

    /**
     * Returns true if the current line represents a paragraph perform
     */
    private isParagraphPerform(): boolean {
        if (/\s+(PERFORM|perform).*/.exec(this.lineText)) {
            return true;
        }
        return false;
    }

    /**
     * Fills the completion items with default Cobol commands
     */
    private createDefaultCompletions() {
        let items: CompletionItem[] = [];
        items = items.concat(this.generate(new PerformCompletion()));
        items = items.concat(this.generate(new MoveCompletion()));
        items = items.concat(this.generate(new SetCompletion()));
        items = items.concat(this.generate(new AddCompletion()));
        items = items.concat(this.generate(new SubtractCompletion()));
        items = items.concat(this.generate(new EvaluateCompletion()));
        items = items.concat(this.generate(new PerformUntilCompletion()));
        items = items.concat(this.generate(new PerformTestBeforeCompletion()));
        return items;
    }

   /**
     * Generates completion items with the specified implementation
     *
     * @param completion implementation used to generate completion items
     */
    private generate(completion: CompletionInterface): CompletionItem[] {
        return completion.generate(this.line, this.column, this.lines);
    }

}