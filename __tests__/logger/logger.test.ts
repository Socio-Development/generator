import { Logger } from '../../src/logger'

describe('Logger', () => {
  beforeEach(() => {
    Logger.reset()
  })

  it('should add a log', () => {
    expect(Logger.log.length).toEqual(0)
    Logger.add('test')
    expect(Logger.log.length).toEqual(1)
  })

  it('should add a log with indentation', () => {
    const expected = '[generator]   test'

    Logger.startProcess()
    Logger.add('test')
    Logger.endProcess()

    // @ts-ignore
    const actual = Logger.log.items[1].msg

    expect(actual).toBe(expected)
  })

  it('should print the logs', () => {
    const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})

    Logger.add('test')
    Logger.startProcess()
    Logger.add('test')
    Logger.endProcess()

    Logger.print()

    expect(consoleLog).toHaveBeenCalledTimes(4)
    jest.restoreAllMocks()
  })
})
