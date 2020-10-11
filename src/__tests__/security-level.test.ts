import SEAL from '../throws_wasm_node'
import { SEALLibrary } from 'implementation/seal'
let seal: SEALLibrary
beforeAll(async () => {
  seal = await SEAL()
})

describe('SecurityLevel', () => {
  test('It should be a static instance', () => {
    expect(seal.SecurityLevel).toBeDefined()
    expect(typeof seal.SecurityLevel.constructor).toBe('function')
    expect(seal.SecurityLevel).toBeInstanceOf(Object)
    expect(seal.SecurityLevel.constructor).toBe(Object)
    expect(seal.SecurityLevel.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(seal.SecurityLevel).toHaveProperty('none')
    expect(seal.SecurityLevel).toHaveProperty('tc128')
    expect(seal.SecurityLevel).toHaveProperty('tc192')
    expect(seal.SecurityLevel).toHaveProperty('tc256')
  })
  test('It should return type none', async () => {
    const securityLevel = seal.SecurityLevel.none
    expect(securityLevel).toBeDefined()
    expect(typeof securityLevel.constructor).toBe('function')
    expect(securityLevel).toBeInstanceOf(Object)
    expect(securityLevel.constructor).toBe(seal.SecurityLevel.none.constructor)
    expect(seal.SecurityLevel.none.constructor.name).toBe('SecLevelType_none')
  })
  test('It should return type tc128', async () => {
    const securityLevel = seal.SecurityLevel.tc128
    expect(securityLevel).toBeDefined()
    expect(typeof securityLevel.constructor).toBe('function')
    expect(securityLevel).toBeInstanceOf(Object)
    expect(securityLevel.constructor).toBe(seal.SecurityLevel.tc128.constructor)
    expect(seal.SecurityLevel.tc128.constructor.name).toBe('SecLevelType_tc128')
  })
  test('It should return type tc192', async () => {
    const securityLevel = seal.SecurityLevel.tc192
    expect(securityLevel).toBeDefined()
    expect(typeof securityLevel.constructor).toBe('function')
    expect(securityLevel).toBeInstanceOf(Object)
    expect(securityLevel.constructor).toBe(seal.SecurityLevel.tc192.constructor)
    expect(seal.SecurityLevel.tc192.constructor.name).toBe('SecLevelType_tc192')
  })
  test('It should return type tc256', async () => {
    const securityLevel = seal.SecurityLevel.tc256
    expect(securityLevel).toBeDefined()
    expect(typeof securityLevel.constructor).toBe('function')
    expect(securityLevel).toBeInstanceOf(Object)
    expect(securityLevel.constructor).toBe(seal.SecurityLevel.tc256.constructor)
    expect(seal.SecurityLevel.tc256.constructor.name).toBe('SecLevelType_tc256')
  })
})
