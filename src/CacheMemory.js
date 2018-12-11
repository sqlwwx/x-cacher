import { Cache } from 'memory-cache'
import CacheBase from './CacheBase'

export default class CacheMemoryLRU extends CacheBase {
  constructor (options = {}) {
    super(options)
    this.client = new Cache()
  }

  static type = 'memory';

  async loadFromCache (fullKey) {
    return this.client.get(fullKey) || null
  }

  async saveToCache (fullKey, data, expire) {
    return this.client.put(fullKey, data, expire)
  }

  async clear (key) {
    if (key) {
      this.client.del(this.buildKey(key))
    } else {
      this.client.clear()
    }
  }
}
