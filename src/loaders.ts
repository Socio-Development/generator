import { existsSync } from 'node:fs'
import { validateUserConfig } from './config'
import { userConfigName, userConfigPath } from './constants'
import logger from './log'
import { UserConfig } from './types'

/**
 * Loads the user config from `.generator.config.ts` or uses an empty config if no config file is found or the config file is invalid.
 * @returns The loaded config.
 */
export function loadConfig(): UserConfig {
  logger.group('Loading config...')

  let config: UserConfig = {}

  const userConfigExists = existsSync(userConfigPath)
  if (userConfigExists) {
    logger.add(`Config file found at: ${userConfigPath}`)

    try {
      logger.add('Loading user config file...')

      const userConfigImport = require(userConfigPath)
      const userConfig = userConfigImport.default

      logger.info(`User config: ${JSON.stringify(userConfig)}`)

      try {
        validateUserConfig(userConfig)
        logger.add('Using user config')
        config = userConfig
      } catch (err) {
        logger.error('Invalid config file')
        if (err instanceof Error) {
          logger.error(err.message)
        }
      }
    } catch (err) {
      logger.error(`Something went wrong while loading ${userConfigName}`)
      if (err instanceof Error) {
        logger.error(err.message)
      }
    }
  } else {
    logger.add('No config file found')
  }

  logger.groupEnd('Loading config: DONE')

  return config
}
