import defaultConfig from './defaultConfig'
import { Config, UserConfig } from './types'

/**
 * A list of directory names that starts with a period (.github, .vscode).
 * This list is used to help differentiate directories from files.
 */
export const directoryWhitelist = ['.github', '.husky', '.vscode']

/**
 * A list of file names that starts with a period (.gitignore, .prettierignore, .prettierrc).
 * This list is used to help differentiate files from directories.
 */
export const fileWhitelist = [
  '.env',
  '.gitignore',
  '.prettierignore',
  '.prettierrc',
]

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
