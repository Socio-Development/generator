import defaultConfig from './defaultConfig'
import { UserConfig, UserConfigRequired } from './types'

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
 * @param config The user provided config.
 * @returns A user config containing all properties.
 */
export function mergeConfig(config: UserConfig): UserConfigRequired {
  return {
    ...defaultConfig,
    ...config,
    dotPrefixWhitelist: {
      ...defaultConfig.dotPrefixWhitelist,
      ...config.dotPrefixWhitelist,
    },
  }
}
