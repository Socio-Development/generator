import { defineConfig, mergeConfig, validateUserConfig } from '../config'
import { defaultConfig } from '../constants'
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

  it('should merge whitelists', () => {
    const originalValue = defaultConfig.dotPrefixWhitelist
    const mockValue = {
      dirs: ['.github', '.vscode'],
      files: ['.env', '.gitignore'],
    }
    // mock defaultConfig.dotPrefixWhitelist
    defaultConfig.dotPrefixWhitelist = mockValue

    const userConfig: UserConfig = {
      dotPrefixWhitelist: {
        dirs: ['.test'],
        files: ['.env', '.test'],
      },
    }

    const config = mergeConfig(userConfig)

    expect(config).toStrictEqual({
      ...defaultConfig,
      ...userConfig,
      origin: 'user',
      dotPrefixWhitelist: {
        dirs: ['.github', '.test', '.vscode'],
        files: ['.env', '.gitignore', '.test'],
      },
    })

    // reset defaultConfig.dotPrefixWhitelist
    defaultConfig.dotPrefixWhitelist = originalValue
  })
})

describe('validateUserConfig', () => {
  it('should check every available option property', () => {
    // This test is here to make sure that we don't forget to add new options to the validation.

    const userConfig: UserConfig = {
      createDir: true,
      dotPrefixWhitelist: {
        dirs: ['test'],
        files: ['test'],
      },
      safeMode: false,
      safetyDirName: '_ai_generated',
    }

    const expected = Object.keys(defaultConfig).length
    const actual = Object.keys(validateUserConfig(userConfig)).length

    expect(actual).toEqual(expected)
  })

  it('should throw an error if the provided config is not an object', () => {
    const userConfig = 'test'
    expect(() => validateUserConfig(userConfig)).toThrow(
      '[generator] User config must be an object. Make sure you are using `defineConfig()` to define your config.',
    )
  })

  it('should throw an error if the provided config is null', () => {
    const userConfig = null
    expect(() => validateUserConfig(userConfig)).toThrow(
      '[generator] User config must be an object. Make sure you are using `defineConfig()` to define your config.',
    )
  })

  it('should throw an error if the provided config is undefined', () => {
    const userConfig = undefined
    expect(() => validateUserConfig(userConfig)).toThrow(
      '[generator] User config must be an object. Make sure you are using `defineConfig()` to define your config.',
    )
  })

  it('should return the provided config if it is an object', () => {
    const userConfig = {}
    const config = validateUserConfig(userConfig)
    expect(config).toStrictEqual(userConfig)
  })

  it('should throw an error if the provided config has too many properties', () => {
    const userConfig = {
      test: true,
      test2: true,
      test3: true,
      test4: true,
      test5: true,
      test6: true,
      test7: true,
      test8: true,
      test9: true,
    }
    expect(() => validateUserConfig(userConfig)).toThrow(
      '[generator] User config has too many properties.',
    )
  })

  it('should throw an error if the provided config has invalid properties', () => {
    const userConfig = {
      test: true,
    }
    expect(() => validateUserConfig(userConfig)).toThrow(
      '[generator] User config has invalid properties: test.',
    )
  })

  describe('.createDir', () => {
    it('should throw an error if .createDir is not a boolean', () => {
      const userConfig = {
        createDir: 'test',
      }
      expect(() => validateUserConfig(userConfig)).toThrow(
        '[generator] User config property `createDir` must be a boolean.',
      )
    })
  })

  describe('.dotPrefixWhitelist', () => {
    it('should throw an error if .dotPrefixWhitelist is not an object', () => {
      const userConfig = {
        dotPrefixWhitelist: 'test',
      }
      expect(() => validateUserConfig(userConfig)).toThrow(
        '[generator] User config property `dotPrefixWhitelist` must be an object.',
      )
    })

    describe('.dirs', () => {
      it('should throw an error if .dotPrefixWhitelist.dirs contains is not an array', () => {
        const userConfig = {
          dotPrefixWhitelist: {
            dirs: 'test',
          },
        }
        expect(() => validateUserConfig(userConfig)).toThrow(
          '[generator] User config property `dotPrefixWhitelist.dirs` must be an array.',
        )
      })

      it('should throw an error if .dotPrefixWhitelist.dirs does not contain strings', () => {
        const userConfig = {
          dotPrefixWhitelist: {
            dirs: [true],
          },
        }
        expect(() => validateUserConfig(userConfig)).toThrow(
          '[generator] User config property `dotPrefixWhitelist.dirs` must only contain strings.',
        )
      })
    })

    describe('.files', () => {
      it('should throw an error if .dotPrefixWhitelist.files contains is not an array', () => {
        const userConfig = {
          dotPrefixWhitelist: {
            files: 'test',
          },
        }
        expect(() => validateUserConfig(userConfig)).toThrow(
          '[generator] User config property `dotPrefixWhitelist.files` must be an array.',
        )
      })

      it('should throw an error if .dotPrefixWhitelist.files does not contain strings', () => {
        const userConfig = {
          dotPrefixWhitelist: {
            files: [true],
          },
        }
        expect(() => validateUserConfig(userConfig)).toThrow(
          '[generator] User config property `dotPrefixWhitelist.files` must only contain strings.',
        )
      })
    })
  })

  describe('.safeMode', () => {
    it('should throw an error if .safeMode is not a boolean', () => {
      const userConfig = {
        safeMode: 'test',
      }
      expect(() => validateUserConfig(userConfig)).toThrow(
        '[generator] User config property `safeMode` must be a boolean.',
      )
    })
  })

  describe('.safetyDirName', () => {
    it('should throw an error if .safetyDirName is not a string', () => {
      const userConfig = {
        safetyDirName: true,
      }
      expect(() => validateUserConfig(userConfig)).toThrow(
        '[generator] User config property `safetyDirName` must be a string.',
      )
    })
  })
})
