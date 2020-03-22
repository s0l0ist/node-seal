import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { ParmsIdType } from '../../components'

let Morfix = null
let ParmsIdTypeObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  ParmsIdTypeObject = ParmsIdType(lib)(Morfix)
})

describe('ParmsIdType', () => {
  test('It should be a factory', () => {
    expect(ParmsIdTypeObject).toBeDefined()
    expect(typeof ParmsIdTypeObject.constructor).toBe('function')
    expect(ParmsIdTypeObject).toBeInstanceOf(Object)
    expect(ParmsIdTypeObject.constructor).toBe(Function)
    expect(ParmsIdTypeObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(ParmsIdTypeObject)
    Constructor()
    expect(Constructor).toBeCalledWith()
  })
  test('It should construct from an existing an instance', () => {
    const parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    parms.setPolyModulusDegree(4096)
    parms.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
    const context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = context.firstParmsId
    const Constructor = jest.fn(ParmsIdTypeObject)
    Constructor(parmsId.instance)
    expect(Constructor).toBeCalledWith(parmsId.instance)
  })
  test('It should have properties', () => {
    const parmsId = ParmsIdTypeObject()
    // Test properties
    expect(parmsId).toHaveProperty('instance')
    expect(parmsId).toHaveProperty('inject')
    expect(parmsId).toHaveProperty('delete')
    expect(parmsId).toHaveProperty('values')
  })
  test('It should have an instance', () => {
    const parmsId = ParmsIdTypeObject()
    expect(parmsId.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const parmsId = ParmsIdTypeObject()
    const newParmsId = ParmsIdTypeObject()
    newParmsId.delete()
    const spyOn = jest.spyOn(newParmsId, 'inject')
    newParmsId.inject(parmsId.instance)
    expect(spyOn).toHaveBeenCalledWith(parmsId.instance)
  })
  test('It should delete the old instance and inject', () => {
    const parmsId = ParmsIdTypeObject()
    const newParmsId = ParmsIdTypeObject()
    const spyOn = jest.spyOn(newParmsId, 'inject')
    newParmsId.inject(parmsId.instance)
    expect(spyOn).toHaveBeenCalledWith(parmsId.instance)
  })
  test("It should delete it's instance", () => {
    const parmsId = ParmsIdTypeObject()
    const spyOn = jest.spyOn(parmsId, 'delete')
    parmsId.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(parmsId.instance).toBeNull()
    expect(() => parmsId.values).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const parmsId = ParmsIdTypeObject()
    parmsId.delete()
    const spyOn = jest.spyOn(parmsId, 'delete')
    parmsId.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(parmsId.instance).toBeNull()
  })
  test('It should return values', () => {
    const parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    parms.setPolyModulusDegree(4096)
    parms.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
    const context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = context.firstParmsId
    const values = parmsId.values
    expect(Array.isArray(values)).toBe(true)
    values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })
  test('It should construct from no args', () => {
    const constructor = jest.fn(ParmsIdTypeObject)
    const parmsId = constructor()
    expect(constructor).toHaveBeenCalledWith()
    expect(parmsId).toBeDefined()
    expect(typeof parmsId.constructor).toBe('function')
    expect(parmsId).toBeInstanceOf(Object)
    expect(parmsId.constructor).toBe(Object)
    expect(parmsId.instance.constructor.name).toBe('ParmsIdType')
    const values = parmsId.values
    expect(Array.isArray(values)).toBe(true)
    values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })
})
