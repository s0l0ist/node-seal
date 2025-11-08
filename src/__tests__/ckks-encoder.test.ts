import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type EncryptionParameters,
  type MainModule,
  type SEALContext
} from '../index_throws'

let seal: MainModule
let encParms: EncryptionParameters
let context: SEALContext
beforeAll(async () => {
  seal = await MainModuleFactory()
  const schemeType = seal.SchemeType.ckks
  const securityLevel = seal.SecLevelType.tc128
  const polyModulusDegree = 4096
  const coeffModulus = seal.CoeffModulus.Create(
    polyModulusDegree,
    Int32Array.from([46, 16, 46])
  )
  encParms = new seal.EncryptionParameters(schemeType)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(coeffModulus)
  context = new seal.SEALContext(encParms, true, securityLevel)
})

describe('CKKSEncoder', () => {
  test('It should encode Float64Array to a plaintext destination', () => {
    const encoder = new seal.CKKSEncoder(context)
    const arr = Float64Array.from({ length: encoder.slotCount() }, (_, i) => i)
    const plain = new seal.Plaintext()
    expect(plain.capacity()).toBe(0)
    expect(plain.isZero()).toBe(true)
    encoder.encode(arr, Math.pow(2, 20), plain)
    expect(plain.capacity()).toBe(8192)
    expect(plain.isZero()).toBe(false)
  })

  test('It should fail to encode an untyped array', () => {
    const encoder = new seal.CKKSEncoder(context)
    const arr = Array.from({ length: encoder.slotCount() }, (_, i) => i)
    const plain = new seal.Plaintext()
    expect(plain.capacity()).toBe(0)
    expect(plain.isZero()).toBe(true)
    try {
      encoder.encode(arr, Math.pow(2, 20), plain)
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual([
        'std::invalid_argument',
        'expected Float64Array'
      ])
    }
  })
  test('It should decode Float64Array ', () => {
    const encoder = new seal.CKKSEncoder(context)
    const arr = Float64Array.from({ length: encoder.slotCount() }, (_, i) => i)
    const plain = new seal.Plaintext()
    encoder.encode(arr, Math.pow(2, 20), plain)
    const arr2 = encoder.decodeFloat64(plain) as Float64Array
    const arrRounded = arr2.map(x => {
      return 0 + Math.round(x)
    })
    expect(arr).toEqual(arrRounded)
  })
})
