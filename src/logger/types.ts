export type LogData = LogItemData[]

export type LogItemData = {
  indent: number
  msg: string
  raw: string
  timestamp: string
}

export type PrintOptions = {
  timestamp?: boolean
}
