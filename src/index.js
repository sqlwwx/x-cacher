import Cacher from './Cacher'
import CacheMemory from './CacheMemory'
import CacheMemoryLRU from './CacheMemoryLRU'
import CacheRedis from './CacheRedis'

Cacher.regCache(CacheMemoryLRU)
Cacher.regCache(CacheMemory)
Cacher.regCache(CacheRedis)

export default Cacher
