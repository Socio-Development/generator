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
