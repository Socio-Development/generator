import { defineConfig, mergeConfig } from '../config'
import defaultConfig from '../defaultConfig'
import { UserConfig } from '../types'

describe('defineConfig', () => {
  it('should return the provided config', () => {
    const userConfig: UserConfig = {
      createDir: false,
      safeMode: false,
      safetyDirName: '_ai_generated',
    }
    const config = defineConfig(userConfig)
    expect(config).toStrictEqual(userConfig)
  })
})

describe('mergeConfig', () => {
  it('should return the default config if no user config is provided', () => {
    const config = mergeConfig({})
    expect(config).toStrictEqual({
      ...defaultConfig,
      origin: 'default',
    })
  })

  it('should return the merged config if a user config is provided', () => {
    const userConfig: UserConfig = {
      createDir: false,
      safeMode: false,
      safetyDirName: '_ai_generated',
    }
    const config = mergeConfig(userConfig)
    expect(config).toStrictEqual({
      ...defaultConfig,
      ...userConfig,
      origin: 'user',
    })
  })
})
