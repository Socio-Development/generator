import { LogItemData, PrintOptions } from './types'

export default class LogItem {
  private _indent: number
  private _raw: string
  private _timestamp: string

  constructor(data: string, indent: number) {
    this._indent = indent
    this._timestamp = new Date().toJSON()

    if (data.startsWith('[generator] ')) {
      const arrData = data.split(' ')
      const sanitizedData = arrData.slice(1).join(' ')
      this._raw = sanitizedData
    } else {
      this._raw = data
    }
  }

  get msg(): string {
    const composition = ['[generator] ']
    const indentation = this._getIndentat()
    if (indentation) {
      composition.push(indentation)
    }
    composition.push(this._raw)
    return composition.join('')
  }

  get msgWithTimestamp(): string {
    const composition = [this._timestamp, ' [generator] ']
    const indentation = this._getIndentat()
    if (indentation) {
      composition.push(indentation)
    }
    composition.push(this._raw)
    return composition.join('')
  }

  get timestamp(): string {
    return this._timestamp
  }

  private _getIndentat(): string | null {
    let indentation = ''
    for (let i = 0; i < this._indent; i++) {
      indentation += '  '
    }
    if (indentation.length === 0) {
      return null
    }
    return indentation
  }

  print(options?: PrintOptions): void {
    if (options?.timestamp) {
      console.log(this.msgWithTimestamp)
      return
    }
    console.log(this.msg)
  }

  toJSON(): LogItemData {
    return {
      indent: this._indent,
      msg: this.msg,
      raw: this._raw,
      timestamp: this._timestamp,
    }
  }
}
