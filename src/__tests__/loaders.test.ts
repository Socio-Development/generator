import fs from 'node:fs'
import { userConfigPath } from '../constants'
import { loadConfig } from '../loaders'
import logger from '../log'

describe('loadConfig', () => {
  afterEach(() => {
    jest.resetModules()
  })

  beforeEach(() => {
    logger.clear()
    jest.restoreAllMocks()
  })

  it('should load an empty config if no config file is found', () => {
    const mockExistsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(false)

    const expected = {}
    const actual = loadConfig()

    expect(mockExistsSync).toHaveBeenCalledWith(userConfigPath)
    expect(actual).toStrictEqual(expected)
  })

  it('should load the user config if a config file is found', () => {
    const mockExistsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    const expected = {
      createDir: false,
    }

    jest.doMock(userConfigPath, () => ({
      default: expected,
    }))

    const actual = loadConfig()

    expect(mockExistsSync).toHaveBeenCalledWith(userConfigPath)
    expect(actual).toStrictEqual(expected)
  })

  it('should load an empty config if the user config is invalid', () => {
    const mockExistsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    jest.doMock(userConfigPath, () => ({
      default: {
        invalidProp: 'test',
      },
    }))

    const expected = {}
    const actual = loadConfig()

    expect(mockExistsSync).toHaveBeenCalledWith(userConfigPath)
    expect(actual).toStrictEqual(expected)
  })

  it('should load an empty config if an unexpected error occurs', () => {
    const mockExistsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    jest.doMock(userConfigPath, () => {
      throw new Error('Unexpected error')
    })

    const expected = {}
    const actual = loadConfig()

    expect(mockExistsSync).toHaveBeenCalledWith(userConfigPath)
    expect(actual).toStrictEqual(expected)
  })
})
