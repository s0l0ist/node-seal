import { Seal } from '../../index.js'

let Morfix = null

beforeAll(async () => {
  Morfix = await Seal
})

describe('EncryptionParameters', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('EncryptionParameters')
    expect(Morfix.EncryptionParameters).not.toBeUndefined()
    expect(typeof Morfix.EncryptionParameters.constructor).toBe('function')
    expect(Morfix.EncryptionParameters).toBeInstanceOf(Object)
    expect(Morfix.EncryptionParameters.constructor).toBe(Function)
    expect(Morfix.EncryptionParameters.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('setPolyModulusDegree')
    expect(item).toHaveProperty('setCoeffModulus')
    expect(item).toHaveProperty('setPlainModulus')
    expect(item).toHaveProperty('scheme')
    expect(item).toHaveProperty('polyModulusDegree')
    expect(item).toHaveProperty('coeffModulus')
    expect(item).toHaveProperty('plainModulus')
    expect(item).toHaveProperty('save')
    expect(item).toHaveProperty('load')
  })
  test('It should have an instance (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should have an instance (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should have an instance (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    const newItem = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.scheme).toEqual(Morfix.SchemeType.none)
  })
  test("It should delete it's instance", () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.polyModulusDegree).toThrow(TypeError)
  })
  test('It should fail to set the poly modulus degree (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(item, 'setPolyModulusDegree')
    expect(() => item.setPolyModulusDegree(4096)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4096)
  })
  test('It should set the poly modulus degree (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(item, 'setPolyModulusDegree')
    item.setPolyModulusDegree(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(item.polyModulusDegree).toEqual(4096)
  })
  test('It should set the poly modulus degree (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    const spyOn = jest.spyOn(item, 'setPolyModulusDegree')
    item.setPolyModulusDegree(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(item.polyModulusDegree).toEqual(4096)
  })

  test('It should fail to set the coeff modulus (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    const coeffModulus = Morfix.CoeffModulus.BFVDefault(
      4096,
      Morfix.SecurityLevel.tc128
    )
    const spyOn = jest.spyOn(item, 'setCoeffModulus')
    expect(() => item.setCoeffModulus(coeffModulus)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(coeffModulus)
  })
  test('It should set the coeff modulus (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    const coeffModulus = Morfix.CoeffModulus.BFVDefault(
      4096,
      Morfix.SecurityLevel.tc128
    )
    const spyOn = jest.spyOn(item, 'setCoeffModulus')
    item.setCoeffModulus(coeffModulus)
    expect(spyOn).toHaveBeenCalledWith(coeffModulus)
    const coeffModArray = item.coeffModulus
    expect(Array.isArray(coeffModArray)).toBe(true)
    coeffModArray.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(coeffModArray).toEqual([68719403009n, 68719230977n, 137438822401n])
  })
  test('It should set the coeff modulus (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    const coeffModulus = Morfix.CoeffModulus.Create(
      4096,
      Int32Array.from([46, 16, 46])
    )
    const spyOn = jest.spyOn(item, 'setCoeffModulus')
    item.setCoeffModulus(coeffModulus)
    expect(spyOn).toHaveBeenCalledWith(coeffModulus)
    const coeffModArray = item.coeffModulus
    expect(Array.isArray(coeffModArray)).toBe(true)
    coeffModArray.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(coeffModArray).toEqual([70368743587841n, 40961n, 70368743669761n])
  })

  test('It should fail to set the plain modulus (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    const plainModulus = Morfix.SmallModulus('786433')
    const spyOn = jest.spyOn(item, 'setPlainModulus')
    expect(() => item.setPlainModulus(plainModulus)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plainModulus)
  })
  test('It should set the plain modulus (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    const plainModulus = Morfix.SmallModulus('786433')
    const spyOn = jest.spyOn(item, 'setPlainModulus')
    item.setPlainModulus(plainModulus)
    expect(spyOn).toHaveBeenCalledWith(plainModulus)
    expect(item.plainModulus.value).toBe(BigInt(786433))
  })
  test('It should fail to set the plain modulus (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    const plainModulus = Morfix.SmallModulus('786433')
    const spyOn = jest.spyOn(item, 'setPlainModulus')
    expect(() => item.setPlainModulus(plainModulus)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plainModulus)
  })

  test('It should return the scheme (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    expect(item.scheme).toEqual(Morfix.SchemeType.none)
  })
  test('It should return the scheme (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    expect(item.scheme).toEqual(Morfix.SchemeType.BFV)
  })
  test('It should return the scheme (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    expect(item.scheme).toEqual(Morfix.SchemeType.CKKS)
  })

  test('It should fail to return the poly modulus degree (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    expect(() => item.setPolyModulusDegree(4096)).toThrow()
    expect(item.polyModulusDegree).not.toEqual(4096)
  })
  test('It should return the poly modulus degree (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    item.setPolyModulusDegree(4096)
    expect(item.polyModulusDegree).toEqual(4096)
  })
  test('It should return the poly modulus degree (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    item.setPolyModulusDegree(4096)
    expect(item.polyModulusDegree).toEqual(4096)
  })

  test('It should fail to return the coeff modulus (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    expect(() =>
      item.setCoeffModulus(
        Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
      )
    ).toThrow()
  })
  test('It should return the coeff modulus (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    item.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    const coeffModArray = item.coeffModulus
    expect(Array.isArray(coeffModArray)).toBe(true)
    coeffModArray.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(coeffModArray).toEqual([68719403009n, 68719230977n, 137438822401n])
  })
  test('It should return the coeff modulus (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    item.setCoeffModulus(
      Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
    )
    const coeffModArray = item.coeffModulus
    expect(Array.isArray(coeffModArray)).toBe(true)
    coeffModArray.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
    expect(coeffModArray).toEqual([70368743587841n, 40961n, 70368743669761n])
  })

  test('It should fail to return the plain modulus (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    expect(() => item.setPlainModulus(Morfix.SmallModulus('786433'))).toThrow()
  })
  test('It should return the plain modulus (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    item.setPlainModulus(Morfix.SmallModulus('786433'))
    expect(item.plainModulus.value).toBe(BigInt(786433))
  })
  test('It should fail to return the plain modulus (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    expect(() => item.setPlainModulus(Morfix.SmallModulus('786433'))).toThrow()
  })

  test('It should save to a string (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to a string (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    item.setPolyModulusDegree(4096)
    item.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    item.setPlainModulus(Morfix.SmallModulus('786433'))
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to a string (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    item.setPolyModulusDegree(4096)
    item.setCoeffModulus(
      Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
    )
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })

  test('It should load from a string (none)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    const str = item.save()
    item.delete()
    const newItem = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
    expect(newItem.scheme).toBe(Morfix.SchemeType.none)
    expect(newItem.save()).toBe(str)
  })
  test('It should load from a string (bfv)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    item.setPolyModulusDegree(4096)
    item.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    )
    item.setPlainModulus(Morfix.SmallModulus('786433'))
    const str = item.save()
    item.delete()
    const newItem = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
    expect(newItem.scheme).toBe(Morfix.SchemeType.BFV)
    expect(newItem.save()).toBe(str)
  })
  test('It should load from a string (ckks)', () => {
    const item = Morfix.EncryptionParameters(Morfix.SchemeType.CKKS)
    item.setPolyModulusDegree(4096)
    item.setCoeffModulus(
      Morfix.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
    )
    const str = item.save()
    item.delete()
    const newItem = Morfix.EncryptionParameters(Morfix.SchemeType.none)
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
    expect(newItem.scheme).toBe(Morfix.SchemeType.CKKS)
    expect(newItem.save()).toBe(str)
  })
})
