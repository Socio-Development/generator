import { existsSync, statSync } from 'fs'
import { ParsedPath, parse } from 'path'
import { directoryWhitelist, fileWhitelist } from './config'
import { Config, ConfigOrigin } from './types'

/**
 * Checks if the provided value is a valid config.
 * @param value The value to check.
 * @returns `true` if the value is a valid config, `false` otherwise.
 */
export function isConfig(value: unknown): value is Config {
  return (
    typeof value === 'object' &&
    value !== null &&
    'origin' in value &&
    isConfigOrigin((value as Config).origin)
  )
}

/**
 * Checks if the provided value is a valid config origin.
 * @param value The value to check.
 * @returns `true` if the value is a valid config origin, `false` otherwise.
 */
export function isConfigOrigin(value: unknown): value is ConfigOrigin {
  return (
    typeof value === 'string' && ['default', 'file', 'function'].includes(value)
  )
}

/**
 * Checks if the provided path is a directory.
 * @param path The path to check.
 * @returns `true` if the path is a directory, otherwise `false`.
 */
export function isDirectory(path: string): boolean {
  return statSync(path).isDirectory()
}

/**
 * Checks if the provided path is a file.
 * @param path The path to check.
 * @returns `true` if the path is a file, otherwise `false`.
 */
export function isFile(path: string): boolean {
  return statSync(path).isFile()
}

/**
 * Parses a path into an object.
 * @param path The path to parse.
 * @returns The parsed path.
 */
export function parsePath(path: string): ParsedPath {
  return parse(path)
}

/**
 * Checks if the provided path ends with a directory.
 * @param path The path to check.
 * @returns `false` if the final item in the path contains a period (`.`), otherwise `true`.
 * @throws An error if the path is empty.
 * @throws An error if the final item in the path cannot be determined.
 */
export function pathEndsWithDir(path: string): boolean {
  if (path.length === 0) throw new Error('Path cannot be empty.')
  const { ext, name } = parsePath(path)

  // return false if the parsed path has an extension
  if (ext.length > 0) return false

  if (name.startsWith('.')) {
    if (directoryWhitelist.includes(name)) return true
    if (fileWhitelist.includes(name)) return false
    throw new Error(`Unknown file or directory: ${name}`)
  }

  return true
}

/**
 * Checks if the provided path exists.
 * @param path The path to check.
 * @returns `true` if the path exists, otherwise `false`.
 */
export function pathExists(path: string): boolean {
  return existsSync(path)
}
