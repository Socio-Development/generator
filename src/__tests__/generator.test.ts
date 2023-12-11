import fs from 'fs'
import { resolve } from 'path'
import { mergeConfig } from '../config'
import { preparePath } from '../generator'
import { Config, UserConfig } from '../types'

describe('preparePath', () => {
  const getConfig = (userOptions: UserConfig = {}): Config =>
    mergeConfig(userOptions)

  it('should return an empty array if the path exists', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    const config = getConfig()
    const path = 'src/types/test.ts'
    const res = preparePath(config, path)

    expect(res.missingPaths).toEqual([])
  })

  it('should return an array of missing paths if the path does not exist', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)

    const config = getConfig()
    const path = 'src/types/test.ts'
    const res = preparePath(config, path)

    res.missingPaths.map((path) => path.replace(resolve('.'), ''))

    expect(res.missingPaths).toEqual([
      'src/types/_generated',
      'src/types',
      'src',
    ])
  })

  it('should omit safetyDirName if safe mode is off', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)

    const config = getConfig({ safeMode: false })
    const path = 'src/types/test.ts'
    const res = preparePath(config, path)

    res.missingPaths.map((path) => path.replace(resolve('.'), ''))

    expect(res.missingPaths).toEqual(['src/types', 'src'])
  })
})
