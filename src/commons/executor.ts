import * as child from 'child_process';
import { Process } from './Process';

/**
 * Class to run external processes
 */
export class Executor {

    /**
     * Executes asynchronously a new process using the specified command-line
     * 
     * @param command command-line to be executed
     * @param callback optional callback executed after the process execution is completed
     */
    runAsync(command: string, callback?: (process: Process) => any) {
        child.exec(command, (err, stdout, stderr) => {
            if (callback) {
                callback(new Process(stdout, stderr, err));
            }
        });
    }
}