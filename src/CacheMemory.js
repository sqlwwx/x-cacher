/* eslint valid-jsdoc: "error" */
import { Cache } from 'memory-cache'
import CacheBase from './CacheBase'

/**
 * CacheMemory
 *
 * @extends {CacheBase}
 */
class CacheMemory extends CacheBase {
  /**
   * @param {object} options={}
   * @param {string} options.prefix=CacheMemory cache prefix
   * @param {CacheBase} options.parent parent cache
   * @param {number} options.expire=60000 cahce expire
   */
  constructor (options = {}) {
    super(options)
    this.client = new Cache()
  }

  static type = 'memory';

  /**
   * @override
   */
  async loadFromCache (fullKey) {
    return this.client.get(fullKey) || null
  }

  /**
   * @override
   */
  async saveToCache (fullKey, data, expire) {
    return this.client.put(fullKey, data, expire)
  }

  /**
   * @override
   */
  async clear (key) {
    if (key) {
      this.client.del(this.buildKey(key))
    } else {
      this.client.clear()
    }
  }
}

export default CacheMemory
