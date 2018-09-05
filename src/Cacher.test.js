import Cacher from './index'
import { sleep } from 'pure-func/promise'
import redis from 'redis'

jest.setTimeout(1000 * 60)

/* eslint-env jest */
describe('Cacher', () => {
  it('1 level', async () => {
    const cacher = new Cacher([{ type: 'memory' }])
    await cacher.cache.clear('key')
    expect(await cacher.loadFromCache('key')).toEqual(null)
    expect(await cacher.loadFromCache('key', () => 1, 3000)).toEqual(1)
    await sleep(1000)
    expect(await cacher.loadFromCache('key')).toEqual(1)
    await sleep(3000)
    expect(await cacher.loadFromCache('key')).toEqual(null)
  })
  it('2 level', async () => {
    const key = 'key'
    const cacher = new Cacher([{ type: 'memory', expire: 5000 }, { type: 'redis', expire: 10000, client: redis.createClient() }])
    const fullKey = cacher.cache.buildKey(key)
    await cacher.cache.clear(key)
    await cacher.cache.parent.clear(key)
    expect(await cacher.loadFromCache(key)).toEqual(null)
    expect(await cacher.loadFromCache(key, () => 2)).toEqual(2)
    await sleep(1000)
    expect(await cacher.loadFromCache(key)).toEqual(2)
    expect(await cacher.cache.loadFromCache(fullKey)).toEqual(2)
    await cacher.cache.clear(fullKey)
    expect(await cacher.cache.loadFromCache(fullKey)).toEqual(null)
    expect(await cacher.cache.get(key)).toEqual(2)
    expect(await cacher.cache.loadFromCache(fullKey)).toEqual(2)
    expect(await cacher.loadFromCache(key)).toEqual(2)
    expect(await cacher.loadFromCache(key)).toEqual(2)
  })
})
