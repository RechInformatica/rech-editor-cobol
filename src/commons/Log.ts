import { File } from "./file";

/* Log directory */
const LOG_DIR: string = "C:\\TMP\\RechCobolLogs\\";

/**
 * Logger class
 */
export class Log {

  /* Singleton instance */
  private static self: Log | undefined;
  /* Log file */
  private file: File | undefined;
  /* Whether logging is active */
  private active: boolean;


  /**
   * Create a new Log instance
   *
   */
  private constructor() {
    this.active = false;
  }

  /**
   * Returns the singleton Logging instance
   */
  public static get(): Log {
    if (Log.self == undefined) {
      Log.self = new Log();
    }
    return Log.self;
  }

  /**
   * Returns true whether logging is active
   */
  public isActive(): boolean {
    return this.active;
  }

  /**
   * Return whether logging is active
   *
   * @param active logging is active
   */
  public setActive(active: boolean): Log {
    this.active = active;
    return this;
  }

  /**
   * Logs an information message
   *
   * @param message message to be logged
   */
  public info(message: string): Log {
    this.writeAndOutputsMessage("INFO: " + message)
    return this;
  }

  /**
   * Logs a warning message
   *
   * @param message message to be logged
   */
  public warning(message: string): Log {
    this.writeAndOutputsMessage("WARNING: " + message)
    return this;
  }

  /**
   * Logs an error message
   *
   * @param message message to be logged
   */
  public error(message: string): Log {
    this.writeAndOutputsMessage("ERROR: " + message)
    return this;
  }

  /**
   * Writes the specified message
   *
   * @param originalMessage message to be written
   */
  private writeAndOutputsMessage(originalMessage: string): void {
    if (this.active) {
      const finalMessage = this.buildFinalMessage(originalMessage);
      this.getLogFile().appendBufferSync([finalMessage], "latin1");
    }
  }

  /**
   * Builds the final message to be written in log File
   *
   * @param message message to be written
   */
  private buildFinalMessage(message: string): string {
    const date = new Date();
    return date.toLocaleString() + " " + message + "\n";
  }

  /**
   * Returns the log file instance creating a new instance if needed
   */
  private getLogFile(): File {
    if (this.file == undefined) {
      this.createLogDirectoryIfNeeded();
      this.file = new File(this.buildsLogName());
    }
    return this.file;

  }

  /**
   * Create log directory if needed
   */
  private createLogDirectoryIfNeeded(): void {
    const directory = new File(LOG_DIR);
    if (!directory.exists()) {
      directory.mkdir();
    }
  }

  /**
   * Builds the log file name
   */
  private buildsLogName(): string {
    const timestamp = Date.now().toString();
    const name = LOG_DIR + "RechCobol_Log_" + timestamp + ".log";
    return name;
  }


}