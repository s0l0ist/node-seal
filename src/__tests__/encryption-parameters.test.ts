import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('EncryptionParameters', () => {
  test('It should set the poly modulus degree (bfv)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)

    encParms.setPolyModulusDegree(4096)
    expect(encParms.polyModulusDegree()).toBe(4096)
    expect(encParms.scheme().value).toBe(seal.SchemeType.bfv.value)

    encParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.tc128)
    )
    const coeffModulus = encParms.coeffModulus()
    expect(coeffModulus.size()).toBe(3)
    expect(coeffModulus.get(0)!.value()).toBe(68719403009n)
    expect(coeffModulus.get(1)!.value()).toBe(68719230977n)
    expect(coeffModulus.get(2)!.value()).toBe(137438822401n)

    encParms.setPlainModulus(new seal.Modulus(786433n))
    expect(encParms.plainModulus().value()).toBe(786433n)

    const parms = encParms.parmsId().values() as BigUint64Array
    expect(parms.length).toBe(4)
    expect(parms[0]).toBe(10807243428128829454n)
    expect(parms[1]).toBe(8129154358874821315n)
    expect(parms[2]).toBe(8841943985315564673n)
    expect(parms[3]).toBe(3700895094742043715n)
  })
  test('It should set the poly modulus degree (bgv)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bgv)

    encParms.setPolyModulusDegree(4096)
    expect(encParms.polyModulusDegree()).toEqual(4096)
    expect(encParms.scheme().value).toEqual(seal.SchemeType.bgv.value)

    encParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.tc128)
    )
    const coeffModulus = encParms.coeffModulus()
    expect(coeffModulus.size()).toEqual(3)
    expect(coeffModulus.get(0)!.value()).toEqual(68719403009n)
    expect(coeffModulus.get(1)!.value()).toEqual(68719230977n)
    expect(coeffModulus.get(2)!.value()).toEqual(137438822401n)

    encParms.setPlainModulus(new seal.Modulus(786433n))
    expect(encParms.plainModulus().value()).toEqual(786433n)

    const parms = encParms.parmsId().values() as BigUint64Array
    expect(parms.length).toBe(4)
    expect(parms[0]).toBe(18229092140703004947n)
    expect(parms[1]).toBe(12584449816859468838n)
    expect(parms[2]).toBe(742207248595666993n)
    expect(parms[3]).toBe(16393914441491528673n)
  })
  test('It should set the poly modulus degree (ckks)', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.ckks)

    encParms.setPolyModulusDegree(4096)
    expect(encParms.polyModulusDegree()).toEqual(4096)
    expect(encParms.scheme().value).toEqual(seal.SchemeType.ckks.value)

    encParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.tc128)
    )
    const coeffModulus = encParms.coeffModulus()
    expect(coeffModulus.size()).toEqual(3)
    expect(coeffModulus.get(0)!.value()).toEqual(68719403009n)
    expect(coeffModulus.get(1)!.value()).toEqual(68719230977n)
    expect(coeffModulus.get(2)!.value()).toEqual(137438822401n)

    // CKKS doesn't use a plain modulus
    expect(() => encParms.setPlainModulus(new seal.Modulus(786433n))).toThrow()

    const parms = encParms.parmsId().values() as BigUint64Array
    expect(parms.length).toBe(4)
    expect(parms[0]).toBe(2448172225414288450n)
    expect(parms[1]).toBe(15682004596124352107n)
    expect(parms[2]).toBe(6314803095110952676n)
    expect(parms[3]).toBe(8761999974012542172n)
  })

  test('It should save/load from a base64 string', () => {
    const str = new seal.EncryptionParameters(
      seal.SchemeType.none
    ).saveToBase64(seal.ComprModeType.none)
    expect(str).toBe(
      'XqEQBAEAAAA5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXqEQBAEAAAAYAAAAAAAAAAAAAAAAAAAA'
    )

    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    // Load from a SchemeType.none
    encParms.loadFromBase64(str)
    expect(encParms.scheme().value).toBe(seal.SchemeType.none.value)
    expect(encParms.polyModulusDegree()).toBe(0)
    expect(encParms.coeffModulus().size()).toBe(0)
    expect((encParms.parmsId().values() as BigUint64Array).length).toBe(4)
  })
  test('It should save/load from a typed array', () => {
    const vec = new seal.EncryptionParameters(seal.SchemeType.none).saveToArray(
      seal.ComprModeType.none
    )

    expect(vec).toEqual(
      Uint8Array.from([
        94, 161, 16, 4, 1, 0, 0, 0, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 94, 161, 16, 4, 1, 0, 0, 0, 24, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
      ])
    )

    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    encParms.loadFromArray(vec)
    expect(encParms.scheme().value).toBe(seal.SchemeType.none.value)
    expect(encParms.polyModulusDegree()).toBe(0)
    expect(encParms.coeffModulus().size()).toBe(0)
    expect((encParms.parmsId().values() as BigUint64Array).length).toBe(4)
  })
  test('It should fail to load from a string', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.none)
    expect(() =>
      encParms.loadFromBase64(
        'XqEAASUAAAAAAAAAAAAAAHicY2CgCHywj1vIwCCBRQYAOAcCRw=='
      )
    ).toThrow()
  })
  test('It should fail to load from a typed array', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.none)
    const array = Uint8Array.from([
      94, 161, 16, 3, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 120, 156, 99, 103,
      128, 0, 0, 0, 64, 0, 8
    ])

    expect(() => encParms.loadFromArray(array)).toThrow()
  })
})
