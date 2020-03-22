import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { SchemeType } from '../../components'

let SchemeTypeObject = null
beforeAll(async () => {
  await Seal
  const lib = getLibrary()
  SchemeTypeObject = SchemeType(lib)()
})

describe('SchemeType', () => {
  test('It should be a static instance', () => {
    expect(SchemeTypeObject).toBeDefined()
    expect(typeof SchemeTypeObject.constructor).toBe('function')
    expect(SchemeTypeObject).toBeInstanceOf(Object)
    expect(SchemeTypeObject.constructor).toBe(Object)
    expect(SchemeTypeObject.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(SchemeTypeObject).toHaveProperty('none')
    expect(SchemeTypeObject).toHaveProperty('BFV')
    expect(SchemeTypeObject).toHaveProperty('CKKS')
  })
  test('It should return type none', () => {
    const schemeType = SchemeTypeObject.none
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(SchemeTypeObject.none.constructor)
    expect(SchemeTypeObject.none.constructor.name).toBe('SchemeType_none')
  })
  test('It should return type BFV', () => {
    const schemeType = SchemeTypeObject.BFV
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(SchemeTypeObject.BFV.constructor)
    expect(SchemeTypeObject.BFV.constructor.name).toBe('SchemeType_BFV')
  })
  test('It should return type CKKS', () => {
    const schemeType = SchemeTypeObject.CKKS
    expect(schemeType).toBeDefined()
    expect(typeof schemeType.constructor).toBe('function')
    expect(schemeType).toBeInstanceOf(Object)
    expect(schemeType.constructor).toBe(SchemeTypeObject.CKKS.constructor)
    expect(SchemeTypeObject.CKKS.constructor.name).toBe('SchemeType_CKKS')
  })
})
