import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { mergeConfig } from './config'
import { loadConfig } from './loaders'
import logger from './log'
import { Config, GeneratorOptions, PathPreparationResult } from './types'
import { pathEndsWithDir, pathExists } from './utils'

export function generate(options: GeneratorOptions): void {
  logger.group('Starting generator...')

  const config = mergeConfig(loadConfig())
  const pathStatus = preparePath(config, options.path)

  if (pathStatus.missingPaths.length > 0) {
    if (config.createDir) {
      generateDirPaths(config, pathStatus.missingPaths)
    } else {
      const msg = `Missing paths: "${
        pathStatus.missingPaths[pathStatus.missingPaths.length - 1]
      }". Having createDir set to false will cause an error if the path does not exist.`

      logger.error(msg)

      throw new Error(msg)
    }
  } else {
    logger.info('No missing paths')
  }

  const filePath = join(pathStatus.finalDirPath, options.file)
  if (!existsSync(pathStatus.finalDirPath)) {
    const msg = `Path does not exist: ${pathStatus.finalDirPath}. This is most likely caused by a bug in the generator.`

    logger.error(msg)

    throw new Error(msg)
  }

  // prepare code
  const preparedCode = prepareCode(options.code)

  logger.add(`Generating file: ${filePath}`)
  logger.add(`Writing code...`)
  writeFileSync(filePath, preparedCode, 'utf8')

  logger.groupEnd('DONE')
  logger.print()
}

export function generateDirPaths(config: Config, paths: string[]): void {
  logger.group(`Generating directory paths...`)

  if (!config.createDir) {
    const msg = 'Cannot generate directory path if createDir is false.'
    logger.error(msg)
    throw new Error(msg)
  }

  // sort paths by length from shortest to longest
  paths.sort((a, b) => a.length - b.length)

  paths.forEach((path) => {
    // check if path exists
    if (existsSync(path)) {
      const msg = `Cannot generate directory path if it already exists. This is most likely caused by a bug in the generator.`
      logger.error(msg)
      throw new Error(msg)
    }

    logger.add(`Creating directory path: ${path}`)
    mkdirSync(path)
  })

  logger.groupEnd(`Directory path generated`)
}

/**
 * Prepares code for file generation.
 * @param data The code to prepare.
 * @returns The prepared code.
 */
export function prepareCode(data: string): string {
  logger.group(`Preparing code...`)

  let res = data

  // remove newlines from the beginning and end of the code
  if (res.startsWith('\n')) {
    logger.add(`Removing newline from the beginning of the code`)
    res = res.slice(1)
  }
  if (res.endsWith('\n')) {
    logger.add(`Removing newline from the end of the code`)
    res = res.slice(0, -1)
  }

  logger.groupEnd(`Preparing code: DONE`)
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
  logger.group(`Preparing path: ${path}`)

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
    logger.warn(`Removed file from path: ${removedFile}`)
  }

  if (config.safeMode) {
    logger.add(`Safe mode enabled. Adding safety directory to path`)
    // add safety directory to the end of array
    arrPath.push(config.safetyDirName)
  }

  res.finalDirPath = join(rootPath, ...arrPath)

  // check if the path exists
  while (arrPath.length > 0) {
    const currentPath = join(rootPath, ...arrPath)
    logger.add(`Checking path: ${join(...arrPath)}`)
    if (!pathExists(currentPath)) {
      logger.add(`Flagging missing path: ${join(...arrPath)}`)
      res.missingPaths.push(join(...arrPath))
    }
    arrPath.pop()
  }

  logger.groupEnd(`Path prepared`)
  return res
}
