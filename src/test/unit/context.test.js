import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { Context } from '../../components'

let Morfix = null
let parms = null
let ckksParms = null
let ContextObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  ContextObject = Context(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))

  ckksParms = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
  ckksParms.setPolyModulusDegree(4096)
  ckksParms.setCoeffModulus(
    Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
})

describe('Context', () => {
  test('It should be a factory', () => {
    expect(ContextObject).toBeDefined()
    expect(typeof ContextObject.constructor).toBe('function')
    expect(ContextObject).toBeInstanceOf(Object)
    expect(ContextObject.constructor).toBe(Function)
    expect(ContextObject.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('print')
    expect(item).toHaveProperty('getContextData')
    expect(item).toHaveProperty('keyContextData')
    expect(item).toHaveProperty('firstContextData')
    expect(item).toHaveProperty('lastContextData')
    expect(item).toHaveProperty('parametersSet')
    expect(item).toHaveProperty('keyParmsId')
    expect(item).toHaveProperty('firstParmsId')
    expect(item).toHaveProperty('lastParmsId')
    expect(item).toHaveProperty('usingKeyswitching')
  })
  test('It should have an instance (bfv)', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should have an instance (ckks)', () => {
    const item = ContextObject(ckksParms, true, Morfix.SecurityLevel.tc128)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    const newItem = ContextObject(ckksParms, true, Morfix.SecurityLevel.tc128)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.parametersSet).toEqual(true)
  })
  test("It should delete it's instance", () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.usingKeyswitching).toThrow(TypeError)
  })
  test('It should print the context to the console', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    item.print = jest.fn()
    item.print()
    expect(item.print).toHaveBeenCalledWith()
  })
  test('It should return the context data for a specific parms id', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = item.firstParmsId
    const spyOn = jest.spyOn(item, 'getContextData')
    const contextData = item.getContextData(parmsId)
    expect(spyOn).toHaveBeenCalledWith(parmsId)
    expect(typeof contextData.totalCoeffModulusBitCount).toBe('number')
  })
  test('It should return the context data for the parms that are used for keys', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    const contextData = item.keyContextData
    expect(typeof contextData.totalCoeffModulusBitCount).toBe('number')
  })
  test('It should return the first context data for the parms that are used for data', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    const contextData = item.firstContextData
    expect(typeof contextData.totalCoeffModulusBitCount).toBe('number')
  })
  test('It should return the last context data for the parms that are used for data', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    const contextData = item.lastContextData
    expect(typeof contextData.totalCoeffModulusBitCount).toBe('number')
  })
  test('It should return true if the parameters are set correctly', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    expect(typeof item.parametersSet).toBe('boolean')
  })
  test('It should return the parmsId corresponding to the parms that are used for keys', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = item.keyParmsId
    expect(Array.isArray(parmsId.values)).toBe(true)
    parmsId.values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })
  test('It should return the first parmsId corresponding to the parms that are used for data', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = item.firstParmsId
    expect(Array.isArray(parmsId.values)).toBe(true)
    parmsId.values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })
  test('It should return the last parmsId corresponding to the parms that are used for data', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = item.lastParmsId
    expect(Array.isArray(parmsId.values)).toBe(true)
    parmsId.values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })
  test('It should return true if using key switching', () => {
    const item = ContextObject(parms, true, Morfix.SecurityLevel.tc128)
    expect(typeof item.usingKeyswitching).toBe('boolean')
  })
})
