import fs from 'node:fs'
import { resolve } from 'node:path'
import { mergeConfig } from '../config'
import { prepareCode, preparePath } from '../generator'
import { Config, UserConfig } from '../types'

const codeInput = `
const greeting = 'Hello World!'
`
const codeInputNewline = `
const greeting = 'Hello World!'

`

describe('prepareCode', () => {
  it('should trim the input string and return it', () => {
    const expectedBefore = JSON.stringify("\nconst greeting = 'Hello World!'\n")
    const expectedAfter = JSON.stringify("const greeting = 'Hello World!'")

    const actualBefore = JSON.stringify(codeInput)
    const actualAfter = JSON.stringify(prepareCode(codeInput))

    expect(actualBefore).toBe(expectedBefore)
    expect(actualAfter).toBe(expectedAfter)
  })
  it('should not remove newlines intentionally added by the user', () => {
    const expectedBefore = JSON.stringify(
      "\nconst greeting = 'Hello World!'\n\n",
    )
    const expectedAfter = JSON.stringify("const greeting = 'Hello World!'\n")

    const actualBefore = JSON.stringify(codeInputNewline)
    const actualAfter = JSON.stringify(prepareCode(codeInputNewline))

    expect(actualBefore).toBe(expectedBefore)
    expect(actualAfter).toBe(expectedAfter)
  })
})

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
