import { Seal } from '../../index.js'

let Morfix = null
beforeAll(async () => {
  Morfix = await Seal
})

describe('SchemeType', () => {
  test('It should be a static instance', () => {
    expect(Morfix).toHaveProperty('SchemeType')
    expect(Morfix.SchemeType).toBeDefined()
    expect(typeof Morfix.SchemeType.constructor).toBe('function')
    expect(Morfix.SchemeType).toBeInstanceOf(Object)
    expect(Morfix.SchemeType.constructor).toBe(Object)
    expect(Morfix.SchemeType.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(Morfix.SchemeType).toHaveProperty('none')
    expect(Morfix.SchemeType).toHaveProperty('BFV')
    expect(Morfix.SchemeType).toHaveProperty('CKKS')
  })
  test('It should return type none', () => {
    const schemeType = Morfix.SchemeType.none
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(Morfix.SchemeType.none.constructor)
    expect(Morfix.SchemeType.none.constructor.name).toBe('SchemeType_none')
  })
  test('It should return type BFV', () => {
    const schemeType = Morfix.SchemeType.BFV
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(Morfix.SchemeType.BFV.constructor)
    expect(Morfix.SchemeType.BFV.constructor.name).toBe('SchemeType_BFV')
  })
  test('It should return type CKKS', () => {
    const schemeType = Morfix.SchemeType.CKKS
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(Morfix.SchemeType.CKKS.constructor)
    expect(Morfix.SchemeType.CKKS.constructor.name).toBe('SchemeType_CKKS')
  })
})
