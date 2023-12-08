import { Log } from '../../src/logger'

describe('Log', () => {
  const mockDate = new Date('2021-01-01T00:00:00.000Z')
  const timestamp = mockDate.toJSON()

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeAll(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as Date)
  })

  describe('.print()', () => {
    it('should print the correct number of items', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation()

      const log = new Log()
      log.add('test', 0)
      log.add('test 2', 0)

      log.print()

      expect(spy).toHaveBeenCalledTimes(2)
    })
  })

  describe('.toJSON()', () => {
    it('should return the log items', () => {
      const expected = [
        {
          indent: 0,
          msg: '[generator] test',
          raw: 'test',
          timestamp,
        },
        {
          indent: 0,
          msg: '[generator] test 2',
          raw: 'test 2',
          timestamp,
        },
      ]

      const log = new Log()
      log.add('test', 0)
      log.add('test 2', 0)
      const actual = log.toJSON()

      expect(actual).toStrictEqual(expected)
    })
  })
})
