import { existsSync } from 'fs'
import { resolve } from 'path'
import defaultConfig from './defaultConfig'
import { Config } from './types'

/**
 * Loads the config from the config file or uses the default config if no config file is found.
 * @returns The loaded config.
 */
export function loadConfig(): Config {
  console.log('[generator] Loading config...')
  console.group()

  const configPath = resolve('.', '.genrc')

  let config: Config | null = null

  const configExists = existsSync(configPath)
  if (!configExists) {
    console.log('[generator] No config file found')
  } else {
    console.log(`[generator] Config file found at: ${configPath}`)
    
    // TODO: Implement .genrc file parsing
    console.info('[generator] Config file parsing not implemented yet')
  }

  if (!config) {
    console.log('[generator] Using default config')
    config = {
      ...defaultConfig,
      origin: 'default'
    }
  }

  console.log(`[generator] Config origin: ${config.origin}`)
  console.groupEnd()
  console.log('[generator] Config loaded.')

  return config
}