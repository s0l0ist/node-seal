import SEAL from '../index_wasm_node'
import { SEALLibrary } from 'implementation/seal'
let seal: SEALLibrary
beforeAll(async () => {
  seal = await SEAL()
})

describe('EncryptionParameters', () => {
  test('It should be a factory', () => {
    expect(seal.EncryptionParameters).toBeDefined()
    expect(typeof seal.EncryptionParameters.constructor).toBe('function')
    expect(seal.EncryptionParameters).toBeInstanceOf(Object)
    expect(seal.EncryptionParameters.constructor).toBe(Function)
    expect(seal.EncryptionParameters.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.EncryptionParameters)
    Constructor()
    expect(Constructor).toBeCalledWith()
  })
  test('It should have properties', () => {
    const encParms = seal.EncryptionParameters()
    // Test properties
    expect(encParms).toHaveProperty('instance')
    expect(encParms).toHaveProperty('unsafeInject')
    expect(encParms).toHaveProperty('delete')
    expect(encParms).toHaveProperty('setPolyModulusDegree')
    expect(encParms).toHaveProperty('setCoeffModulus')
    expect(encParms).toHaveProperty('setPlainModulus')
    expect(encParms).toHaveProperty('scheme')
    expect(encParms).toHaveProperty('polyModulusDegree')
    expect(encParms).toHaveProperty('coeffModulus')
    expect(encParms).toHaveProperty('plainModulus')
    expect(encParms).toHaveProperty('save')
    expect(encParms).toHaveProperty('saveArray')
    expect(encParms).toHaveProperty('load')
    expect(encParms).toHaveProperty('loadArray')
  })
  test('It should have an instance', () => {
    const encParms = seal.EncryptionParameters()
    expect(encParms.instance).toBeDefined()
  })
  test('It should inject', () => {
    const encParms = seal.EncryptionParameters()
    const newEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    newEncParms.delete()
    const spyOn = jest.spyOn(newEncParms, 'unsafeInject')
    newEncParms.unsafeInject(encParms.instance)
    expect(spyOn).toHaveBeenCalledWith(encParms.instance)
    expect(newEncParms.scheme).toEqual(seal.SchemeType.none)
  })
  test('It should delete the old instance and inject', () => {
    const encParms = seal.EncryptionParameters()
    const newEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    const spyOn = jest.spyOn(newEncParms, 'unsafeInject')
    newEncParms.unsafeInject(encParms.instance)
    expect(spyOn).toHaveBeenCalledWith(encParms.instance)
    expect(newEncParms.scheme).toEqual(seal.SchemeType.none)
  })
  test("It should delete it's instance", () => {
    const encParms = seal.EncryptionParameters()
    encParms.delete()
    const spyOn = jest.spyOn(encParms, 'delete')
    encParms.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(encParms.instance).toBeUndefined()
    expect(() => encParms.polyModulusDegree).toThrow(TypeError)
  })
  test('It should delete the old instance and inject', () => {
    const encParms = seal.EncryptionParameters()
    const spyOn = jest.spyOn(encParms, 'delete')
    encParms.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(encParms.instance).toBeUndefined()
    expect(() => encParms.polyModulusDegree).toThrow(TypeError)
  })
  test('It should set the poly modulus degree (bfv)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    const spyOn = jest.spyOn(encParms, 'setPolyModulusDegree')
    encParms.setPolyModulusDegree(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(encParms.polyModulusDegree).toEqual(4096)
  })

  test('It should fail to set the coeff modulus (none)', () => {
    const encParms = seal.EncryptionParameters()
    const coeffModulus = seal.CoeffModulus.BFVDefault(
      4096,
      seal.SecurityLevel.tc128
    )
    const spyOn = jest.spyOn(encParms, 'setCoeffModulus')
    expect(() => encParms.setCoeffModulus(coeffModulus)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(coeffModulus)
  })
  test('It should set the coeff modulus (bfv)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    const coeffModulus = seal.CoeffModulus.BFVDefault(
      4096,
      seal.SecurityLevel.tc128
    )
    const spyOn = jest.spyOn(encParms, 'setCoeffModulus')
    encParms.setCoeffModulus(coeffModulus)
    expect(spyOn).toHaveBeenCalledWith(coeffModulus)
    const coeffModArray = encParms.coeffModulus
    expect(coeffModArray.constructor).toBe(BigUint64Array)
    expect(coeffModArray).toEqual(
      BigUint64Array.from([
        BigInt('68719403009'),
        BigInt('68719230977'),
        BigInt('137438822401')
      ])
    )
  })
  test('It should set the coeff modulus (ckks)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
    const coeffModulus = seal.CoeffModulus.Create(
      4096,
      Int32Array.from([46, 16, 46])
    )
    const spyOn = jest.spyOn(encParms, 'setCoeffModulus')
    encParms.setCoeffModulus(coeffModulus)
    expect(spyOn).toHaveBeenCalledWith(coeffModulus)
    const coeffModArray = encParms.coeffModulus
    expect(coeffModArray.constructor).toBe(BigUint64Array)
    expect(coeffModArray).toEqual(
      BigUint64Array.from([
        BigInt('70368743587841'),
        BigInt('40961'),
        BigInt('70368743669761')
      ])
    )
  })
  test('It should fail to set the plain modulus (none)', () => {
    const encParms = seal.EncryptionParameters()
    const plainModulus = seal.Modulus(BigInt('786433'))
    const spyOn = jest.spyOn(encParms, 'setPlainModulus')
    expect(() => encParms.setPlainModulus(plainModulus)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plainModulus)
  })
  test('It should set the plain modulus (bfv)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    const plainModulus = seal.Modulus(BigInt('786433'))
    const spyOn = jest.spyOn(encParms, 'setPlainModulus')
    encParms.setPlainModulus(plainModulus)
    expect(spyOn).toHaveBeenCalledWith(plainModulus)
    expect(typeof encParms.plainModulus.value).toBe('bigint')
    expect(encParms.plainModulus.value).toBe(BigInt('786433'))
  })
  test('It should return the scheme (none)', () => {
    const encParms = seal.EncryptionParameters()
    expect(encParms.scheme).toEqual(seal.SchemeType.none)
  })
  test('It should fail to return the poly modulus degree (none)', () => {
    const encParms = seal.EncryptionParameters()
    expect(() => encParms.setPolyModulusDegree(4096)).toThrow()
    expect(encParms.polyModulusDegree).not.toEqual(4096)
  })
  test('It should return the poly modulus degree (bfv)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    encParms.setPolyModulusDegree(4096)
    expect(encParms.polyModulusDegree).toEqual(4096)
  })
  test('It should return the poly modulus degree (ckks)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
    encParms.setPolyModulusDegree(4096)
    expect(encParms.polyModulusDegree).toEqual(4096)
  })

  test('It should fail to return the coeff modulus (none)', () => {
    const encParms = seal.EncryptionParameters()
    expect(() =>
      encParms.setCoeffModulus(
        seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
      )
    ).toThrow()
  })
  test('It should return the coeff modulus (bfv)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    encParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
    )
    const coeffModArray = encParms.coeffModulus
    expect(coeffModArray.constructor).toBe(BigUint64Array)
    expect(coeffModArray).toEqual(
      BigUint64Array.from([
        BigInt('68719403009'),
        BigInt('68719230977'),
        BigInt('137438822401')
      ])
    )
  })
  test('It should return the coeff modulus (ckks)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
    encParms.setCoeffModulus(
      seal.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
    )
    const coeffModArray = encParms.coeffModulus
    expect(coeffModArray.constructor).toBe(BigUint64Array)
    expect(coeffModArray).toEqual(
      BigUint64Array.from([
        BigInt('70368743587841'),
        BigInt('40961'),
        BigInt('70368743669761')
      ])
    )
  })
  test('It should fail to return the plain modulus (none)', () => {
    const encParms = seal.EncryptionParameters()
    expect(() =>
      encParms.setPlainModulus(seal.Modulus(BigInt('786433')))
    ).toThrow()
  })
  test('It should return the plain modulus (bfv)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    encParms.setPlainModulus(seal.Modulus(BigInt('786433')))
    expect(encParms.plainModulus.value).toBe(BigInt(786433))
  })
  test('It should fail to return the plain modulus (ckks)', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
    expect(() =>
      encParms.setPlainModulus(seal.Modulus(BigInt('786433')))
    ).toThrow()
  })
  test('It should save to a string (none)', () => {
    const encParms = seal.EncryptionParameters()
    const spyOn = jest.spyOn(encParms, 'save')
    const str = encParms.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to a string', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    encParms.setPolyModulusDegree(4096)
    encParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
    )
    encParms.setPlainModulus(seal.Modulus(BigInt('786433')))
    const spyOn = jest.spyOn(encParms, 'save')
    const str = encParms.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const encParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    encParms.setPolyModulusDegree(4096)
    encParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
    )
    encParms.setPlainModulus(seal.Modulus(BigInt('786433')))
    const spyOn = jest.spyOn(encParms, 'saveArray')
    const array = encParms.saveArray()
    expect(spyOn).toHaveBeenCalled()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const encParms = seal.EncryptionParameters()
    const str = encParms.save()
    encParms.delete()
    const newEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    const spyOn = jest.spyOn(newEncParms, 'load')
    newEncParms.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
  })
  test('It should load from a typed array', () => {
    const encParms = seal.EncryptionParameters()
    const array = encParms.saveArray()
    encParms.delete()
    const newEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    const spyOn = jest.spyOn(newEncParms, 'loadArray')
    newEncParms.loadArray(array)
    expect(spyOn).toHaveBeenCalledWith(array)
  })
  test('It should fail to load from a string', () => {
    const encParms = seal.EncryptionParameters()
    const spyOn = jest.spyOn(encParms, 'load')
    expect(() =>
      encParms.load('XqEAASUAAAAAAAAAAAAAAHicY2CgCHywj1vIwCCBRQYAOAcCRw==')
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      'XqEAASUAAAAAAAAAAAAAAHicY2CgCHywj1vIwCCBRQYAOAcCRw=='
    )
  })
  test('It should fail to load from a typed array', () => {
    const encParms = seal.EncryptionParameters()
    const spyOn = jest.spyOn(encParms, 'loadArray')
    expect(() =>
      encParms.loadArray(
        Uint8Array.from([
          94,
          161,
          16,
          3,
          5,
          1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          120,
          156,
          99,
          103,
          128,
          0,
          0,
          0,
          64,
          0,
          8
        ])
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      Uint8Array.from([
        94,
        161,
        16,
        3,
        5,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        120,
        156,
        99,
        103,
        128,
        0,
        0,
        0,
        64,
        0,
        8
      ])
    )
  })
})
