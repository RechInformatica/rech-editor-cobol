/*---------------------------------------------------------------------------------------------
 * CopyRight Rech Informática Ltda. Todos os direitos reservados.
 *--------------------------------------------------------------------------------------------*/

declare module 'rech-editor-vscode' {

    /**
	 * Class to manipulate vscode editor
	 */
	export default class Editor {

		/*
		 * Alguns métodos estão comentados pois utilizam entradas ou saídas do pacote vscode.
		 * Será necessário criar objetos próprios para encapsular os atributos desejados.
		 */

		/**
		 * Construtor do Editor
		 */
		constructor();
	    /**
	     * Return file path
	     */
		getPath(): string;
	    /**
	    * Return the document text
	    */
		getEditorBuffer(): string;
	    /**
	     * Return the text selected
	     */
		getSelectionBuffer(): string[];
	    /**
	     * Return range of selection
	     */
		//getSelectionRange(): Range[];
	    /**
	    * Define a editor selection
	    */
		//setSelectionRange(range: Range): void;
	    /**
	    * Define multiple editor selections
	    */
		//setSelectionRanges(range: Range[]): void;
	    /**
	    * Return the text of a range
	    */
		//getRangeBuffer(range: Range): string;
	    /**
	     * Change text of selection
	     */
		replaceSelection(buffer: string): void;
	    /**
	     * Adjust selection to select the whole line
	     */
		selectWholeLines(): void;
	    /**
	     * Return current word
	     */
		getCurrentWord(): string;
	    /**
	     * Select the current word
	     */
		selectCurrentWord(): void;
	    /**
	     * Return current line
	     */
	    getCurrentRow(): number;
	    /**
	     * Replace current line with a string
	     */
	    setCurrentLine(text: String): void;
	    /**
	    * Return length of current line
	    */
	    getCurrentLineSize(): number;
	    /**
	     * Return current line text
	     */
	    getCurrentLine(): string;
	    /**
	     * Return the text of current line
	     */
	    getLine(lineIndex: number): string;
	    /**
	     * Define the cursor position
	     */
	    setCursor(line: number, column: number): void;
	    /**
	     * Return the cursor position
	     */
	    //getCursor(): Position;
	    /**
	     * Set the cursor to a column
	     * OBS: works with multiple cursors
	     */
	    setColumn(column: number): void;
	    /**
	     * Insert text in a position
	     */
	 	//setTextPosition(Position: Position, text: string): void;
	    /**
	    * Return if this file is a bat file
	    */
	    isBat(): boolean;
	    /**
	     * Return if this file is a ruby file
	     */
	    isRuby(): boolean;
	    /**
	     * Position the cursor on column, type a text in editor and go to specified column
	     *
	     * @param text Text to insert in editor
	     * @param endcolumn Cursor position after the text insertion
	     * @param startcolumn Cursor position before the text insertion
	     */
	    type(text: string, endcolumn?: number, startcolumn?: number): void;
	    /**
	     * Calculate the position to column after a text insertion
	     */
	    gotoCol(coluna: number): number;
	    /**
	     * Insert a text in current selection
	     * OBS: works with multiple cursors
	     */
	    insertText(text: string): void;
	    /**
	     * Move down the cursor
	     */
	    moveDown(): void;
	    /**
	     * Move up the cursor
	     */
	    moveUp(): void;
	    /**
	     * Move the cursor up/down n times
	     */
	    move(num: number): void;
        /**
         * Shows open dialog for file selection
         *         
         * @param defaultDir default directory
         * @param callback callback function called for each selected file
         */
    	showOpenDialog(defaultDir: string, callback: (file: string) => any): void;
		
		/**
		 * Opens the specified file
		 * 
         * @param file file to be opened
         * @param callback callback function executed after the file is opened
         */
		openFile(file: string, callback?: () => any): void;
		 
	    /**
	     * Show a information message
	     */
	    showInformationMessage(message: string): void;
	}
	export { Editor };

}