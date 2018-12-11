import { promisify } from 'util'
import Redis from 'ioredis'
import CacheBase from './CacheBase'

export default class CacheRedis extends CacheBase {
  constructor (options = {}) {
    super(options)
    this.prefix = options.prefix || 'CacheRedis'
    this.client = options.client
    if (!this.client) {
      this.client = new Redis()
    }
    this.getAsync = promisify(this.client.get).bind(this.client)
    this.setAsync = promisify(this.client.set).bind(this.client)
    this.keysAsync = promisify(this.client.keys).bind(this.client)
    this.delAsync = promisify(this.client.del).bind(this.client)
  }

  static type = 'redis';

  async loadFromCache (fullKey) {
    let value = await this.getAsync(fullKey)
    if (value) {
      value = JSON.parse(value)
    }
    return value
  }

  async saveToCache (fullKey, data, expire) {
    return this.setAsync(fullKey, JSON.stringify(data), 'EX', (expire || this.expire) / 1000)
  }

  async clear (key) {
    const keys = await this.keysAsync(`${this.prefix}:${key || ''}*`)
    return Promise.all(keys.map(existKey => {
      return this.delAsync(existKey)
    }))
  }
}
