import * as cp from "child_process";
import { Process } from "./Process";
import * as vscode from "vscode";
import * as stream from "stream";
import * as iconv_lite from 'iconv-lite';

// Map of created channels by name
let channels = new Map<string, vscode.OutputChannel>();

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
    // Try to get existing channel
    let channel = channels.get(name);
    if (!channel) {
      channel = vscode.window.createOutputChannel(name);
      channels.set(name, channel);
    }
    return channel;
  }

  /**
   * Append output stream process buffer to outputChannell, converting chartset to Windows-1252
   *
   * @param stream StreamReader child process object
   * @param channel OutputChannel vscode object
   */
  private streamToChannel(stream: stream.Readable, channel: vscode.OutputChannel) {
    stream.setEncoding("binary");
    stream.on("data", data => channel.append(iconv_lite.decode(<Buffer> data, "WINDOWS-1252")));
  }

  /**
   * Runs process and sends intercepted output to a channel
   *
   * @param channel OutputChannel vscode object
   * @param command System operational command to be executed
   * @param options Child process options
   * @param onFinish OnFinish callback
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
        this.streamToChannel(proc.stdout, channel);
        this.streamToChannel(proc.stderr, channel);
        proc.on("exit", code => {
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
      channel.appendLine("executeOutputChannelfailed!\n" + err);
    });
  }

  /**
   * Executes asynchronously a new process using the specified command-line
   *
   * @param command command-line to be executed
   * @param callback optional callback executed after the process execution is completed
   */
  runAsync(command: string, callback?: (process: Process) => any, encoding?: string) {
    if (encoding) {
      this.runAsyncAndReturnFormattedProcess(command, encoding, callback);
    } else {
      cp.exec(command, (err, stdout, stderr) => {
        if (callback) {
          callback(new Process(stdout, stderr, err));
        }
      });
    }
  }

  /**
   * Executes asynchronously a new process using the specified command-line and return the Process result formatted as encoding
   *
   * @param command
   * @param encoding
   * @param callback
   */
  private runAsyncAndReturnFormattedProcess(command: string, encoding: string, callback?: (process: Process) => any) {
    cp.exec(command, {encoding: "buffer"}, (err, stdout, stderr) => {
      if (callback) {
        callback(new Process(iconv_lite.decode(stdout, encoding), iconv_lite.decode(stderr, encoding), err));
      }
    });
  }

  /**
   * Executes asynchronously a new process using the specified command-line
   *
   * @param command command-line to be executed
   * @param callback optional callback executed after the process execution is completed
   */
  runSync(command: string) {
    let exec = cp.execSync(command);
    return exec.toString();
  }

}
