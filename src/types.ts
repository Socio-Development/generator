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
   * @example 'export const icons = { ... }'
   */
  code: string | string[]
  /**
   * The file to generate.
   * @example 'icons.ts'
   */
  file: string
  /**
   * The path to generate the file in.
   * @example 'src/types'
   */
  path: string
}

export type PathPreparationResult = {
  finalDirPath: string
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
