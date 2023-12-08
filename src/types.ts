export const configOrigins = ['default', 'user'] as const
export const loggerModes = ['error', 'log', 'warn'] as const
export const supportedLanguages = ['javascript', 'typescript'] as const

export interface Config extends UserConfig {
  origin: ConfigOrigin
}

export type ConfigOrigin = (typeof configOrigins)[number]

export type GeneratorOptions = {
  /**
   * The code to put in the generated file.
   */
  code: string
  /**
   * Name of the file to generate.
   */
  fileName: string
  /**
   * The code language of the generated file.
   */
  language: SupportedLanguage
  /**
   * The path to generate the file in.
   */
  path: string
}

export type SupportedLanguage = (typeof supportedLanguages)[number]

export type UserConfig = {
  createDir: boolean
  dotPrefixWhitelist: {
    dirs: string[]
    files: string[]
  }
  safeMode: boolean
  safetyDirName: string
}
