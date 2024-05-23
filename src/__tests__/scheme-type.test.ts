import { SEALLibrary } from '../implementation/seal'
import SEAL from '../throws_wasm_node_umd'
let seal: SEALLibrary
beforeAll(async () => {
  seal = await SEAL()
})

describe('SchemeType', () => {
  test('It should be a static instance', () => {
    expect(seal.SchemeType).toBeDefined()
    expect(typeof seal.SchemeType.constructor).toBe('function')
    expect(seal.SchemeType).toBeInstanceOf(Object)
    expect(seal.SchemeType.constructor).toBe(Object)
    expect(seal.SchemeType.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(seal.SchemeType).toHaveProperty('none')
    expect(seal.SchemeType).toHaveProperty('bfv')
    expect(seal.SchemeType).toHaveProperty('ckks')
    expect(seal.SchemeType).toHaveProperty('bgv')
  })
  test('It should return type none', () => {
    const schemeType = seal.SchemeType.none
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(seal.SchemeType.none.constructor)
    expect(seal.SchemeType.none.constructor.name).toBe('SchemeType_none')
  })
  test('It should return type bfv', () => {
    const schemeType = seal.SchemeType.bfv
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(seal.SchemeType.bfv.constructor)
    expect(seal.SchemeType.bfv.constructor.name).toBe('SchemeType_bfv')
  })
  test('It should return type ckks', () => {
    const schemeType = seal.SchemeType.ckks
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(seal.SchemeType.ckks.constructor)
    expect(seal.SchemeType.ckks.constructor.name).toBe('SchemeType_ckks')
  })
  test('It should return type bgv', () => {
    const schemeType = seal.SchemeType.bgv
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(seal.SchemeType.bgv.constructor)
    expect(seal.SchemeType.bgv.constructor.name).toBe('SchemeType_bgv')
  })
})
