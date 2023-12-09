import defaultConfig from './defaultConfig'
import { Config, UserConfig } from './types'

/**
 * Creates a config object from the user provided config.
 * @param config The user provided config.
 * @returns A config object.
 */
export function defineConfig(config: Partial<UserConfig>): Partial<UserConfig> {
  return config
}

/**
 * Merges the user provided config with the default config.
 * @param userConfig The user provided config.
 * @returns A user config containing all properties.
 */
export function mergeConfig(userConfig: UserConfig): Config {
  const origin = Object.keys(userConfig).length > 0 ? 'user' : 'default'

  if (origin === 'default') {
    return {
      ...defaultConfig,
      origin,
    }
  }

  return {
    ...defaultConfig,
    ...userConfig,
    dotPrefixWhitelist: {
      ...defaultConfig.dotPrefixWhitelist,
      ...userConfig.dotPrefixWhitelist,
    },
    origin: 'user',
  }
}
