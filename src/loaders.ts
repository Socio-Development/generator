import { existsSync } from 'fs'
import { validateUserConfig } from './config'
import { userConfigName, userConfigPath } from './constants'
import { Logger } from './logger'
import { UserConfig } from './types'

/**
 * Loads the user config from `.generator.config.ts` or uses an empty config if no config file is found or the config file is invalid.
 * @returns The loaded config.
 */
export function loadConfig(): UserConfig {
  Logger.startProcess('Loading config...')

  let config: UserConfig = {}

  const userConfigExists = existsSync(userConfigPath)
  if (userConfigExists) {
    Logger.add(`Config file found at: ${userConfigPath}`)

    try {
      Logger.add('Loading user config file...')

      const userConfigImport = require(userConfigPath)
      const userConfig = userConfigImport.default

      Logger.add(`User config: ${JSON.stringify(userConfig, null, 2)}`)

      try {
        validateUserConfig(userConfig)
        Logger.add('Using user config')
        config = userConfig
      } catch (err) {
        Logger.add('Invalid config file')
        if (err instanceof Error) {
          Logger.add(err.message)
        }
      }
    } catch (err) {
      Logger.add(`Something went wrong while loading ${userConfigName}`)
      if (err instanceof Error) {
        Logger.add(err.message)
      }
    }
  } else {
    Logger.add('No config file found')
  }

  Logger.endProcess('Loading config: DONE')

  return config
}
