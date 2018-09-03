import CacheBase from './CacheBase'
import { promisify } from 'util'

export default class CacheRedis extends CacheBase {
  constructor (options = {}) {
    super(options)
    this.prefix = options.prefix || 'CacheRedis'
    this.client = options.client
    this.getAsync = promisify(this.client.get).bind(this.client)
    this.setAsync = promisify(this.client.set).bind(this.client)
    this.keysAsync = promisify(this.client.keys).bind(this.client)
    this.delAsync = promisify(this.client.del).bind(this.client)
  }
  static type = 'redis';
  async loadFromCache (fullKey) {
    let value = await this.getAsync(fullKey)
    try {
      value = JSON.parse(value)
    } catch (e) {
    }
    return value
  }
  async saveToCache (fullKey, data, expire) {
    return this.setAsync(fullKey, JSON.stringify(data), 'EX', (expire || this.expire) / 1000)
  }
  async clear (fullKey) {
    const keys = await this.keysAsync(fullKey || (this.prefix + '*'))
    return Promise.all(keys.map(key => {
      return this.delAsync(key)
    }))
  }
}
