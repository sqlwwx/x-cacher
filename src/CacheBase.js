export default class CacheBase {
  constructor (options = {}) {
    this.prefix = options.prefix || 'CacheBase'
    this.parent = options.parent
    this.expire = options.expire || 60000
  }

  buildKey (key) {
    return this.prefix + ':' + key
  }

  async get (key, fn, expire) {
    return this.getWithFullKey(
      this.buildKey(key),
      fn, expire || this.expire
    )
  }

  async getWithFullKey (fullKey, fn, expire1, expire2, expire3) {
    let ret = await this.loadFromCache(fullKey)
    if (!ret) {
      if (this.parent) {
        ret = await this.parent.getWithFullKey(fullKey, fn, expire2, expire3)
      } else if (fn) {
        ret = await fn(this)
      }
      if (ret) {
        this.saveToCache(fullKey, ret, expire1 || this.expire)
      }
    }
    return ret
  }

  async loadFromCache (fullKey) {
    throw new Error('require func loadFromCache')
  }

  async saveToCache (fullKey, data, expire) {
    throw new Error('require func saveToCache')
  }

  async clear () {
    throw new Error('require func saveToCache')
  }
}
