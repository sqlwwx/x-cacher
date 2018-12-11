import { sleep } from 'pure-func/promise'
import Redis from 'ioredis'
import CacheMemory from './CacheMemory'
import CacheMemoryLRU from './CacheMemoryLRU'
import CacheBase from './CacheBase'
import CacheRedis from './CacheRedis'

const client = new Redis()
const caches = {
  redis: new CacheRedis({ client }),
  'memory-lru': new CacheMemoryLRU(),
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
  })
  Object.entries(caches).forEach(([name, cache]) => {
    describe(name, () => {
      it('loadFromCache', async () => {
        const key = 'key0'
        const fullKey = cache.buildKey(key)
        await cache.clear(key)
        expect(await cache.loadFromCache(fullKey)).toEqual(null)
        await cache.saveToCache(fullKey, 'value', 3000)
        expect(await cache.loadFromCache(fullKey)).toEqual('value')
        await sleep(1000)
        expect(await cache.loadFromCache(fullKey)).toEqual('value')
        await sleep(2500)
        expect(await cache.loadFromCache(fullKey)).toEqual(null)
        await cache.saveToCache(fullKey, 'value')
        expect(await cache.loadFromCache(fullKey)).toEqual('value')
        await cache.clear(key)
        await cache.clear()
        expect(await cache.loadFromCache(fullKey)).toEqual(null)
        expect(await cache.loadFromCache(fullKey)).toEqual(null)
        await cache.saveToCache(fullKey, 'value')
        expect(await cache.loadFromCache(fullKey)).toEqual('value')
        await cache.clear()
        expect(await cache.loadFromCache(fullKey)).toEqual(null)
      })
    })
  })
  it('getAndSave', async () => {
    const key = 'key1'
    const cache = new CacheRedis({
      client,
      prefix: 'testGetAndSave',
      expire: 2000,
      parent: new CacheRedis({
        client,
        prefix: 'testGetAndSave1',
        expire: 2000
      })
    })
    expect(await cache.get(key, () => 1, 1000, 1000)).toEqual(1)
    await sleep(1500)
    expect(await cache.get(key)).toEqual(null)
    expect(await cache.get(key, () => 1, 1000, 1000)).toEqual(1)
    await sleep(500)
    expect(await cache.getAndSave(key, null, 1000, 1000)).toEqual(1)
    await sleep(500)
    expect(await cache.getAndSave(key, null, 1000, 1000)).toEqual(1)
    await sleep(500)
    expect(await cache.getAndSave(key, null, 1000, 1000)).toEqual(1)
    await sleep(1500)
    expect(await cache.getAndSave(key)).toEqual(null)
    expect(await cache.getAndSave(key, () => 1, 1000)).toEqual(1)
  })
})
