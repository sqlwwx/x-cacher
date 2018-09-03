import CacheMemory from './CacheMemory'
import CacheBase from './CacheBase'
import CacheRedis from './CacheRedis'
import { sleep } from 'pure-func/promise'
import redis from 'redis'

const client = redis.createClient()
const caches = {
  redis: new CacheRedis({ client }),
  memory: new CacheMemory()
}

/* eslint-env jest */
describe('Cache', () => {
  describe('CacheBase', () => {
    it('buildKey', () => {
      const cacheBase0 = new CacheBase({ prefix: 'test' })
      const cacheBase1 = new CacheBase()
      expect(cacheBase0.buildKey('key')).toEqual('test:key')
      expect(cacheBase1.buildKey('key')).toEqual('CacheBase:key')
    })
    it('require func', () => {
      const cacheBase = new CacheBase()
      expect(cacheBase.loadFromCache()).rejects.toHaveProperty('message', 'require func loadFromCache')
      expect(cacheBase.saveToCache()).rejects.toHaveProperty('message', 'require func saveToCache')
      expect(cacheBase.clear()).rejects.toHaveProperty('message', 'require func clear')
    })
  })
  Object.entries(caches).forEach(([name, cache]) => {
    describe(name, () => {
      it('loadFromCache', async () => {
        const key = 'key0'
        const fullKey = cache.buildKey(key)
        await cache.clear(key)
        expect(await cache.loadFromCache(key)).toEqual(null)
        await cache.saveToCache(key, 'value', 3000)
        expect(await cache.loadFromCache(key)).toEqual('value')
        await sleep(1000)
        expect(await cache.loadFromCache(key)).toEqual('value')
        await sleep(2000)
        expect(await cache.loadFromCache(key)).toEqual(null)
        await cache.saveToCache(key, 'value')
        expect(await cache.loadFromCache(key)).toEqual('value')
        await cache.clear(key)
        await cache.clear()
        expect(await cache.loadFromCache(key)).toEqual(null)
        expect(await cache.loadFromCache(fullKey)).toEqual(null)
        await cache.saveToCache(fullKey, 'value')
        expect(await cache.loadFromCache(fullKey)).toEqual('value')
        await cache.clear()
        expect(await cache.loadFromCache(fullKey)).toEqual(null)
      })
    })
  })
})
