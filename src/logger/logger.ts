import Log from './log'
import { PrintOptions } from './types'

export default class Logger {
  private static _indentation = 0
  private static _log = new Log()

  /**
   * Add a log.
   * @param data The data to log.
   */
  public static add(data: string): void {
    this._log.add(data, this._indentation)
  }

  /**
   * End a process.
   * @param msg The message to add when ending the process.
   */
  public static endProcess(msg?: string): void {
    if (this._indentation === 0) {
      throw new Error('[generator] Cannot end process: No process started')
    }
    this._indentation--
    if (msg) {
      this.add(msg)
    } else {
      this.add('Ending process')
    }
  }

  public static get log(): Log {
    return this._log
  }

  /**
   * Print all logs to the console.
   */
  public static print(options?: PrintOptions): void {
    if (this._log.length === 0) {
      console.log('[generator] No logs to print')
    } else {
      this._log.print(options)
    }
  }

  /**
   * Reset the logger.
   */
  public static reset(): void {
    this._indentation = 0
    this._log = new Log()
  }

  /**
   * Start a new process.
   * @param msg The message to add when starting the process.
   */
  public static startProcess(msg?: string): void {
    if (msg) {
      this.add(msg)
    } else {
      this.add('Starting new process')
    }
    this._indentation++
  }

  public static toJSON(): object {
    return {
      log: this._log.toJSON(),
    }
  }
}
