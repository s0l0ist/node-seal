import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { EncryptionParameters } from '../../components'

let Morfix = null
let EncryptionParametersObject = null
beforeAll(async () => {
  Morfix = await Seal
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
  test('It should have properties', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
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
    expect(encParms).toHaveProperty('load')
  })
  test('It should have an instance (none)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
    expect(encParms.instance).not.toBeFalsy()
  })
  test('It should have an instance (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    expect(encParms.instance).not.toBeFalsy()
  })
  test('It should have an instance (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    expect(encParms.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
    const newencParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(newencParms, 'unsafeInject')
    newencParms.unsafeInject(encParms.instance)
    expect(spyOn).toHaveBeenCalledWith(encParms.instance)
    expect(newencParms.scheme).toEqual(Morfix.SchemeType.none)
  })
  test("It should delete it's instance", () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(encParms, 'delete')
    encParms.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(encParms.instance).toBeNull()
    expect(() => encParms.polyModulusDegree).toThrow(TypeError)
  })
  test('It should fail to set the poly modulus degree (none)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(encParms, 'setPolyModulusDegree')
    expect(() => encParms.setPolyModulusDegree(4096)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4096)
  })
  test('It should set the poly modulus degree (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(encParms, 'setPolyModulusDegree')
    encParms.setPolyModulusDegree(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(encParms.polyModulusDegree).toEqual(4096)
  })
  test('It should set the poly modulus degree (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    const spyOn = jest.spyOn(encParms, 'setPolyModulusDegree')
    encParms.setPolyModulusDegree(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(encParms.polyModulusDegree).toEqual(4096)
  })

  test('It should fail to set the coeff modulus (none)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
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
    expect(coeffModArray).toEqual([68719403009n, 68719230977n, 137438822401n])
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
    expect(coeffModArray).toEqual([70368743587841n, 40961n, 70368743669761n])
  })

  test('It should fail to set the plain modulus (none)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
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
    expect(encParms.plainModulus.value).toBe(BigInt(786433))
  })
  test('It should fail to set the plain modulus (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    const plainModulus = Morfix.SmallModulus('786433')
    const spyOn = jest.spyOn(encParms, 'setPlainModulus')
    expect(() => encParms.setPlainModulus(plainModulus)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plainModulus)
  })

  test('It should return the scheme (none)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
    expect(encParms.scheme).toEqual(Morfix.SchemeType.none)
  })
  test('It should return the scheme (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    expect(encParms.scheme).toEqual(Morfix.SchemeType.BFV)
  })
  test('It should return the scheme (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    expect(encParms.scheme).toEqual(Morfix.SchemeType.CKKS)
  })

  test('It should fail to return the poly modulus degree (none)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
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
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
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
    expect(coeffModArray).toEqual([68719403009n, 68719230977n, 137438822401n])
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
    expect(coeffModArray).toEqual([70368743587841n, 40961n, 70368743669761n])
  })

  test('It should fail to return the plain modulus (none)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
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
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(encParms, 'save')
    const str = encParms.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to a string (bfv)', () => {
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
  test('It should save to a string (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    encParms.setPolyModulusDegree(4096)
    encParms.setCoeffModulus(
      Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
    )
    const spyOn = jest.spyOn(encParms, 'save')
    const str = encParms.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })

  test('It should load from a string (none)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.none)
    const str = encParms.save()
    encParms.delete()
    const newencParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(newencParms, 'load')
    newencParms.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
    expect(newencParms.scheme).toBe(Morfix.SchemeType.none)
    expect(newencParms.save()).toBe(str)
  })
  test('It should load from a string (bfv)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.BFV)
    encParms.setPolyModulusDegree(4096)
    encParms.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    encParms.setPlainModulus(Morfix.SmallModulus('786433'))
    const str = encParms.save()
    encParms.delete()
    const newencParms = EncryptionParametersObject(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(newencParms, 'load')
    newencParms.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
    expect(newencParms.scheme).toBe(Morfix.SchemeType.BFV)
    expect(newencParms.save()).toBe(str)
  })
  test('It should load from a string (ckks)', () => {
    const encParms = EncryptionParametersObject(Morfix.SchemeType.CKKS)
    encParms.setPolyModulusDegree(4096)
    encParms.setCoeffModulus(
      Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
    )
    const str = encParms.save()
    encParms.delete()
    const newencParms = EncryptionParametersObject(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(newencParms, 'load')
    newencParms.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
    expect(newencParms.scheme).toBe(Morfix.SchemeType.CKKS)
    expect(newencParms.save()).toBe(str)
  })
})
