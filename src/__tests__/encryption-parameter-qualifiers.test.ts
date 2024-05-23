import { Context } from '../implementation/context'
import { ContextData } from '../implementation/context-data'
import { EncryptionParameters } from '../implementation/encryption-parameters'
import { Modulus } from '../implementation/modulus'
import { SEALLibrary } from '../implementation/seal'
import { Vector } from '../implementation/vector'
import SEAL from '../throws_wasm_node_umd'

let seal: SEALLibrary
let coeffModulus: Vector
let plainModulus: Modulus
let bfvContext: Context
let bfvContextData: ContextData
let bfvEncParms: EncryptionParameters

let ckksContext: Context
let ckksContextData: ContextData
let ckksEncParms: EncryptionParameters
beforeAll(async () => {
  seal = await SEAL()
  const polyModulusDegree = 4096
  const bitSizes = Int32Array.from([37, 36, 36])
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.Create(polyModulusDegree, bitSizes)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.bfv)
  bfvEncParms.setPolyModulusDegree(polyModulusDegree)
  bfvEncParms.setCoeffModulus(coeffModulus)
  bfvEncParms.setPlainModulus(plainModulus)
  bfvContext = seal.Context(bfvEncParms)
  bfvContextData = bfvContext.firstContextData
  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.ckks)
  ckksEncParms.setPolyModulusDegree(polyModulusDegree)
  ckksEncParms.setCoeffModulus(coeffModulus)
  ckksContext = seal.Context(ckksEncParms)
  ckksContextData = ckksContext.firstContextData
})

describe('EncryptionParameterQualifiers', () => {
  test('It should be a factory', () => {
    expect(seal.EncryptionParameterQualifiers).toBeDefined()
    expect(typeof seal.EncryptionParameterQualifiers.constructor).toBe(
      'function'
    )
    expect(seal.EncryptionParameterQualifiers).toBeInstanceOf(Object)
    expect(seal.EncryptionParameterQualifiers.constructor).toBe(Function)
    expect(seal.EncryptionParameterQualifiers.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)

    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('parametersSet')
    expect(item).toHaveProperty('usingFFT')
    expect(item).toHaveProperty('usingNTT')
    expect(item).toHaveProperty('usingBatching')
    expect(item).toHaveProperty('usingFastPlainLift')
    expect(item).toHaveProperty('usingDescendingModulusChain')
    expect(item).toHaveProperty('securityLevel')
  })
  test('It should not have an instance (none)', () => {
    const item = seal.EncryptionParameterQualifiers()
    expect(item.instance).toBeUndefined()
  })
  test('It should have an instance (bfv)', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    expect(item.instance).toBeDefined()
  })
  test('It should have an instance (ckks)', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(ckksContextData.qualifiers.instance)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    const newItem = seal.EncryptionParameterQualifiers()
    item.unsafeInject(ckksContextData.qualifiers.instance)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.parametersSet()).toEqual(true)
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    const newItem = seal.EncryptionParameterQualifiers()
    item.unsafeInject(ckksContextData.qualifiers.instance)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.parametersSet()).toEqual(true)
  })
  test("It should delete it's instance", () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
    expect(() => item.usingFFT).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
    expect(() => item.usingFFT).toThrow(TypeError)
  })
  test('It should return true if the parameters are set', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    expect(item.parametersSet()).toEqual(true)
  })
  test('It should return true if using FFT', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    expect(item.usingFFT).toEqual(true)
  })
  test('It should return true if using NTT', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    expect(item.usingNTT).toEqual(true)
  })
  test('It should return true if using batching', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    expect(item.usingBatching).toEqual(true)
  })
  test('It should return true if using fast plain lift', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    expect(item.usingFastPlainLift).toEqual(true)
  })
  test('It should return true if coeff modulus primes are in decreasing order', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    expect(item.usingDescendingModulusChain).toEqual(true)
  })
  test('It should return the security level', () => {
    const item = seal.EncryptionParameterQualifiers()
    item.unsafeInject(bfvContextData.qualifiers.instance)
    expect(item.securityLevel).toEqual(seal.SecurityLevel.tc128)
  })
})
