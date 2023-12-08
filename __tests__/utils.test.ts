import defaultConfig from '../src/defaultConfig'
import { Config } from '../src/types'
import {
  isConfig,
  isConfigOrigin,
  isDirectory,
  isFile,
  parsePath,
  pathEndsWithDir,
  pathExists,
} from '../src/utils'

describe('isConfig', () => {
  it('should return true for valid configs', () => {
    expect(isConfig({ origin: 'default' })).toBe(true)
    expect(isConfig({ origin: 'file', safetyDirName: '_custom' })).toBe(true)
    expect(isConfig({ createDir: false, origin: 'function' })).toBe(true)
  })

  it('should return false if the origin property is missing', () => {
    expect(isConfig({})).toBe(false)
    expect(isConfig({ origin: null })).toBe(false)
    expect(isConfig({ origin: undefined })).toBe(false)
    expect(isConfig({ origin: '' })).toBe(false)
    expect(isConfig({ origin: 'foo' })).toBe(false)
  })
})

describe('isConfigOrigin', () => {
  it('should return true for valid config origins', () => {
    expect(isConfigOrigin('default')).toBe(true)
    expect(isConfigOrigin('file')).toBe(true)
    expect(isConfigOrigin('function')).toBe(true)
  })

  it('should return false for invalid config origins', () => {
    expect(isConfigOrigin('')).toBe(false)
    expect(isConfigOrigin('foo')).toBe(false)
    expect(isConfigOrigin('root')).toBe(false)
    expect(isConfigOrigin('project')).toBe(false)
  })
})

describe('isDirectory', () => {
  it('should return true if the path is a directory', () => {
    expect(isDirectory('src')).toBe(true)
    expect(isDirectory('src/')).toBe(true)
  })

  it('should return false if the path is a file', () => {
    expect(isDirectory('src/index.ts')).toBe(false)
    expect(isDirectory('.gitignore')).toBe(false)
  })

  it('should throw an error if the path is empty', () => {
    expect(() => isDirectory('')).toThrow()
  })
})

describe('isFile', () => {
  it('should return true if the path is a file', () => {
    expect(isFile('src/index.ts')).toBe(true)
    expect(isFile('.gitignore')).toBe(true)
  })

  it('should return false if the path is a directory', () => {
    expect(isFile('src')).toBe(false)
    expect(isFile('src/')).toBe(false)
  })

  it('should throw an error if the path is empty', () => {
    expect(() => isFile('')).toThrow()
  })
})

describe('parsePath', () => {
  it('should return a parsed path', () => {
    expect(parsePath('src/index.ts')).toEqual({
      root: '',
      dir: 'src',
      base: 'index.ts',
      ext: '.ts',
      name: 'index',
    })
    expect(parsePath('src/types/_generated/icons.ts')).toEqual({
      root: '',
      dir: 'src/types/_generated',
      base: 'icons.ts',
      ext: '.ts',
      name: 'icons',
    })
  })
})

describe('pathEndsWithDir', () => {
  const config: Config = {
    ...defaultConfig,
    origin: 'default',
  }

  it('should return true if the path ends with a directory', () => {
    expect(pathEndsWithDir(config, 'src')).toBe(true)
    expect(pathEndsWithDir(config, 'src/')).toBe(true)
    expect(pathEndsWithDir(config, 'src/foo')).toBe(true)
    expect(pathEndsWithDir(config, 'src/foo/')).toBe(true)
    expect(pathEndsWithDir(config, 'src/foo/bar')).toBe(true)
    expect(pathEndsWithDir(config, 'src/foo/bar/')).toBe(true)
    expect(pathEndsWithDir(config, '.husky')).toBe(true)
  })

  it('should return false if the path ends with a file', () => {
    expect(pathEndsWithDir(config, 'src/index.ts')).toBe(false)
    expect(pathEndsWithDir(config, 'src/foo/index.ts')).toBe(false)
    expect(pathEndsWithDir(config, 'src/foo/bar/index.ts')).toBe(false)
    expect(pathEndsWithDir(config, '.gitignore')).toBe(false)
    expect(pathEndsWithDir(config, 'packages/utils/.env')).toBe(false)
    expect(pathEndsWithDir(config, 'packages/utils/.env.local')).toBe(false)
  })

  it('should throw an error if the path is empty', () => {
    expect(() => pathEndsWithDir(config, '')).toThrow()
  })

  it('should throw an error if the final item in the path cannot be determined', () => {
    expect(() => pathEndsWithDir(config, 'src/.')).toThrow()
    expect(() => pathEndsWithDir(config, 'src/..')).toThrow()
    expect(() => pathEndsWithDir(config, 'src/foo/.')).toThrow()
    expect(() => pathEndsWithDir(config, 'src/foo/..')).toThrow()
    expect(() => pathEndsWithDir(config, 'src/foo/bar/.')).toThrow()
    expect(() => pathEndsWithDir(config, 'src/foo/bar/..')).toThrow()
    expect(() => pathEndsWithDir(config, '.test')).toThrow()
  })
})

describe('pathExists', () => {
  it('should return true if the path exists', () => {
    expect(pathExists('src')).toBe(true)
    expect(pathExists('src/index.ts')).toBe(true)
  })

  it('should return false if the path does not exist', () => {
    expect(pathExists('foo')).toBe(false)
    expect(pathExists('foo/bar')).toBe(false)
    expect(pathExists('foo/bar/baz')).toBe(false)
    expect(pathExists('foo/bar/baz/index.ts')).toBe(false)
  })
})
