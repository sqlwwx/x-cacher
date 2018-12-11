export default class CacheBase {
  constructor (options = {}) {
    this.prefix = options.prefix || 'CacheBase'
    this.parent = options.parent
    this.expire = options.expire || 60000
  }

  buildKey (key) {
    return this.prefix + ':' + key
  }

  async doGet (alwaysSave, key, fn, expires) {
    const fullKey = this.buildKey(key)
    let ret = await this.loadFromCache(fullKey)
    if (!ret) {
      if (this.parent) {
        ret = await this.parent.doGet(alwaysSave, key, fn, expires.splice(1))
      } else if (fn) {
        ret = await fn(this)
      }
      if (ret && !alwaysSave) {
        await this.saveToCache(fullKey, ret, expires[0] || this.expire)
      }
    }
    if (ret && alwaysSave) {
      await this.saveToCache(fullKey, ret, expires[0] || this.expire)
    }
    return ret
  }

  async getAndSave (key, fn, ...expires) {
    return this.doGet(true, key, fn, expires)
  }

  async get (key, fn, ...expires) {
    return this.doGet(false, key, fn, expires)
  }

  async loadFromCache (fullKey) {
    throw new Error('require func loadFromCache')
  }

  async saveToCache (fullKey, data, expire) {
    throw new Error('require func saveToCache')
  }

  async clear () {
    throw new Error('require func clear')
  }
}
