import { Seal } from '../../index.js'

let Morfix = null
let parms = null
let ckksParms = null

beforeAll(async () => {
  Morfix = await Seal
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
    expect(Morfix).toHaveProperty('Context')
    expect(Morfix.Context).not.toBeUndefined()
    expect(typeof Morfix.Context.constructor).toBe('function')
    expect(Morfix.Context).toBeInstanceOf(Object)
    expect(Morfix.Context.constructor).toBe(Function)
    expect(Morfix.Context.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
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
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should have an instance (ckks)', () => {
    const item = Morfix.Context(ckksParms, true, Morfix.SecurityLevel.tc128)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const newItem = Morfix.Context(ckksParms, true, Morfix.SecurityLevel.tc128)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.parametersSet).toEqual(true)
  })
  test("It should delete it's instance", () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.usingKeyswitching).toThrow(TypeError)
  })
  test('It should print the context to the console', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    item.print = jest.fn()
    item.print()
    expect(item.print).toHaveBeenCalledWith()
  })
  test('It should return the context data for a specific parms id', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = item.firstParmsId
    const spyOn = jest.spyOn(item, 'getContextData')
    const contextData = item.getContextData(parmsId)
    expect(spyOn).toHaveBeenCalledWith(parmsId)
    expect(contextData.totalCoeffModulusBitCount).toBe(72)
  })
  test('It should return the context data for the parms that are used for keys', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const contextData = item.keyContextData
    expect(contextData.totalCoeffModulusBitCount).toBe(109)
  })
  test('It should return the first context data for the parms that are used for data', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const contextData = item.firstContextData
    expect(contextData.totalCoeffModulusBitCount).toBe(72)
  })
  test('It should return the last context data for the parms that are used for data', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const contextData = item.lastContextData
    expect(contextData.totalCoeffModulusBitCount).toBe(36)
  })
  test('It should return true if the parameters are set correctly', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    expect(item.parametersSet).toBe(true)
  })
  test('It should return the parmsId corresponding to the parms that are used for keys', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = item.keyParmsId
    expect(Array.isArray(parmsId.values)).toBe(true)
    parmsId.values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(parmsId.values).toEqual([
      15359885167903699025n,
      13859760541767178383n,
      7059071203920448784n,
      13833089372777612512n
    ])
  })
  test('It should return the first parmsId corresponding to the parms that are used for data', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = item.firstParmsId
    expect(Array.isArray(parmsId.values)).toBe(true)
    parmsId.values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(parmsId.values).toEqual([
      1873000747715295028n,
      11215186030905010692n,
      3414445251667737935n,
      182315704735341130n
    ])
  })
  test('It should return the last parmsId corresponding to the parms that are used for data', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    const parmsId = item.lastParmsId
    expect(Array.isArray(parmsId.values)).toBe(true)
    parmsId.values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(parmsId.values).toEqual([
      11429859456180146811n,
      6196561566494887094n,
      5221243576142229105n,
      1012306229078676531n
    ])
  })
  test('It should return true if using key switching', () => {
    const item = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
    expect(item.usingKeyswitching).toBe(true)
  })
})
