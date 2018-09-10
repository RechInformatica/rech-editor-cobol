import * as child from 'child_process';

export default class Executor {
    exec(command: string) {
        child.exec(command, (err, stdout, stderr) => {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (err) {
                console.log('error: ' + err);
            }
        });
    }
}
