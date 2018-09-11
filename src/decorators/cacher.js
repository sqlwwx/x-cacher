export default (cacher, cacheKeyFn) => {
  return (targer, methodName, descriptor) => {
    const oldValue = descriptor.value
    descriptor.value = async function () {
      const cacheKey = cacheKeyFn ? cacheKeyFn(this, methodName) : methodName
      return cacher.get(cacheKey, () => {
        return oldValue.apply(this, arguments)
      })
    }
    return descriptor
  }
}
