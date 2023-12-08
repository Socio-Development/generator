export const configOrigins = ['default', 'file', 'function'] as const
export const supportedLanguages = ['javascript', 'typescript'] as const

export interface Config extends UserConfig {
  origin: ConfigOrigin
}

export type ConfigOrigin = (typeof configOrigins)[number]

export type UserConfig = {
  /**
   * # Create Directory
   * **Default** `true`
   * 
   * This option controls whether or not the generator will create new directories in your project.
   * - If `true`, the generator will add directories if they don't exist.
   * - If `false`, the generator will throw an error if it encounters a directory that doesn't exist.
   */
  createDir: boolean
  /**
   * # Safe Mode (Danger Zone)
   * **Default** `true`
   * 
   * In safe mode, the generator will automatically add a directory to the end of the provided path.
   * This is to prevent the generator from overwriting any of your files.
   * It also has the added benefit of letting you know which files should not be edited.
   * 
   * ## Warning
   * Be extremely careful when disabling this option as it can cause the generator to overwrite your files.
   */
  safeMode: boolean
  /**
   * # Safe Mode Directory Name
   * **Default** `'_generated'`
   * 
   * You can change the name of the directory that is created by safe mode.
   * By default, the directory name is `_generated`.
   * 
   * ## Example
   * ```ts
   * // ./scripts/generateIconTypes.ts
   * import { generate } from '@socio-development/generator';
   * 
   * function crawlIconAssetsAndExtractNames(): string[] {
   *   // your code here
   * }
   * 
   * const iconNames = crawlIconAssetsAndExtractNames();
   * 
   * const codeToGenerate = `
   * export const iconNames = ['${ iconNames.join("', '") }'] as const;
   * 
   * export type IconName = (typeof iconNames)[number];
   * `
   * 
   * generate({
   *   code: codeToGenerate,
   *   fileName: 'icons',
   *   language: 'typescript',
   *   path: 'src/types'
   * });
   * ```
   */
  safetyDirName: string
}

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
