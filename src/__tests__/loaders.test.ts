import { existsSync, renameSync, rmSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import defaultConfig from '../defaultConfig'
import { loadConfig, userConfigPath } from '../loaders'
import { UserConfig } from '../types'

describe('loadConfig', () => {
  const tmpName = 'orig_generator.config.ts'
  const rootPath = resolve('.')
  const tmpPath = resolve(rootPath, tmpName)

  const createConfig = (userConfig: any = {}) => {
    const template: string[] = [
      'import { defineConfig } from "./src"',
      `export default defineConfig(${JSON.stringify(userConfig, null, 2)})`,
    ]

    // remove double quotes from keys
    if (template[1] !== undefined)
      template[1] = template[1].replace(/"([^(")"]+)":/g, '$1:')

    const code = template.join('\n')

    writeFileSync(userConfigPath, code, 'utf8')
  }

  const deleteConfig = () => {
    if (existsSync(userConfigPath)) {
      rmSync(userConfigPath)
    }
  }

  afterAll(() => {
    // check if temporary config file exists
    if (existsSync(tmpPath)) {
      // restore config file
      renameSync(tmpPath, userConfigPath)
    }
  })

  beforeAll(() => {
    // check if config file exists
    if (existsSync(userConfigPath)) {
      // temporarily rename config file
      renameSync(userConfigPath, tmpPath)
    }
  })

  beforeEach(() => {
    deleteConfig()
    jest.resetModules()
  })

  it('should load the default config if no config file is found', () => {
    const config = loadConfig()
    expect(config).toStrictEqual(defaultConfig)
  })

  it('should load the default config if the user config is invalid', () => {
    const input = {
      invalidProp: 'Hi, I am invalid!',
    }
    createConfig(input)
    const config = loadConfig()
    expect(config).toStrictEqual(defaultConfig)
  })

  it('should load the user config if available', () => {
    const input: UserConfig = {
      createDir: false,
    }
    createConfig(input)
    const config = loadConfig()
    expect(config).toStrictEqual(input)
  })
})
