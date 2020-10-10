import SEAL from '../index_wasm_node'
import { SEALLibrary } from 'implementation/seal'
import { EncryptionParameters } from 'implementation/encryption-parameters'
let seal: SEALLibrary
let bfvEncParms: EncryptionParameters
let ckksEncParms: EncryptionParameters
beforeAll(async () => {
  seal = await SEAL()
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
  bfvEncParms.setPolyModulusDegree(4096)
  bfvEncParms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
  )
  bfvEncParms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
  ckksEncParms.setPolyModulusDegree(4096)
  ckksEncParms.setCoeffModulus(
    seal.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
})

describe('Context', () => {
  test('It should be a factory', () => {
    expect(seal.Context).toBeDefined()
    expect(typeof seal.Context.constructor).toBe('function')
    expect(seal.Context).toBeInstanceOf(Object)
    expect(seal.Context.constructor).toBe(Function)
    expect(seal.Context.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.Context)
    Constructor(bfvEncParms)
    expect(Constructor).toBeCalledWith(bfvEncParms)
  })
  test('It should have properties', () => {
    const item = seal.Context(bfvEncParms)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('toHuman')
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
    const item = seal.Context(bfvEncParms)
    expect(item.instance).toBeDefined()
  })
  test('It should have an instance (ckks)', () => {
    const item = seal.Context(ckksEncParms, true, seal.SecurityLevel.tc128)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.Context(bfvEncParms)
    const newItem = seal.Context(ckksEncParms, true, seal.SecurityLevel.tc128)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.parametersSet()).toEqual(true)
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.Context(bfvEncParms)
    const newItem = seal.Context(ckksEncParms, true, seal.SecurityLevel.tc128)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.parametersSet()).toEqual(true)
  })
  test("It should delete it's instance", () => {
    const item = seal.Context(bfvEncParms)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
    expect(() => item.usingKeyswitching).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = seal.Context(bfvEncParms)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
    expect(() => item.usingKeyswitching).toThrow(TypeError)
  })
  test('It should return the human readable string of the context', () => {
    const item = seal.Context(bfvEncParms)
    const spyOn = jest.spyOn(item, 'toHuman')
    item.toHuman()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should return the context data for a specific bfvEncParms id', () => {
    const item = seal.Context(bfvEncParms)
    const parmsId = item.firstParmsId
    const spyOn = jest.spyOn(item, 'getContextData')
    const contextData = item.getContextData(parmsId)
    expect(spyOn).toHaveBeenCalledWith(parmsId)
    expect(typeof contextData.totalCoeffModulusBitCount).toBe('number')
  })
  test('It should return the context data for the bfvEncParms that are used for keys', () => {
    const item = seal.Context(bfvEncParms)
    const contextData = item.keyContextData
    expect(typeof contextData.totalCoeffModulusBitCount).toBe('number')
  })
  test('It should return the first context data for the bfvEncParms that are used for data', () => {
    const item = seal.Context(bfvEncParms)
    const contextData = item.firstContextData
    expect(typeof contextData.totalCoeffModulusBitCount).toBe('number')
  })
  test('It should return the last context data for the bfvEncParms that are used for data', () => {
    const item = seal.Context(bfvEncParms)
    const contextData = item.lastContextData
    expect(typeof contextData.totalCoeffModulusBitCount).toBe('number')
  })
  test('It should return true if the parameters are set correctly', () => {
    const item = seal.Context(bfvEncParms)
    expect(typeof item.parametersSet()).toBe('boolean')
  })
  test('It should return the parmsId corresponding to the bfvEncParms that are used for keys', () => {
    const item = seal.Context(bfvEncParms)
    const parmsId = item.keyParmsId
    const values = parmsId.values
    expect(values.constructor).toBe(BigUint64Array)
    expect(values).toEqual(
      BigUint64Array.from([
        BigInt('15359885167903699025'),
        BigInt('13859760541767178383'),
        BigInt('7059071203920448784'),
        BigInt('13833089372777612512')
      ])
    )
  })
  test('It should return the first parmsId corresponding to the bfvEncParms that are used for data', () => {
    const item = seal.Context(bfvEncParms)
    const parmsId = item.firstParmsId
    const values = parmsId.values
    expect(values.constructor).toBe(BigUint64Array)
    expect(values).toEqual(
      BigUint64Array.from([
        BigInt('1873000747715295028'),
        BigInt('11215186030905010692'),
        BigInt('3414445251667737935'),
        BigInt('182315704735341130')
      ])
    )
  })
  test('It should return the last parmsId corresponding to the bfvEncParms that are used for data', () => {
    const item = seal.Context(bfvEncParms)
    const parmsId = item.lastParmsId
    const values = parmsId.values
    expect(values.constructor).toBe(BigUint64Array)
    expect(values).toEqual(
      BigUint64Array.from([
        BigInt('11429859456180146811'),
        BigInt('6196561566494887094'),
        BigInt('5221243576142229105'),
        BigInt('1012306229078676531')
      ])
    )
  })
  test('It should return true if using key switching', () => {
    const item = seal.Context(bfvEncParms)
    expect(typeof item.usingKeyswitching).toBe('boolean')
  })
})
