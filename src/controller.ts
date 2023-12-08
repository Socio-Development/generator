import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import defaultConfig from './defaultConfig'
import { Config, GeneratorOptions, SupportedLanguage } from './types'

export default class GeneratorController {
  /** The code to put in the generated file. */
  private _code: string
  /**
   * Generator config.
   * If the root directory contains a `.generaterc` file, it will be loaded.
   * Otherwise, the default config will be used.
   */
  private _config: Config
  /** Name of the file to generate. */
  private _fileName: string
  /** The code language of the generated file. */
  private _language: SupportedLanguage
  /** The path to generate the file in. */
  private _relativePath: string
  /** Project root path. */
  private _rootPath: string

  constructor({ code, fileName, language, path }: GeneratorOptions) {
    this._code = code
    this._config = { ...defaultConfig, origin: 'default' }
    this._fileName = fileName
    this._language = language
    this._relativePath = path
    this._rootPath = resolve('.')

    this._loadConfig()
  }

  /**
   * Creates a directory at the specified path.
   * @param path The path to create the directory at.
   * @throws If the path does not end with a directory.
   * @throws If the path already exists.
   * @throws If the directory fails to create.
   */
  private _createDir(path: string): void {
    // verify that the path is a directory
    if (!this._pathEndsWithDir(path)) {
      throw new Error(
        `[generator] Invalid directory path: ${path}. This is most likely caused by a bug in the generator.`,
      )
    }

    // verify that the path doesn't exist
    if (this._pathExists(path)) {
      throw new Error(
        `[generator] Directory already exists: ${path}. The current process should not have been started and is most likely caused by a bug in the generator.`,
      )
    }

    // create directory
    console.log(`[generator] Creating directory: ${path}`)
    mkdirSync(path)

    // verify that the directory was created
    if (!this._pathExists(path)) {
      throw new Error(
        `[generator] Failed to create directory: ${path}. This is most likely caused by a bug in the generator.`,
      )
    }
  }

  /**
   * The file extension for the generated file.
   * @throws If the code language is not supported.
   */
  private get _fileExtension(): string {
    switch (this._language) {
      case 'javascript':
        return 'js'
      case 'typescript':
        return 'ts'
      default:
        throw new Error(`[generator] Unsupported language: ${this._language}`)
    }
  }

  /**
   * Load the config from the root directory.
   * If the config file doesn't exist, it will be ignored.
   * @throws If the config file is invalid.
   */
  private _loadConfig(): void {
    console.log('[generator] Loading config...')
    console.group()

    const configPath = join(this._rootPath, '.generaterc')
    // check if config file exists
    if (!this._pathExists(configPath)) {
      console.log('[generator] No config file found. Using default config.')
      return
    }

    try {
      const rootConfig = require(configPath)
      // Check if rootConfig is GeneratorConfig
      if (rootConfig && typeof rootConfig === 'object') {
        this._config = rootConfig
        console.log('[generator] Config was loaded successfully.')
      } else {
        throw new Error('[generator] Invalid config.')
      }
    } catch (err) {
      console.warn('[generator] Failed to load root config.')
    } finally {
      console.groupEnd()
    }
  }

  /**
   * Check if the path ends with a directory.
   * @param path The path to check.
   * @returns `false` if the final item in the path contains a period (`.`), otherwise `true`.
   */
  private _pathEndsWithDir(path: string): boolean {
    const arrPath = path.split('/')
    const lastItem = arrPath[arrPath.length - 1]
    return !lastItem.includes('.')
  }

  /**
   * Check if the path exists.
   * @param path The path to check.
   * @returns `true` if the path exists, otherwise `false`.
   */
  private _pathExists(path: string): boolean {
    return existsSync(path)
  }

  private _preparePath(): void {
    console.log(`[generator] Preparing path: ${this._relativePath}`)
    console.group()

    // remove project root path from relative path
    const relativePath = this._relativePath.replace(this._rootPath, '')

    // split path into directories
    const arrPath = relativePath.split('/')

    // remove file from the end of array if it exists
    if (!this._pathEndsWithDir(relativePath)) arrPath.pop()

    // confirm that every item is a directory
    const isDir = arrPath.every((item) => !item.includes('.'))
    if (!isDir)
      throw new Error(`[generator] Invalid path: ${this._relativePath}`)

    // check that every directory exists
    let currentPath = this._rootPath
    for (const dirName of arrPath) {
      currentPath = join(currentPath, dirName)
      if (!this._pathExists(currentPath)) {
        if (this._config.createDir) {
          // create directory
          this._createDir(currentPath)
        } else {
          throw new Error(
            `[generator] Directory does not exist: ${currentPath}`,
          )
        }
      }
    }
    console.groupEnd()
  }

  /**
   * The target path to write the generated code to.
   * If safe mode is enabled, the target path will be appended with a directory to prevent overwriting code.
   */
  private get _targetPath(): string {
    const file = `${this._fileName}.${this._fileExtension}`

    if (this._config.safeMode) {
      return join(
        this._rootPath,
        this._relativePath,
        this._config.safetyDirName,
        file,
      )
    }
    return join(this._rootPath, this._relativePath, file)
  }

  /**
   * Write the generated code to the target path.
   * If the target path doesn't exist, it will be created (unless the `createDir` option is set to `false`).
   */
  public write(): void {
    writeFileSync(this._targetPath, this._code, 'utf8')
  }
}
