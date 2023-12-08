import { renameSync, rmSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { loadConfig } from '../src/loaders'
import { UserConfig } from '../src/types'
import { pathExists } from '../src/utils'

describe('loadConfig', () => {
  const configName = 'generator.config.ts'
  const tmpName = 'orig_generator.config.ts'
  const rootPath = resolve('.')
  const configPath = resolve(rootPath, configName)
  const tmpPath = resolve(rootPath, tmpName)

  const createConfig = (userConfig: Partial<UserConfig> = {}) => {
    const template: string[] = [
      'import { defineConfig } from "./src"',
      `export default defineConfig(${JSON.stringify(userConfig, null, 2)})`,
    ]
    const code = template.join('\n')
    writeFileSync(configPath, code, 'utf8')
  }
  const deleteConfig = () => {
    if (pathExists(configPath)) {
      rmSync(configPath)
    }
  }

  afterAll(() => {
    deleteConfig()

    // check if temporary config file exists
    if (pathExists(tmpPath)) {
      // restore config file
      renameSync(tmpPath, configPath)
    }
  })

  afterEach(() => {
    deleteConfig()
  })

  beforeAll(() => {
    // check if config file exists
    if (pathExists(configPath)) {
      // temporarily rename config file
      renameSync(configPath, tmpPath)
    }
  })

  it('should load the default config if no config file is found', () => {
    const config = loadConfig()
    expect(config.origin).toEqual('default')
  })

  it('should load the user config if available', () => {
    createConfig()
    const config = loadConfig()
    expect(config.origin).toEqual('user')
    //Logger.print()
  })
})
