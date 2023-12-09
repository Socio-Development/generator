export const configOrigins = ['default', 'user'] as const
export const loggerModes = ['error', 'log', 'warn'] as const
export const supportedLanguages = ['javascript', 'typescript'] as const

export interface Config extends UserConfigRequired {
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

export type PathPreparationResult = {
  missingPaths: string[]
}

export type SupportedLanguage = (typeof supportedLanguages)[number]

export type UserConfig = {
  createDir?: boolean
  dotPrefixWhitelist?: UserConfigWhitelist
  safeMode?: boolean
  safetyDirName?: string
}

export interface UserConfigRequired extends Required<UserConfig> {
  dotPrefixWhitelist: Required<UserConfigWhitelist>
}

type UserConfigWhitelist = {
  dirs?: string[]
  files?: string[]
}
