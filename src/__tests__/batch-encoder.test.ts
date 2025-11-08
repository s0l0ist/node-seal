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
  const schemeType = seal.SchemeType.bfv
  const securityLevel = seal.SecLevelType.tc128
  const polyModulusDegree = 1024
  const coeffModulus = seal.CoeffModulus.Create(
    polyModulusDegree,
    Int32Array.from([27])
  )
  const plainModulus = seal.PlainModulus.Batching(polyModulusDegree, 20)
  encParms = new seal.EncryptionParameters(schemeType)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(coeffModulus)
  encParms.setPlainModulus(plainModulus)
  context = new seal.SEALContext(encParms, true, securityLevel)
})

describe('BatchEncoder', () => {
  test('It should encode BigUint64Array to a plaintext destination', () => {
    const encoder = new seal.BatchEncoder(context)
    const arr = BigUint64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(i)
    )
    const plain = new seal.Plaintext()
    expect(plain.capacity()).toBe(0)
    expect(plain.isZero()).toBe(true)
    encoder.encode(arr, plain)
    expect(plain.capacity()).toBe(1024)
    expect(plain.isZero()).toBe(false)
  })
  test('It should encode BigInt64Array to a plaintext destination', () => {
    const encoder = new seal.BatchEncoder(context)
    const arr = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    expect(plain.capacity()).toBe(0)
    expect(plain.isZero()).toBe(true)
    encoder.encode(arr, plain)
    expect(plain.capacity()).toBe(1024)
    expect(plain.isZero()).toBe(false)
  })

  test('It should fail to encode an untyped array', () => {
    const encoder = new seal.BatchEncoder(context)
    const arr = Array.from({ length: encoder.slotCount() }, (_, i) => i)
    const plain = new seal.Plaintext()
    expect(plain.capacity()).toBe(0)
    expect(plain.isZero()).toBe(true)
    try {
      encoder.encode(arr, plain)
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual([
        'std::invalid_argument',
        'expected one of BigInt64Array, BigUint64Array'
      ])
    }
  })
  test('It should decode BigUint64Array ', () => {
    const encoder = new seal.BatchEncoder(context)
    const arr = BigUint64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(arr, plain)
    const arr2 = encoder.decodeBigUint64(plain) as BigUint64Array
    expect(arr).toEqual(arr2)
  })
  test('It should decode BigInt64Array ', () => {
    const encoder = new seal.BatchEncoder(context)
    const arr = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(arr, plain)
    const arr2 = encoder.decodeBigInt64(plain) as BigUint64Array
    expect(arr).toEqual(arr2)
  })
})
