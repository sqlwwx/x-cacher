export default (cacher, cacheKeyFn) => {
  return (targer, methodName, descriptor) => {
    const { value: oldFunc } = descriptor
    async function newFunc (...args) {
      const cacheKey = cacheKeyFn
        ? cacheKeyFn(this, methodName, ...args)
        : `${methodName}_${JSON.stringify(args)}`
      return cacher.get(cacheKey, () => oldFunc.call(this, ...args))
    }
    return {
      ...descriptor,
      value: newFunc
    }
  }
}
