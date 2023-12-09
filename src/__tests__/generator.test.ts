import defaultConfig from '../defaultConfig'
import { preparePath } from '../generator'
import { Config } from '../types'

describe('preparePath', () => {
  const config: Config = {
    ...defaultConfig,
    origin: 'default',
  }

  it('should return an empty array if the path exists', () => {
    const res = preparePath(config, 'src/__tests__/generator.test.ts')
    expect(res.missingPaths).toEqual([])
  })

  it('should return an array of missing paths if the path does not exist', () => {
    const res = preparePath(config, 'src/__tests__/missingPath/test.ts')
    expect(res.missingPaths).toEqual(['src/__tests__/missingPath'])
  })
})
