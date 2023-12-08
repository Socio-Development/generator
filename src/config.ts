import defaultConfig from './defaultConfig'
import { Config, UserConfig } from './types'

/**
 * Creates a config object from the user provided config.
 * @param config The user provided config.
 * @returns A config object.
 */
export function defineConfig(config: Partial<UserConfig>): Config {
  const combinedConfig: UserConfig = {
    ...defaultConfig,
    ...config,
  }
  return {
    ...combinedConfig,
    origin: 'function',
  }
}
