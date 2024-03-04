import { resolve } from 'node:path'
import { UserConfigRequired } from './types'

export const defaultConfig: UserConfigRequired = {
  createDir: true,
  dotPrefixWhitelist: {
    dirs: ['.github', '.husky', '.vscode'],
    files: ['.env', '.gitignore', '.prettierignore', '.prettierrc'],
  },
  safeMode: true,
  safetyDirName: '_generated',
}

export const userConfigName = 'generator.config.ts'
export const userConfigPath = resolve('.', userConfigName)
