import { LogItem } from '../../src/logger'

describe('LogItem', () => {
  const mockDate = new Date('2021-01-01T00:00:00.000Z')
  const timestamp = mockDate.toJSON()

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeAll(() => {
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as Date)
  })

  describe('constructor', () => {
    it('should create a log item', () => {
      const expected = {
        indent: 0,
        msg: '[generator] test',
        raw: 'test',
        timestamp,
      }

      const actual = new LogItem('test', 0)

      expect(actual.toJSON()).toStrictEqual(expected)
    })

    it('should remove the prefix', () => {
      const expected = {
        indent: 0,
        msg: '[generator] test',
        raw: 'test',
        timestamp,
      }

      const actual = new LogItem('[generator] test', 0)

      expect(actual.toJSON()).toStrictEqual(expected)
    })
  })

  describe('.msg', () => {
    it('should return the message', () => {
      const expected = '[generator] test'

      const item = new LogItem('test', 0)
      const actual = item.msg

      expect(actual).toBe(expected)
    })

    it('should return the message with indentation', () => {
      const expected = '[generator]     test'

      const item = new LogItem('test', 2)
      const actual = item.msg

      expect(actual).toBe(expected)
    })
  })

  describe('.msgWithTimestamp', () => {
    it('should return the message with timestamp', () => {
      const expected = `${timestamp} [generator] test`

      const item = new LogItem('test', 0)
      const actual = item.msgWithTimestamp

      expect(actual).toBe(expected)
    })

    it('should return the message with timestamp and indentation', () => {
      const expected = `${timestamp} [generator]     test`

      const item = new LogItem('test', 2)
      const actual = item.msgWithTimestamp

      expect(actual).toBe(expected)
    })
  })

  describe('.timestamp', () => {
    it('should return the timestamp', () => {
      const item = new LogItem('test', 0)
      const actual = item.timestamp

      expect(actual).toBe(timestamp)
    })
  })

  describe('.print', () => {
    it('should print the message', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation()

      const item = new LogItem('test', 0)
      item.print()

      expect(spy).toHaveBeenCalledWith('[generator] test')
    })

    it('should print the message with timestamp', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation()

      const item = new LogItem('test', 0)
      item.print({ timestamp: true })

      expect(spy).toHaveBeenCalledWith(`${timestamp} [generator] test`)
    })
  })
})
