import { existsSync } from 'fs'
import { resolve } from 'path'
import defaultConfig from './defaultConfig'
import { Logger } from './logger'
import { UserConfig } from './types'
import { isUserConfig } from './utils'

export const userConfigName = 'generator.config.ts'
export const userConfigPath = resolve('.', userConfigName)

/**
 * Loads the user config from `.generator.config.ts` or uses the default config if no config file is found.
 * @returns The loaded config.
 */
export function loadConfig(): UserConfig {
  Logger.startProcess('Loading config...')

  let config: UserConfig | undefined

  const userConfigExists = existsSync(userConfigPath)
  if (!userConfigExists) {
    Logger.add('No config file found')
  } else {
    Logger.add(`Config file found at: ${userConfigPath}`)

    try {
      Logger.add('Loading user config file...')

      const userConfigImport = require(userConfigPath)
      const userConfig = userConfigImport.default

      Logger.add(`User config: ${JSON.stringify(userConfig, null, 2)}`)

      if (!isUserConfig(userConfig)) {
        Logger.add('Invalid config file')
      } else {
        Logger.add('Using user config')
        config = userConfig
      }
    } catch (err) {
      Logger.add(`Something went wrong while loading ${userConfigName}`)
      if (err instanceof Error) {
        Logger.add(err.message)
      }
    }
  }

  if (!config) {
    Logger.add('Using default config')
    config = defaultConfig
  }

  Logger.endProcess('Config loaded successfully')

  return config
}
