import { Logger, getTheme } from '@socio-development/logger'
import { LoggerOptions } from '@socio-development/logger/dist/types'

const socioOptions = getTheme('socio')

const options: LoggerOptions = {
  ...socioOptions,
  prefix: '[generator]',
}

const logger = new Logger(options)

export default logger
