import { Configuration } from "../helpers/configuration";
import { ExtensionContext, TextEditor, window, workspace, debug, Position, DecorationOptions, Range, ThemeColor, TextEditorDecorationType, ThemableDecorationAttachmentRenderOptions } from 'vscode';
import { CobolCopy } from '../cobol/CobolCopy';
import { Editor } from '../extension';
import { Parser } from './Parser';

/** Max lines to decorate source, preventing UI freezing */
const DECORATION_MAX_LINES = 50000;

/** Decorator do show documentations of cobol elements.
 *  The elements can be like copy files for example
 * */
export class DocumentationDecorator {

    private static parser: Parser = new Parser();
    private static copyDocumentationDecorationType: TextEditorDecorationType | undefined;

    public static activate(context: ExtensionContext) {
        let activeEditor: TextEditor | undefined;

        // Called to handle events below
        const updateDecorations = function () {
            if (activeEditor && activeEditor.document.lineCount > DECORATION_MAX_LINES) {
                return;
            }
            // If active window is open and language is supported
            if (activeEditor && activeEditor.document.languageId == "COBOL") {
                const activeDocumentationDecorator = new Configuration("rech.editor.cobol").get<boolean>("specialAutoDocumentation");
                if (!activeDocumentationDecorator) {
                    return;
                }
                DocumentationDecorator.parser.findCopys(activeEditor).then((copys) => {
                    DocumentationDecorator.applyDecorations(activeEditor!, copys);
                }).catch();
            }
        };

        // Get the active editor for the first time and initialize the regex
        if (window.activeTextEditor) {
            activeEditor = window.activeTextEditor;
            // Trigger first update of decorators
            triggerUpdateDecorations();
        }
        // Handle called when active editor was changed
        window.onDidChangeActiveTextEditor(editor => {
            activeEditor = editor;
            if (editor) {
                // Trigger update to set decorations for newly active file
                triggerUpdateDecorations();
            }
        }, null, context.subscriptions);

        // Handle called when change text content of active editor
        workspace.onDidChangeTextDocument(event => {
            // Trigger updates if the text was changed in the same document
            if (activeEditor && event.document === activeEditor.document) {
                triggerUpdateDecorations();
            }
        }, null, context.subscriptions);

        // This timer waits 50ms before updating decorations, avoiding calling update too often
        var timeout: NodeJS.Timer;
        function triggerUpdateDecorations() {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(updateDecorations, 600);
        }
    }

    /**
     * Applay decorations on copys
     *
     * @param activeEditor
     * @param copys
     */
    private static applyDecorations(activeEditor: TextEditor, copys: CobolCopy[]) {
        const colors = new Configuration("rech.editor.cobol").get<any>("especialColors");
        const color = { dark: {color: colors.rechAutoDocumentation, backgroundColor: "transparent"},
                       light: {color: DocumentationDecorator.parser.invertHex(colors.rechAutoDocumentation), backgroundColor: "transparent"} };
        const lines = activeEditor.document.getText().split("\n");
        if (this.copyDocumentationDecorationType) {
            this.copyDocumentationDecorationType.dispose();
        }
        this.copyDocumentationDecorationType = window.createTextEditorDecorationType({
            fontStyle: "normal",
            fontWeight: "normal",
            textDecoration: "none",
          });
        const copyDecorations: DecorationOptions[] = [];
        copys.forEach((copy) => {
            let header = copy.getHeader() ? copy.getHeader()!.join(" ") : "";
            let comment = copy.getComment() ? copy.getComment()!.join(" ") : "";
            if (header && header != "" && header.toUpperCase() != comment.toUpperCase()) {
                const startPos = new Position(copy.getLineDeclaration(), 0);
                const endPos = new Position(copy.getLineDeclaration(), lines[copy.getLineDeclaration()].trimRight().length);
                const contentText = ' *> ' + header;
                const textDecoration = ";font-size:smaller;color:";
                const decoration: DecorationOptions = {
                    range: new Range(startPos, endPos),
                    renderOptions: {
                        dark: {
                            after: {
                                contentText: contentText,
                                textDecoration: textDecoration + color.dark.color
                            }
                        },
                        light: {
                            after: {
                                contentText: contentText,
                                textDecoration: textDecoration + color.light.color
                            }
                        }
                    }
                };
                copyDecorations.push(decoration);
            }
        });
        activeEditor.setDecorations(this.copyDocumentationDecorationType, copyDecorations);
    }

}
