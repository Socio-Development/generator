import { existsSync, statSync } from 'fs'
import { ParsedPath, parse } from 'path'
import { defaultConfig } from './constants'
import { Config, ConfigOrigin, UserConfig } from './types'

/**
 * Checks if the provided value is a valid config.
 * @param value The value to check.
 * @returns `true` if the value is a valid config, `false` otherwise.
 */
export function isConfig(value: unknown): value is Config {
  if (!isObject(value)) return false
  const { origin, ...userConfig } = value
  return isUserConfig(userConfig) && isConfigOrigin(origin)
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
 * Checks if the provided value is an object.
 * @param value The value to check.
 * @returns `true` if the value is an object, `false` otherwise.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    value !== undefined &&
    !Array.isArray(value)
  )
}

/**
 * Checks if the provided value is a valid user config.
 * @param value The value to check.
 * @returns `true` if the value is a valid user config, `false` otherwise.
 */
export function isUserConfig(value: unknown): value is UserConfig {
  // check if the value is an object
  if (!isObject(value)) return false

  const keysInDefaultConfig = Object.keys(defaultConfig)
  const keysInUserConfig = Object.keys(value)

  // check if the user config has too many properties
  if (keysInUserConfig.length > keysInDefaultConfig.length) return false

  // check if the user config has any invalid properties
  let foundInvalidKey = false
  keysInUserConfig.forEach((key) => {
    if (!keysInDefaultConfig.includes(key)) {
      foundInvalidKey = true
    }
  })

  return !foundInvalidKey
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
 * @param config The generator config to use.
 * @param path The path to check.
 * @returns `false` if the final item in the path contains a period (`.`), otherwise `true`.
 * @throws An error if the path is empty.
 * @throws An error if the final item in the path cannot be determined.
 *
 * TODO: Improve error messages when documentation is added.
 */
export function pathEndsWithDir(config: Config, path: string): boolean {
  if (path.length === 0) throw new Error('[generator] Path cannot be empty')
  const { ext, name } = parsePath(path)

  // return false if the parsed path has an extension
  if (ext.length > 0) return false

  if (name.startsWith('.')) {
    if (config.dotPrefixWhitelist.dirs.includes(name)) return true
    if (config.dotPrefixWhitelist.files.includes(name)) return false
    throw new Error(`[generator] Unknown file or directory: "${name}"`)
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
