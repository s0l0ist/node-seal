import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { EncryptionParameters } from '../../components'

let Morfix = null
let EncryptionParametersObject = null
beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  EncryptionParametersObject = EncryptionParameters(lib)(Morfix)
})

describe('EncryptionParameters', () => {
  test('It should be a factory', () => {
    expect(EncryptionParametersObject).toBeDefined()
    expect(typeof EncryptionParametersObject.constructor).toBe('function')
    expect(EncryptionParametersObject).toBeInstanceOf(Object)
    expect(EncryptionParametersObject.constructor).toBe(Function)
    expect(EncryptionParametersObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(EncryptionParametersObject)
    Constructor()
    expect(Constructor).toBeCalledWith()
  })
  test('It should have properties', () => {
    const encParms = EncryptionParametersObject()
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
    const encParms = EncryptionParametersObject()
    expect(encParms.instance).toBeDefined()
  })
  test('It should inject', () => {
    const encParms = EncryptionParametersObject()
    const newEncParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    newEncParms.delete()
    const spyOn = jest.spyOn(newEncParms, 'unsafeInject')
    newEncParms.unsafeInject(encParms.instance)
    expect(spyOn).toHaveBeenCalledWith(encParms.instance)
    expect(newEncParms.scheme).toEqual(Morfix.SchemeType.none)
  })
  test('It should delete the old instance and inject', () => {
    const encParms = EncryptionParametersObject()
    const newEncParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(newEncParms, 'unsafeInject')
    newEncParms.unsafeInject(encParms.instance)
    expect(spyOn).toHaveBeenCalledWith(encParms.instance)
    expect(newEncParms.scheme).toEqual(Morfix.SchemeType.none)
  })
  test("It should delete it's instance", () => {
    const encParms = EncryptionParametersObject()
    encParms.delete()
    const spyOn = jest.spyOn(encParms, 'delete')
    encParms.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(encParms.instance).toBeNull()
    expect(() => encParms.polyModulusDegree).toThrow(TypeError)
  })
  test('It should delete the old instance and inject', () => {
    const encParms = EncryptionParametersObject()
    const spyOn = jest.spyOn(encParms, 'delete')
    encParms.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(encParms.instance).toBeNull()
    expect(() => encParms.polyModulusDegree).toThrow(TypeError)
  })
  test('It should set the poly modulus degree (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(encParms, 'setPolyModulusDegree')
    encParms.setPolyModulusDegree(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(encParms.polyModulusDegree).toEqual(4096)
  })

  test('It should fail to set the coeff modulus (none)', () => {
    const encParms = EncryptionParametersObject()
    const coeffModulus = Morfix.CoeffModulus.BFVDefault(
      4096,
      Morfix.SecurityLevel.tc128
    )
    const spyOn = jest.spyOn(encParms, 'setCoeffModulus')
    expect(() => encParms.setCoeffModulus(coeffModulus)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(coeffModulus)
  })
  test('It should set the coeff modulus (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    const coeffModulus = Morfix.CoeffModulus.BFVDefault(
      4096,
      Morfix.SecurityLevel.tc128
    )
    const spyOn = jest.spyOn(encParms, 'setCoeffModulus')
    encParms.setCoeffModulus(coeffModulus)
    expect(spyOn).toHaveBeenCalledWith(coeffModulus)
    const coeffModArray = encParms.coeffModulus
    expect(Array.isArray(coeffModArray)).toBe(true)
    coeffModArray.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })
  test('It should set the coeff modulus (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    const coeffModulus = Morfix.CoeffModulus.Create(
      4096,
      Int32Array.from([46, 16, 46])
    )
    const spyOn = jest.spyOn(encParms, 'setCoeffModulus')
    encParms.setCoeffModulus(coeffModulus)
    expect(spyOn).toHaveBeenCalledWith(coeffModulus)
    const coeffModArray = encParms.coeffModulus
    expect(Array.isArray(coeffModArray)).toBe(true)
    coeffModArray.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })

  test('It should fail to set the plain modulus (none)', () => {
    const encParms = EncryptionParametersObject()
    const plainModulus = Morfix.SmallModulus('786433')
    const spyOn = jest.spyOn(encParms, 'setPlainModulus')
    expect(() => encParms.setPlainModulus(plainModulus)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plainModulus)
  })
  test('It should set the plain modulus (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    const plainModulus = Morfix.SmallModulus('786433')
    const spyOn = jest.spyOn(encParms, 'setPlainModulus')
    encParms.setPlainModulus(plainModulus)
    expect(spyOn).toHaveBeenCalledWith(plainModulus)
    expect(typeof encParms.plainModulus.value).toBe('bigint')
  })

  test('It should return the scheme (none)', () => {
    const encParms = EncryptionParametersObject()
    expect(encParms.scheme).toEqual(Morfix.SchemeType.none)
  })

  test('It should fail to return the poly modulus degree (none)', () => {
    const encParms = EncryptionParametersObject()
    expect(() => encParms.setPolyModulusDegree(4096)).toThrow()
    expect(encParms.polyModulusDegree).not.toEqual(4096)
  })
  test('It should return the poly modulus degree (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    encParms.setPolyModulusDegree(4096)
    expect(encParms.polyModulusDegree).toEqual(4096)
  })
  test('It should return the poly modulus degree (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    encParms.setPolyModulusDegree(4096)
    expect(encParms.polyModulusDegree).toEqual(4096)
  })

  test('It should fail to return the coeff modulus (none)', () => {
    const encParms = EncryptionParametersObject()
    expect(() =>
      encParms.setCoeffModulus(
        Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
      )
    ).toThrow()
  })
  test('It should return the coeff modulus (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    encParms.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    const coeffModArray = encParms.coeffModulus
    expect(Array.isArray(coeffModArray)).toBe(true)
    coeffModArray.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })
  test('It should return the coeff modulus (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    encParms.setCoeffModulus(
      Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
    )
    const coeffModArray = encParms.coeffModulus
    expect(Array.isArray(coeffModArray)).toBe(true)
    coeffModArray.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })

  test('It should fail to return the plain modulus (none)', () => {
    const encParms = EncryptionParametersObject()
    expect(() =>
      encParms.setPlainModulus(Morfix.SmallModulus('786433'))
    ).toThrow()
  })
  test('It should return the plain modulus (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    encParms.setPlainModulus(Morfix.SmallModulus('786433'))
    expect(encParms.plainModulus.value).toBe(BigInt(786433))
  })
  test('It should fail to return the plain modulus (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    expect(() =>
      encParms.setPlainModulus(Morfix.SmallModulus('786433'))
    ).toThrow()
  })

  test('It should save to a string (none)', () => {
    const encParms = EncryptionParametersObject()
    const spyOn = jest.spyOn(encParms, 'save')
    const str = encParms.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to a string', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    encParms.setPolyModulusDegree(4096)
    encParms.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    encParms.setPlainModulus(Morfix.SmallModulus('786433'))
    const spyOn = jest.spyOn(encParms, 'save')
    const str = encParms.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    encParms.setPolyModulusDegree(4096)
    encParms.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    encParms.setPlainModulus(Morfix.SmallModulus('786433'))
    const spyOn = jest.spyOn(encParms, 'saveArray')
    const array = encParms.saveArray()
    expect(spyOn).toHaveBeenCalled()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const encParms = EncryptionParametersObject()
    const str = encParms.save()
    encParms.delete()
    const newEncParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(newEncParms, 'load')
    newEncParms.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
  })
  test('It should load from a typed array', () => {
    const encParms = EncryptionParametersObject()
    const array = encParms.saveArray()
    encParms.delete()
    const newEncParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(newEncParms, 'loadArray')
    newEncParms.loadArray(array)
    expect(spyOn).toHaveBeenCalledWith(array)
  })
  test('It should fail to load from a string', () => {
    const encParms = EncryptionParametersObject()
    const spyOn = jest.spyOn(encParms, 'load')
    expect(() =>
      encParms.load('XqEAASUAAAAAAAAAAAAAAHicY2CgCHywj1vIwCCBRQYAOAcCRw==')
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      'XqEAASUAAAAAAAAAAAAAAHicY2CgCHywj1vIwCCBRQYAOAcCRw=='
    )
  })
  test('It should fail to load from a typed array', () => {
    const encParms = EncryptionParametersObject()
    const spyOn = jest.spyOn(encParms, 'loadArray')
    expect(() =>
      encParms.loadArray(
        Uint8Array.from([
          93,
          161,
          0,
          1,
          27,
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
        93,
        161,
        0,
        1,
        27,
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
