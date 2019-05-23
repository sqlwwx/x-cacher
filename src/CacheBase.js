/* eslint valid-jsdoc: "error" */

/**
 * CacheBase
 */
class CacheBase {
  /**
   * @param {object} options={}
   * @param {string} options.prefix=CacheBase cache prefix
   * @param {CacheBase} options.parent parent cache
   * @param {number} options.expire=60000 cahce expire
   */
  constructor (options = {}) {
    this.prefix = options.prefix
    this.parent = options.parent
    this.expire = options.expire || 60000
  }

  /**
   * load data from cache
   * @abstract
   *
   * @function
   * @name CacheBase#loadFromCache
   * @param {string} fullKey  cache full key
   * @returns {Promise} cache data
   */

  /**
   * save data to cache
   * @abstract
   *
   * @function
   * @name CacheBase#saveToCache
   * @param {string} fullKey  cache full key
   * @param {object} data data to save
   * @param {number} expire
   * @returns {Promise}
   */

  /**
   * clear cache data by key
   * @abstract
   *
   * @function
   * @name CacheBase#clear
   * @param {string} key cache key
   * @returns {Promise}
   */

  /**
   * build full key
   *
   * @param {string} key cache key
   * @returns {string} full cache key
   */
  buildKey (key) {
    if (this.prefix) {
      return `${this.prefix}:${key}`
    }
    return `${key}`
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

  /**
   * get data and refresh cache
   *
   * @param {string} key cache key
   * @param {function} loadFunc load data function
   * @param {...number} ...expires caches's expire
   * @returns {Promise} data
   */
  async getAndSave (key, loadFunc, ...expires) {
    return this.doGet(true, key, loadFunc, expires)
  }

  /**
   * get data
   *
   * @param {string} key cache key
   * @param {function} loadFunc load data func
   * @param {...number} ...expires caches's expire
   * @returns {Promise} data
   */
  async get (key, loadFunc, ...expires) {
    return this.doGet(false, key, loadFunc, expires)
  }
}

export default CacheBase
