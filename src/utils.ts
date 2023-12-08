import { existsSync } from 'fs'
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
 * Checks if the provided path ends with a directory.
 * @param path The path to check.
 * @returns `false` if the final item in the path contains a period (`.`), otherwise `true`.
 */
export function pathEndsWithDir(path: string): boolean {
  const arrPath = path.split('/')
  const lastItem = arrPath[arrPath.length - 1]
  return !lastItem.includes('.')
}

/**
 * Checks if the provided path exists.
 * @param path The path to check.
 * @returns `true` if the path exists, otherwise `false`.
 */
export function pathExists(path: string): boolean {
  return existsSync(path)
}
