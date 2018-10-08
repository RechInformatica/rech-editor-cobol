/**
 * Class representing a process and it's general information
 */
export class Process {

    /** Standard output */
    private stdout: string;
    /** Error output */
    private stderr: string;
    /** Error possibly thrown during process execution */
    private err: Error | null;

    /**
     * Creates a new process
     * 
     * @param stdout 
     * @param stderr 
     */
    constructor(stdout: string, stderr: string, err: Error | null) {
        this.stdout = stdout;
        this.stderr = stderr;
        this.err = err;
    }

    /**
     * Returns the standard output
     */
    getStdout() {
        return this.stdout;
    }

    /**
     * Returns the error output
     */
    getStderr() {
        return this.stderr;
    }
    
    /**
     * Returns the error possibly thrown during process execution
     */
    getErr() {
        return this.err;
    }

}
