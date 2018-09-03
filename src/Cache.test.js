import CacheMemory from './CacheMemory'
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
  Object.entries(caches).forEach(([name, cache]) => {
    describe(name, () => {
      it('loadFromCache', async () => {
        const key = 'key0'
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
        expect(await cache.loadFromCache(key)).toEqual(null)
        if (name === 'memory') {
          await cache.saveToCache(key, 'value')
          expect(await cache.loadFromCache(key)).toEqual('value')
          await cache.clear()
          expect(await cache.loadFromCache(key)).toEqual(null)
        }
      })
    })
  })
})
