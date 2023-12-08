import { defineConfig } from '../src/config'

describe('defineConfig', () => {
  test('should return a config object', () => {
    const config = defineConfig({})
    expect(config).toHaveProperty('origin', 'function')
    expect(config).toHaveProperty('createDir', true)
    expect(config).toHaveProperty('safeMode', true)
    expect(config).toHaveProperty('safetyDirName', '_generated')
  })

  test('should override default values', () => {
    const config = defineConfig({
      createDir: false,
      safeMode: false,
      safetyDirName: 'custom',
    })
    expect(config).toHaveProperty('origin', 'function')
    expect(config).toHaveProperty('createDir', false)
    expect(config).toHaveProperty('safeMode', false)
    expect(config).toHaveProperty('safetyDirName', 'custom')
  })
})
