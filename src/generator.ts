import { join, resolve } from 'path'
import GeneratorController from './controller'
import { Logger } from './logger'
import { Config, GeneratorOptions, PathPreparationResult } from './types'
import { pathEndsWithDir, pathExists } from './utils'

export function generate(options: GeneratorOptions): void {
  const controller = new GeneratorController(options)
  //controller.write()

  console.log(controller)
}

export function generateDirPath(path: string): void {
  Logger.startProcess(`Generating directory path: ${path}`)

  Logger.add('Path generation not implemented yet')
  // check if path exists

  Logger.endProcess(`Directory path generated`)
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

  const result: PathPreparationResult = {
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

  // check if the path exists
  while (arrPath.length > 0) {
    const currentPath = join(rootPath, ...arrPath)
    Logger.add(`Checking path: ${join(...arrPath)}`)
    if (!pathExists(currentPath)) {
      Logger.add(`Flagging missing path: ${join(...arrPath)}`)
      result.missingPaths.push(join(...arrPath))
    }
    arrPath.pop()
  }

  Logger.endProcess(`[generator] Path prepared`)
  return result
}
