import { existsSync, statSync } from 'fs'
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
 * Checks if the provided path ends with a directory.
 * @param path The path to check.
 * @returns `false` if the final item in the path contains a period (`.`), otherwise `true`.
 * @throws An error if the path is empty.
 */
export function pathEndsWithDir(path: string): boolean {
  if (path.length === 0) throw new Error('Path cannot be empty.')
  const arrPath = path.split('/')
  return !arrPath[arrPath.length - 1]?.includes('.')
}

/**
 * Checks if the provided path exists.
 * @param path The path to check.
 * @returns `true` if the path exists, otherwise `false`.
 */
export function pathExists(path: string): boolean {
  return existsSync(path)
}
