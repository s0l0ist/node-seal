import { Seal } from '../../index.js'

let Morfix = null
let parms = null
let context = null
let contextData = null

let ckksParms = null
let ckksContext = null
let ckksContextData = null

beforeAll(async () => {
  Morfix = await Seal
  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  contextData = context.firstContextData

  ckksParms = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
  ckksParms.setPolyModulusDegree(4096)
  ckksParms.setCoeffModulus(
    Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
  )
  ckksContext = Morfix.Context(ckksParms, true, Morfix.SecurityLevel.tc128)
  ckksContextData = ckksContext.firstContextData
})

describe('EncryptionParameterQualifiers', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('EncryptionParameterQualifiers')
    expect(Morfix.EncryptionParameterQualifiers).not.toBeUndefined()
    expect(typeof Morfix.EncryptionParameterQualifiers.constructor).toBe(
      'function'
    )
    expect(Morfix.EncryptionParameterQualifiers).toBeInstanceOf(Object)
    expect(Morfix.EncryptionParameterQualifiers.constructor).toBe(Function)
    expect(Morfix.EncryptionParameterQualifiers.constructor.name).toBe(
      'Function'
    )
  })
  test('It should have properties', () => {
    const item = contextData.qualifiers
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
  test('It should have an instance (none)', () => {
    const item = contextData.qualifiers
    expect(item.instance).not.toBeFalsy()
  })
  test('It should have an instance (bfv)', () => {
    const item = contextData.qualifiers
    expect(item.instance).not.toBeFalsy()
  })
  test('It should have an instance (ckks)', () => {
    const item = ckksContextData.qualifiers
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = contextData.qualifiers
    const newItem = ckksContextData.qualifiers
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.parametersSet).toEqual(true)
  })
  test("It should delete it's instance", () => {
    const item = contextData.qualifiers
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.usingFFT).toThrow(TypeError)
  })
  test('It should return true if the parameters are set', () => {
    const item = contextData.qualifiers
    expect(item.parametersSet).toEqual(true)
  })
  test('It should return true if using FFT', () => {
    const item = contextData.qualifiers
    expect(item.usingFFT).toEqual(true)
  })
  test('It should return true if using NTT', () => {
    const item = contextData.qualifiers
    expect(item.usingNTT).toEqual(true)
  })
  test('It should return true if using batching', () => {
    const item = contextData.qualifiers
    expect(item.usingBatching).toEqual(true)
  })
  test('It should return true if using fast plain lift', () => {
    const item = contextData.qualifiers
    expect(item.usingFastPlainLift).toEqual(true)
  })
  test('It should return true if coeff modulus primes are in decreasing order', () => {
    const item = contextData.qualifiers
    expect(item.usingDescendingModulusChain).toEqual(true)
  })
  test('It should return the security level', () => {
    const item = contextData.qualifiers
    expect(item.securityLevel).toEqual(Morfix.SecurityLevel.tc128)
  })
})
