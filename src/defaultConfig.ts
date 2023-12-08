import { UserConfig } from './types'

export default {
  createDir: true,
  dotPrefixWhitelist: {
    dirs: ['.github', '.husky', '.vscode'],
    files: ['.env', '.gitignore', '.prettierignore', '.prettierrc'],
  },
  safeMode: true,
  safetyDirName: '_generated',
} satisfies UserConfig
