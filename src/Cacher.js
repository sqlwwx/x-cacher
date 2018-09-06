import assert from 'assert'

export default class Cacher {
  constructor (caches) {
    this.cache = caches.reverse().reduce((cache, cacheOptions) => {
      assert(cacheOptions.type, `cache.type should exists`)
      const Cache = Cacher.Caches[cacheOptions.type]
      assert(Cache, `Cache[${cacheOptions.type}] should exists`)
      cacheOptions.parent = cache
      return new Cache(cacheOptions)
    }, null)
  }
  static Caches = Object.create(null)
  static regCache (Cache, type) {
    this.Caches[type || Cache.type] = Cache
  }
  async clear (key) {
    await this.cache.clear(key)
    if (this.cache.parent) {
      await this.cache.parent.clear(key)
      if (this.cache.parent.parent) {
        await this.cache.parent.parent.clear(key)
      }
    }
  }
  async getAndSave (key, fn, ...expires) {
    return this.cache.getAndSave(key, fn, ...expires)
  }
  async get (key, fn, ...expires) {
    return this.cache.get(key, fn, ...expires)
  }
}
