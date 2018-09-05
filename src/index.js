import Cacher from './Cacher'
import CacheMemory from './CacheMemory'
import CacheRedis from './CacheRedis'

Cacher.regCache(CacheMemory)
Cacher.regCache(CacheRedis)

export default Cacher
