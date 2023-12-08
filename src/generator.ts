import { resolve } from 'path'
import GeneratorController from './controller'
import { Logger } from './logger'
import { GeneratorOptions } from './types'

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

export function preparePath(path: string): void {
  Logger.startProcess(`[generator] Preparing path: ${path}`)

  const rootPath = resolve('.')

  // remove project root path from relative path
  const relativePath = path.replace(rootPath, '')

  // split path into directories
  const arrPath = relativePath.split('/')

  // remove file from the end of array if it exists
  //if (!pathEndsWithDir(relativePath)) arrPath.pop()

  // confirm that every item is a directory

  Logger.endProcess(`[generator] Path prepared`)
}
