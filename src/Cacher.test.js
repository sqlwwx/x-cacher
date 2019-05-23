import { sleep } from 'pure-func/promise'
import Redis from 'ioredis'
import Cacher from './index'

jest.setTimeout(1000 * 60)

/* eslint-env jest */
describe('Cacher', () => {
  it('1 level', async () => {
    let cacher = new Cacher([{ type: 'memory' }])
    await cacher.clear('key')
    expect(await cacher.get('key')).toEqual(null)
    expect(await cacher.get('key', () => 1, 3000)).toEqual(1)
    await sleep(1000)
    expect(await cacher.get('key')).toEqual(1)
    await sleep(3000)
    expect(await cacher.get('key')).toEqual(null)
    cacher = new Cacher([{ type: 'redis', client: new Redis() }])
    await cacher.cache.clear('key')
    expect(await cacher.get('key')).toEqual(null)
    expect(await cacher.get('key', () => 1, 3000)).toEqual(1)
    await sleep(1000)
    expect(await cacher.get('key')).toEqual(1)
    await sleep(3000)
    expect(await cacher.get('key')).toEqual(null)
  })
  it('2 level', async () => {
    const key = 'key'
    const cacher = new Cacher([{ type: 'memory', expire: 5000 }, { type: 'redis', expire: 10000, client: new Redis() }])
    const fullKey = cacher.cache.buildKey(key)
    await cacher.clear(key)
    expect(await cacher.get(key)).toEqual(null)
    expect(await cacher.get(key, () => 2)).toEqual(2)
    expect(await cacher.get(key, () => 2)).toEqual(2)
    await sleep(1000)
    expect(await cacher.get(key)).toEqual(2)
    expect(await cacher.cache.loadFromCache(fullKey)).toEqual(2)
    await cacher.cache.clear(key)
    expect(await cacher.cache.loadFromCache(fullKey)).toEqual(null)
    expect(await cacher.cache.get(key)).toEqual(2)
    expect(await cacher.cache.loadFromCache(fullKey)).toEqual(2)
    expect(await cacher.get(key)).toEqual(2)
    expect(await cacher.get(key)).toEqual(2)
    expect(await cacher.get(key, () => 2)).toEqual(2)
    expect(await cacher.get(key, () => 2)).toEqual(2)
    await cacher.clear(key)
    expect(await cacher.cache.loadFromCache(fullKey)).toEqual(null)
  })
  it('3 level', async () => {
    const key = 'key3'
    const cacher = new Cacher([{
      type: 'memory', expire: 2000
    }, {
      type: 'redis', expire: 4000, client: new Redis(), prefix: 'level2cache'
    }, {
      type: 'redis', expire: 6000, client: new Redis(), prefix: 'level3cache'
    }])
    const fullKey0 = cacher.cache.buildKey(key)
    const fullKey1 = cacher.cache.parent.buildKey(key)
    const fullKey2 = cacher.cache.parent.parent.buildKey(key)
    expect(fullKey0).toEqual('key3')
    expect(fullKey1).toEqual('level2cache:key3')
    expect(fullKey2).toEqual('level3cache:key3')
    expect(await cacher.get(key)).toEqual(null)
    expect(await cacher.get(key, () => 3)).toEqual(3)
    expect(await cacher.cache.loadFromCache(fullKey0)).toEqual(3)
    expect(await cacher.cache.parent.loadFromCache(fullKey1)).toEqual(3)
    expect(await cacher.cache.parent.parent.loadFromCache(fullKey2)).toEqual(3)
    await cacher.cache.clear(key)
    expect(await cacher.cache.loadFromCache(fullKey0)).toEqual(null)
    expect(await cacher.get(key)).toEqual(3)
    expect(await cacher.cache.loadFromCache(fullKey0)).toEqual(3)
    await cacher.cache.clear(key)
    await cacher.cache.parent.clear(key)
    expect(await cacher.cache.loadFromCache(fullKey0)).toEqual(null)
    expect(await cacher.cache.parent.loadFromCache(fullKey1)).toEqual(null)
    expect(await cacher.get(key)).toEqual(3)
    expect(await cacher.cache.loadFromCache(fullKey0)).toEqual(3)
    expect(await cacher.cache.parent.loadFromCache(fullKey1)).toEqual(3)
    await cacher.clear(key)
    expect(await cacher.cache.loadFromCache(fullKey0)).toEqual(null)
    expect(await cacher.cache.parent.loadFromCache(fullKey1)).toEqual(null)
    expect(await cacher.cache.parent.parent.loadFromCache(fullKey2)).toEqual(null)
  })
  it('getAndSave', async () => {
    const key = 'key1'
    const cache = new Cacher([{
      type: 'redis',
      client: new Redis(),
      prefix: 'testGetAndSave',
      expire: 2000
    }])
    expect(await cache.get(key, () => 1, 1000)).toEqual(1)
    await sleep(1500)
    expect(await cache.get(key)).toEqual(null)
    expect(await cache.get(key, () => 1, 1000)).toEqual(1)
    await sleep(500)
    expect(await cache.getAndSave(key, null, 1000)).toEqual(1)
    await sleep(500)
    expect(await cache.getAndSave(key, null, 1000)).toEqual(1)
    await sleep(500)
    expect(await cache.getAndSave(key, null, 1000)).toEqual(1)
    await sleep(1500)
    expect(await cache.getAndSave(key)).toEqual(null)
  })
})
