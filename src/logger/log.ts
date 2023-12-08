import LogItem from './logItem'
import { LogData, PrintOptions } from './types'

export default class Log {
  private _items: LogItem[]

  constructor() {
    this._items = []
  }

  get items(): LogItem[] {
    return this._items
  }

  get length(): number {
    return this._items.length
  }

  add(data: string, indent: number): void {
    const item = new LogItem(data, indent)
    this._items.push(item)
  }

  print(options?: PrintOptions): void {
    this._items.forEach((item) => item.print(options))
  }

  toJSON(): LogData {
    return this._items.map((item) => item.toJSON())
  }
}
