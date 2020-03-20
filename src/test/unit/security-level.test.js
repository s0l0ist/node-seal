import { Seal } from '../../index.js'

let Morfix = null
beforeAll(async () => {
  Morfix = await Seal
})

describe('SecurityLevel', () => {
  test('It should be a static instance', () => {
    expect(Morfix).toHaveProperty('SecurityLevel')
    expect(Morfix.SecurityLevel).not.toBeUndefined()
    expect(typeof Morfix.SecurityLevel.constructor).toBe('function')
    expect(Morfix.SecurityLevel).toBeInstanceOf(Object)
    expect(Morfix.SecurityLevel.constructor).toBe(Object)
    expect(Morfix.SecurityLevel.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(Morfix.SecurityLevel).toHaveProperty('none')
    expect(Morfix.SecurityLevel).toHaveProperty('tc128')
    expect(Morfix.SecurityLevel).toHaveProperty('tc192')
    expect(Morfix.SecurityLevel).toHaveProperty('tc256')
  })
  test('It should return type none', async () => {
    const securityLevel = Morfix.SecurityLevel.none
    expect(securityLevel).not.toBeUndefined()
    expect(typeof securityLevel.constructor).toBe('function')
    expect(securityLevel).toBeInstanceOf(Object)
    expect(securityLevel.constructor).toBe(
      Morfix.SecurityLevel.none.constructor
    )
    expect(Morfix.SecurityLevel.none.constructor.name).toBe('SecLevelType_none')
  })
  test('It should return type tc128', async () => {
    const securityLevel = Morfix.SecurityLevel.tc128
    expect(securityLevel).not.toBeUndefined()
    expect(typeof securityLevel.constructor).toBe('function')
    expect(securityLevel).toBeInstanceOf(Object)
    expect(securityLevel.constructor).toBe(
      Morfix.SecurityLevel.tc128.constructor
    )
    expect(Morfix.SecurityLevel.tc128.constructor.name).toBe(
      'SecLevelType_tc128'
    )
  })
  test('It should return type tc192', async () => {
    const securityLevel = Morfix.SecurityLevel.tc192
    expect(securityLevel).not.toBeUndefined()
    expect(typeof securityLevel.constructor).toBe('function')
    expect(securityLevel).toBeInstanceOf(Object)
    expect(securityLevel.constructor).toBe(
      Morfix.SecurityLevel.tc192.constructor
    )
    expect(Morfix.SecurityLevel.tc192.constructor.name).toBe(
      'SecLevelType_tc192'
    )
  })
  test('It should return type tc256', async () => {
    const securityLevel = Morfix.SecurityLevel.tc256
    expect(securityLevel).not.toBeUndefined()
    expect(typeof securityLevel.constructor).toBe('function')
    expect(securityLevel).toBeInstanceOf(Object)
    expect(securityLevel.constructor).toBe(
      Morfix.SecurityLevel.tc256.constructor
    )
    expect(Morfix.SecurityLevel.tc256.constructor.name).toBe(
      'SecLevelType_tc256'
    )
  })
})
