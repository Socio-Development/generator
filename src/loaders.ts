import { existsSync } from 'fs'
import { resolve } from 'path'
import defaultConfig from './defaultConfig'
import { Logger } from './logger'
import { Config } from './types'

/**
 * Loads the user config from `.generator.config.ts` or uses the default config if no config file is found.
 * @returns The loaded config.
 */
export function loadConfig(): Config {
  let config: Config | null = null

  Logger.startProcess('Loading config...')
  const configPath = resolve('.', 'generator.config.ts')

  const configExists = existsSync(configPath)
  if (!configExists) {
    Logger.add('No config file found')
  } else {
    Logger.add(`Config file found at: ${configPath}`)

    // TODO: Implement .genrc file parsing
    console.info('[generator] Config file parsing not implemented yet')
  }

  if (!config) {
    Logger.add('Using default config')
    config = {
      ...defaultConfig,
      origin: 'default',
    }
  }

  Logger.add(`Config origin: ${config.origin}`)
  Logger.endProcess('Config loaded successfully')

  return config
}
