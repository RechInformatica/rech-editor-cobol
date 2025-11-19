import * as cp from "child_process";
import { Process } from "./Process";
import * as vscode from "vscode";
import * as stream from "stream";
import * as iconv_lite from 'iconv-lite';

// Map of created channels by name
const channels = new Map<string, vscode.OutputChannel>();
const terminals = new Map<string, vscode.Terminal>();

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
   * Creates Terminal
   *
   * @param name Name of terminal
   */
  private getTerminal(name: string): vscode.Terminal {
    // Try to get existing terminal
    let terminal = terminals.get(name);
    if (!terminal) {
      terminal = vscode.window.createTerminal(name);
      terminals.set(name, terminal);
    }
    return terminal;
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
  private runOnChannel(channel: vscode.OutputChannel, command: string,
    onFinish: (errorLevel: number) => void): Promise<{ stdout: string; stderr: string }> {
    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        const proc = cp.exec(command, (error, stdout, stderr) => {
          if (error) {
            reject({ error, stdout, stderr });
          }
          resolve({ stdout, stderr });
        });
        if (proc.stdout) this.streamToChannel(proc.stdout, channel);
        if (proc.stderr) this.streamToChannel(proc.stderr, channel);
        proc.on("exit", (code) => {
          if (code == 0 && onFinish) onFinish(code!.valueOf());
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
    channel.clear();
    channel.show(true);
    this.runOnChannel(channel, command, onFinish).catch(err => {
      if (err.stderr) {
        channel.appendLine(err.stderr);
      }
      if (err.stdout) {
        channel.appendLine(err.stdout);
      }
      channel.appendLine("executeOutputChannelfailed!\n" + err.error);
    });
  }

  /**
   * Executes asynchronously a new process using the specified command-line on terminal
   *
   * @param command command-line to be executed
   * @param callback optional callback executed after the process execution is completed
   */
  runAsyncTerminal(name: string, command: string) {
    const terminal = this.getTerminal(name);
    terminal.show(true);
    terminal.sendText(command);
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
   */
  runSync(command: string) {
    const exec = cp.execSync(command);
    return exec.toString();
  }

}
