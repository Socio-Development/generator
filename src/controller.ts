import { mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { mergeConfig } from './config'
import { loadConfig } from './loaders'
import { Config, GeneratorOptions } from './types'
import { pathEndsWithDir, pathExists } from './utils'

export default class GeneratorController {
  /** The code to put in the generated file. */
  private _code: string
  /**
   * Generator config.
   * If the root directory contains a `.generaterc` file, it will be loaded.
   * Otherwise, the default config will be used.
   */
  private _config: Config
  /** The file to generate. */
  private _file: string
  /** The path to generate the file in. */
  private _relativePath: string
  /** Project root path. */
  private _rootPath: string

  constructor({ code, file, path }: GeneratorOptions) {
    this._code = code
    this._file = file
    this._relativePath = path
    this._rootPath = resolve('.')

    const userConfig = loadConfig()
    this._config = mergeConfig(userConfig)
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
    if (!pathEndsWithDir(this._config, path)) {
      throw new Error(
        `[generator] Invalid directory path: ${path}. This is most likely caused by a bug in the generator.`,
      )
    }

    // verify that the path doesn't exist
    if (pathExists(path)) {
      throw new Error(
        `[generator] Directory already exists: ${path}. The current process should not have been started and is most likely caused by a bug in the generator.`,
      )
    }

    // create directory
    console.log(`[generator] Creating directory: ${path}`)
    mkdirSync(path)

    // verify that the directory was created
    if (!pathExists(path)) {
      throw new Error(
        `[generator] Failed to create directory: ${path}. This is most likely caused by a bug in the generator.`,
      )
    }
  }

  private _preparePath(): void {
    console.log(`[generator] Preparing path: ${this._relativePath}`)
    console.group()

    // remove project root path from relative path
    const relativePath = this._relativePath.replace(this._rootPath, '')

    // split path into directories
    const arrPath = relativePath.split('/')

    // remove file from the end of array if it exists
    if (!pathEndsWithDir(this._config, relativePath)) arrPath.pop()

    // confirm that every item is a directory
    const isDir = arrPath.every((item) => !item.includes('.'))
    if (!isDir)
      throw new Error(`[generator] Invalid path: ${this._relativePath}`)

    // check that every directory exists
    let currentPath = this._rootPath
    for (const dirName of arrPath) {
      currentPath = join(currentPath, dirName)
      if (!pathExists(currentPath)) {
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
    if (this._config.safeMode) {
      return join(
        this._rootPath,
        this._relativePath,
        this._config.safetyDirName,
        this._file,
      )
    }
    return join(this._rootPath, this._relativePath, this._file)
  }

  /**
   * Write the generated code to the target path.
   * If the target path doesn't exist, it will be created (unless the `createDir` option is set to `false`).
   */
  public write(): void {
    writeFileSync(this._targetPath, this._code, 'utf8')
  }
}
