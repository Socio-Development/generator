import { isConfig, isConfigOrigin } from '../src/utils'

describe('isConfig', () => {
  test('should return true for valid configs', () => {
    expect(
      isConfig({ origin: 'default' })
    ).toBe(true)
    expect(
      isConfig({ origin: 'file', safetyDirName: '_custom' })
    ).toBe(true)
    expect(
      isConfig({ createDir: false,  origin: 'function' })
    ).toBe(true)
  })

  test('should return false if the origin property is missing', () => {
    expect(isConfig({})).toBe(false)
    expect(isConfig({ origin: null })).toBe(false)
    expect(isConfig({ origin: undefined })).toBe(false)
    expect(isConfig({ origin: '' })).toBe(false)
    expect(isConfig({ origin: 'foo' })).toBe(false)
  })
})

describe('isConfigOrigin', () => {
  test('should return true for valid config origins', () => {
    expect(isConfigOrigin('default')).toBe(true)
    expect(isConfigOrigin('file')).toBe(true)
    expect(isConfigOrigin('function')).toBe(true)
  })

  test('should return false for invalid config origins', () => {
    expect(isConfigOrigin('')).toBe(false)
    expect(isConfigOrigin('foo')).toBe(false)
    expect(isConfigOrigin('root')).toBe(false)
    expect(isConfigOrigin('project')).toBe(false)
  })
})
