import { defineConfig } from '../src/config'
import { UserConfig } from '../src/types'

describe('defineConfig', () => {
  it('should return the provided config', () => {
    const userConfig: Partial<UserConfig> = {
      createDir: false,
      safeMode: false,
      safetyDirName: '_ai_generated',
    }
    const config = defineConfig(userConfig)
    expect(config).toStrictEqual(userConfig)
  })
})
