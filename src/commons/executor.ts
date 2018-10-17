import * as cp from "child_process";
import { Process } from "./Process";
import * as vscode from "vscode";

/**
 * Class to run external processes
 */
export class Executor {
  /**
   * Creates OutputChannel
   *
   * @param name Name of channel
   */
  private getOutputChannel(name: string): vscode.OutputChannel {
    return vscode.window.createOutputChannel(name);
  }

  /**
   * Runs process and sends intercepted output to a channel
   * 
   * @param channel 
   * @param command 
   * @param options 
   * @param onFinish 
   */
  private runOnChannel(channel: vscode.OutputChannel, command: string, options: cp.ExecOptions,
    onFinish: (errorLevel: number) => void): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        let proc = cp.exec(command, options, (error, stdout, stderr) => {
          if (error) {
            reject({ error, stdout, stderr });
          }
          resolve({ stdout, stderr });
        });
        proc.stdout.on("data", data => channel.append(data.toString()));
        proc.stderr.on("data", data => channel.append(data.toString()));
        proc.on("exit", code => {
          channel.append(`return code ${code.valueOf()}`);
          if (onFinish) onFinish(code.valueOf());
        });
      }
    );
  }

  /**
   * Executes asynchronously a new process using the specified command-line and show output
   *
   * @param command command-line to be executed
   * @param callback optional callback executed after the process execution is completed
   */
  runAsyncOutputChannel(name: string, command: string, onFinish: (errorLevel: number) => void) {
    const channel = this.getOutputChannel(name);
    channel.clear;
    channel.show(true);
    this.runOnChannel(channel, command, { cwd: vscode.workspace.rootPath },onFinish).catch(err => {
      if (err.stderr) {
        channel.appendLine(err.stderr);
      }
      if (err.stdout) {
        channel.appendLine(err.stdout);
      }
      channel.appendLine("executeOutputChannelfailed!");
    });
  }

  /**
   * Executes asynchronously a new process using the specified command-line
   *
   * @param command command-line to be executed
   * @param callback optional callback executed after the process execution is completed
   */
  runAsync(command: string, callback?: (process: Process) => any) {
    cp.exec(command, (err, stdout, stderr) => {
      if (callback) {
        callback(new Process(stdout, stderr, err));
      }
    });
  }
}
