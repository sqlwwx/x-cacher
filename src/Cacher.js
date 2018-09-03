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
  async loadFromCache (key, fn, expire) {
    return this.cache.get(key, fn, expire)
  }
}
