import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from 'implementation/seal'
import { EncryptionParameters } from 'implementation/encryption-parameters'
import { Context } from 'implementation/context'
let seal: SEALLibrary
let bfvEncParms: EncryptionParameters
let ckksEncParms: EncryptionParameters
let bfvContext: Context
let ckksContext: Context
beforeAll(async () => {
  seal = await SEAL()
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
  bfvEncParms.setPolyModulusDegree(4096)
  bfvEncParms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
  )
  bfvEncParms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
  bfvContext = seal.Context(bfvEncParms, true, seal.SecurityLevel.tc128)
  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
  ckksEncParms.setPolyModulusDegree(4096)
  ckksEncParms.setCoeffModulus(
    seal.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
  ckksContext = seal.Context(ckksEncParms, true, seal.SecurityLevel.tc128)
})

describe('ContextData', () => {
  test('It should be a factory', () => {
    expect(seal.ContextData).toBeDefined()
    expect(typeof seal.ContextData.constructor).toBe('function')
    expect(seal.ContextData).toBeInstanceOf(Object)
    expect(seal.ContextData.constructor).toBe(Function)
    expect(seal.ContextData.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(bfvContext.firstContextData.instance)
    // Test properties
    expect(contextData).toHaveProperty('instance')
    expect(contextData).toHaveProperty('unsafeInject')
    expect(contextData).toHaveProperty('delete')
    expect(contextData).toHaveProperty('parms')
    expect(contextData).toHaveProperty('parmsId')
    expect(contextData).toHaveProperty('qualifiers')
    expect(contextData).toHaveProperty('totalCoeffModulusBitCount')
    expect(contextData).toHaveProperty('prevContextData')
    expect(contextData).toHaveProperty('nextContextData')
    expect(contextData).toHaveProperty('chainIndex')
  })
  test('It should have an instance (bfv)', () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(bfvContext.firstContextData.instance)
    expect(contextData.instance).toBeDefined()
  })
  test('It should have an instance (ckks)', () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(ckksContext.firstContextData.instance)
    expect(contextData.instance).toBeDefined()
  })
  test('It should inject', () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(bfvContext.firstContextData.instance)

    const newContextData = seal.ContextData()
    newContextData.unsafeInject(ckksContext.firstContextData.instance)
    newContextData.delete()
    const spyOn = jest.spyOn(newContextData, 'unsafeInject')
    newContextData.unsafeInject(contextData.instance)
    expect(spyOn).toHaveBeenCalledWith(contextData.instance)
    expect(newContextData.totalCoeffModulusBitCount).toEqual(72)
  })
  test('It should delete the old instance and inject', () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(bfvContext.firstContextData.instance)

    const newContextData = seal.ContextData()
    newContextData.unsafeInject(ckksContext.firstContextData.instance)
    const spyOn = jest.spyOn(newContextData, 'unsafeInject')
    newContextData.unsafeInject(contextData.instance)
    expect(spyOn).toHaveBeenCalledWith(contextData.instance)
    expect(newContextData.totalCoeffModulusBitCount).toEqual(72)
  })
  test("It should delete it's instance", () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(bfvContext.firstContextData.instance)
    const spyOn = jest.spyOn(contextData, 'delete')
    contextData.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(contextData.instance).toBeUndefined()
    expect(() => contextData.totalCoeffModulusBitCount).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(bfvContext.firstContextData.instance)
    contextData.delete()
    const spyOn = jest.spyOn(contextData, 'delete')
    contextData.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(contextData.instance).toBeUndefined()
    expect(() => contextData.totalCoeffModulusBitCount).toThrow(TypeError)
  })
  test('It should return a the previous context data', () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(bfvContext.firstContextData.instance)

    const prev = contextData.prevContextData
    expect(prev.instance).toBeDefined()
    expect(prev.totalCoeffModulusBitCount).toEqual(109)
  })
  test('It should return a the next context data', () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(bfvContext.firstContextData.instance)
    const prev = contextData.nextContextData
    expect(prev.instance).toBeDefined()
    expect(prev.totalCoeffModulusBitCount).toEqual(36)
  })
  test('It should return the chain index', () => {
    const contextData = seal.ContextData()
    contextData.unsafeInject(bfvContext.firstContextData.instance)
    expect(contextData.chainIndex).toEqual(1)
  })
})
