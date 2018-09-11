import Cacher from '..'
import cacherDes from './cacher'

const cacher = new Cacher([{ type: 'memory' }])

class Person {
  constructor (name) {
    this.name = name
  }
  @cacherDes(cacher, ({ name: personName }, methodName) => personName + ':' + methodName)
  async eat () {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(this.name + ' eat: '+ Math.random())
      }, 2000)
    })
  }
}

const personA = new Person('a')

jest.setTimeout(1000 * 60)

/* eslint-env jest */
describe('cacher', () => {
  it('eat', async () => {
    let startAt = Date.now()
    let ret = await personA.eat()
    expect(ret).toMatch(/^a eat: /)
    expect(Date.now() - startAt).toBeGreaterThanOrEqual(2000)
    startAt = Date.now()
    let ret2 = await personA.eat()
    expect(ret2).toMatch(/^a eat: /)
    expect(ret).toEqual(ret2)
    expect(Date.now() - startAt).toBeLessThan(1000)
  })
})
