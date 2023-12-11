import { defaultConfig } from './constants'
import { Config, ConfigOrigin, UserConfig } from './types'
import { isObject } from './utils'

/**
 * Creates a config object from the user provided config.
 * @param config The user provided config.
 * @returns A config object.
 */
export function defineConfig(config: Partial<UserConfig>): Partial<UserConfig> {
  return config
}

/**
 * Merges the user provided config with the default config and applies the origin.
 * @param userConfig The user provided config.
 * @returns A config object.
 */
export function mergeConfig(userConfig: UserConfig): Config {
  let origin: ConfigOrigin | null = null

  // check if the user config is empty
  if (Object.keys(userConfig).length === 0) {
    origin = 'default'
  }

  // check if the user config is identical to the default config
  if (JSON.stringify(userConfig) === JSON.stringify(defaultConfig)) {
    origin = 'default'
  }

  if (origin === 'default') {
    return {
      ...defaultConfig,
      origin,
    }
  }

  origin = 'user'

  return {
    ...defaultConfig,
    ...userConfig,
    dotPrefixWhitelist: {
      ...defaultConfig.dotPrefixWhitelist,
      ...userConfig.dotPrefixWhitelist,
    },
    origin,
  }
}

/**
 * Validates the user provided config.
 * @param value The user provided config.
 * @returns A config object.
 * @throws An error if the user config is not an object.
 * @throws An error if the user config has too many keys.
 * @throws An error if the user config has invalid keys.
 * @throws An error if the user config property `createDir` is not a boolean.
 * @throws An error if the user config property `dotPrefixWhitelist` is not an object.
 * @throws An error if the user config property `dotPrefixWhitelist.dirs` is not an array.
 * @throws An error if the user config property `dotPrefixWhitelist.dirs` contains non-string values.
 * @throws An error if the user config property `dotPrefixWhitelist.files` is not an array.
 * @throws An error if the user config property `dotPrefixWhitelist.files` contains non-string values.
 * @throws An error if the user config property `safeMode` is not a boolean.
 * @throws An error if the user config property `safetyDirName` is not a string.
 */
export function validateUserConfig(value: unknown): UserConfig {
  // check if the user config is an object
  if (!isObject(value)) {
    throw new Error(
      '[generator] User config must be an object. Make sure you are using `defineConfig()` to define your config.',
    )
  }

  const keysInUserConfig = Object.keys(value)

  // check if the user config is empty
  if (keysInUserConfig.length === 0) {
    return {}
  }

  const keysInDefaultConfig = Object.keys(defaultConfig)

  // check if user config has too many keys
  if (keysInUserConfig.length > keysInDefaultConfig.length) {
    throw new Error('[generator] User config has too many properties.')
  }

  // check if user config has invalid keys
  const invalidKeys = keysInUserConfig.filter(
    (key) => !keysInDefaultConfig.includes(key),
  )
  if (invalidKeys.length > 0) {
    throw new Error(
      `[generator] User config has invalid properties: ${invalidKeys.join(
        ', ',
      )}.`,
    )
  }

  // validate .createDir
  if (value.createDir) {
    // check if .createDir is a boolean
    if (typeof value.createDir !== 'boolean') {
      throw new Error(
        '[generator] User config property `createDir` must be a boolean.',
      )
    }
  }

  // validate .dotPrefixWhitelist
  if (value.dotPrefixWhitelist) {
    // check if .dotPrefixWhitelist is an object
    if (!isObject(value.dotPrefixWhitelist)) {
      throw new Error(
        '[generator] User config property `dotPrefixWhitelist` must be an object.',
      )
    }
    // validate .dotPrefixWhitelist.dirs
    if (value.dotPrefixWhitelist.dirs) {
      // check if .dotPrefixWhitelist.dirs is an array
      if (!Array.isArray(value.dotPrefixWhitelist.dirs)) {
        throw new Error(
          '[generator] User config property `dotPrefixWhitelist.dirs` must be an array.',
        )
      }
      // check if .dotPrefixWhitelist.dirs only contains strings
      value.dotPrefixWhitelist.dirs.forEach((dir) => {
        if (typeof dir !== 'string') {
          throw new Error(
            '[generator] User config property `dotPrefixWhitelist.dirs` must only contain strings.',
          )
        }
      })
    }
    // validate .dotPrefixWhitelist.files
    if (value.dotPrefixWhitelist.files) {
      // check if .dotPrefixWhitelist.files is an array
      if (!Array.isArray(value.dotPrefixWhitelist.files)) {
        throw new Error(
          '[generator] User config property `dotPrefixWhitelist.files` must be an array.',
        )
      }
      // check if .dotPrefixWhitelist.files only contains strings
      value.dotPrefixWhitelist.files.forEach((file) => {
        if (typeof file !== 'string') {
          throw new Error(
            '[generator] User config property `dotPrefixWhitelist.files` must only contain strings.',
          )
        }
      })
    }
  }

  // validate .safeMode
  if (value.safeMode) {
    // check if .safeMode is a boolean
    if (typeof value.safeMode !== 'boolean') {
      throw new Error(
        '[generator] User config property `safeMode` must be a boolean.',
      )
    }
  }

  // validate .safetyDirName
  if (value.safetyDirName) {
    // check if .safetyDirName is a string
    if (typeof value.safetyDirName !== 'string') {
      throw new Error(
        '[generator] User config property `safetyDirName` must be a string.',
      )
    }
  }

  return value as UserConfig
}
