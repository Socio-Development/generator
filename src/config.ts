import defaultConfig from './defaultConfig'
import { Config, ConfigOrigin, UserConfig } from './types'

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
