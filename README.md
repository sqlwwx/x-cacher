# x-cacher

[![Build Status](https://travis-ci.org/sqlwwx/x-cacher.svg?branch=master)](https://travis-ci.org/sqlwwx/x-cacher)
[![Coverage Status](https://coveralls.io/repos/github/sqlwwx/x-cacher/badge.svg?branch=master)](https://coveralls.io/github/sqlwwx/x-cacher?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/sqlwwx/x-cacher.svg)](https://greenkeeper.io/)
![npm](https://img.shields.io/npm/dt/x-cacher.svg)
[![codebeat badge](https://codebeat.co/badges/6af1b073-049c-49bd-9968-b5cf4c10381f)](https://codebeat.co/projects/github-com-sqlwwx-x-cacher-master)

## sample
```
import { Cacher, cacherDes } from 'x-cacher'

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
```
