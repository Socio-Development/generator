import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { mergeConfig } from './config'
import { loadConfig } from './loaders'
import { Logger } from './logger'
import { Config, GeneratorOptions, PathPreparationResult } from './types'
import { pathEndsWithDir, pathExists } from './utils'

export function generate(options: GeneratorOptions): void {
  Logger.startProcess(`START`)

  const config = mergeConfig(loadConfig())
  const pathStatus = preparePath(config, options.path)

  if (pathStatus.missingPaths.length > 0) {
    if (config.createDir) {
      generateDirPaths(config, pathStatus.missingPaths)
    } else {
      throw new Error(
        `[generator] Missing paths: "${
          pathStatus.missingPaths[pathStatus.missingPaths.length - 1]
        }". Having createDir set to false will cause an error if the path does not exist.`,
      )
    }
  } else {
    Logger.add(`No missing paths`)
  }

  const filePath = join(pathStatus.finalDirPath, options.file)
  if (!existsSync(pathStatus.finalDirPath)) {
    throw new Error(
      `[generator] Path does not exist: ${pathStatus.finalDirPath}. This is most likely caused by a bug in the generator.`,
    )
  }

  // prepare code
  const preparedCode = prepareCode(options.code)

  Logger.add(`Generating file: ${filePath}`)
  Logger.add(`Writing code...`)
  writeFileSync(filePath, preparedCode, 'utf8')

  Logger.endProcess(`DONE`)
  Logger.print()
}

export function generateDirPaths(config: Config, paths: string[]): void {
  Logger.startProcess(`Generating directory paths...`)

  if (!config.createDir) {
    throw new Error(
      `[generator] Cannot generate directory path if createDir is false.`,
    )
  }

  // sort paths by length from shortest to longest
  paths.sort((a, b) => a.length - b.length)

  paths.forEach((path) => {
    // check if path exists
    if (existsSync(path)) {
      throw new Error(
        `[generator] Cannot generate directory path if it already exists. This is most likely caused by a bug in the generator.`,
      )
    }

    Logger.add(`Creating directory path: ${path}`)
    mkdirSync(path)
  })

  Logger.endProcess(`Directory path generated`)
}

/**
 * Prepares code for file generation.
 * @param data The code to prepare.
 * @returns The prepared code.
 */
export function prepareCode(data: string): string {
  Logger.startProcess(`Preparing code...`)

  let res = data

  // remove newlines from the beginning and end of the code
  if (res.startsWith('\n')) {
    Logger.add(`Removing newline from the beginning of the code`)
    res = res.slice(1)
  }
  if (res.endsWith('\n')) {
    Logger.add(`Removing newline from the end of the code`)
    res = res.slice(0, -1)
  }

  Logger.endProcess(`Preparing code: DONE`)
  return res
}

/**
 * Prepares a path for file generation.
 * @param config The generator config.
 * @param path The path to prepare.
 * @returns An object containing the missing paths.
 */
export function preparePath(
  config: Config,
  path: string,
): PathPreparationResult {
  Logger.startProcess(`[generator] Preparing path: ${path}`)

  const res: PathPreparationResult = {
    finalDirPath: '',
    missingPaths: [],
  }

  const rootPath = resolve('.')

  // remove project root path from relative path
  const relativePath = path.replace(rootPath, '')

  // split path into directories
  const arrPath = relativePath.split('/')

  // remove file from the end of array if it exists
  if (!pathEndsWithDir(config, relativePath)) {
    const removedFile = arrPath.pop()
    Logger.add(`Removed file from path: ${removedFile}`)
  }

  if (config.safeMode) {
    Logger.add(`Safe mode enabled. Adding safety directory to path`)
    // add safety directory to the end of array
    arrPath.push(config.safetyDirName)
  }

  res.finalDirPath = join(rootPath, ...arrPath)

  // check if the path exists
  while (arrPath.length > 0) {
    const currentPath = join(rootPath, ...arrPath)
    Logger.add(`Checking path: ${join(...arrPath)}`)
    if (!pathExists(currentPath)) {
      Logger.add(`Flagging missing path: ${join(...arrPath)}`)
      res.missingPaths.push(join(...arrPath))
    }
    arrPath.pop()
  }

  Logger.endProcess(`[generator] Path prepared`)
  return res
}
