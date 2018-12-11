import CacheRedis from './CacheRedis'

jest.setTimeout(1000 * 60)

/* eslint-env jest */
describe('CacheRedis', () => {
  describe('with out options', () => {
    const cache = new CacheRedis()
    it('clear', async () => {
      await cache.clear('*')
    })
    it('loadFromCache', async () => {
      expect(await cache.loadFromCache('CacheRedis:test')).toEqual(null)
    })
    it('saveToCache', async () => {
      expect(await cache.saveToCache('CacheRedis:test', 1)).toEqual('OK')
      expect(await cache.loadFromCache('CacheRedis:test')).toEqual(1)
    })
  })
})
