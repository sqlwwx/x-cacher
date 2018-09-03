import CacheBase from './CacheBase'
import LRU from 'lru-cache'

export default class CacheMemory extends CacheBase {
  constructor (options = {}) {
    super(options)
    this.client = LRU(options.client || {})
  }
  static type = 'memory';
  async loadFromCache (fullKey) {
    return this.client.get(fullKey) || null
  }
  async saveToCache (fullKey, data, expire) {
    return this.client.set(fullKey, data, expire)
  }
  async clear (key) {
    if (key) {
      this.client.del(key)
    } else {
      this.reset()
    }
  }
}
