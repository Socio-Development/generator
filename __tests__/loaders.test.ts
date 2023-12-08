import { loadConfig } from '../src/loaders'

describe('loadConfig', () => {
  it('should load the default config if no config file is found', () => {
    const config = loadConfig()
    expect(config.origin).toEqual('default')
  })
})
