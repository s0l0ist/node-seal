import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type MainModule,
  type SEALContext
} from '../index_throws'

let seal: MainModule
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
  const encParms = new seal.EncryptionParameters(schemeType)
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
  test('It should encode a Float64Array subarray and decode with pool', () => {
    const encoder = new seal.CKKSEncoder(context)
    const arr = Float64Array.from([NaN, -3, 0, 2, Infinity])
    const plain = new seal.Plaintext()
    const pool = seal.MemoryPoolHandle.New(false)
    encoder.encodeWithPool(arr.subarray(1, 4), Math.pow(2, 20), plain, pool)
    const arr2 = encoder.decodeFloat64WithPool(plain, pool) as Float64Array
    const expected = new Float64Array(encoder.slotCount())
    expected.set([-3, 0, 2])
    expect(arr2.map(x => 0 + Math.round(x))).toEqual(expected)
    expect(pool.allocByteCount()).toBeGreaterThan(0)
  })

  test('It should reject non-finite values with encode', () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      const encoder = new seal.CKKSEncoder(context)
      const plain = new seal.Plaintext()
      const scale = Math.pow(2, 20)

      try {
        encoder.encode(Float64Array.from([1, 2, value]), scale, plain)
        expect(true).toBe(false)
      } catch (e: any) {
        expect(e.constructor.name).toBe('Exception')
        expect(e.message).toEqual([
          'std::invalid_argument',
          'values must be finite'
        ])
      }
      expect(plain.capacity()).toBe(0)
    }
  })

  test('It should reject non-finite scale with encode', () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      const encoder = new seal.CKKSEncoder(context)
      const plain = new seal.Plaintext()
      const arr = Float64Array.from([1, 2, 3])

      try {
        encoder.encode(arr, value, plain)
        expect(true).toBe(false)
      } catch (e: any) {
        expect(e.constructor.name).toBe('Exception')
        expect(e.message).toEqual([
          'std::invalid_argument',
          'scale out of bounds'
        ])
      }
      expect(plain.capacity()).toBe(0)
    }
  })

  test('It should reject non-finite values with encodeWithPool', () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      const encoder = new seal.CKKSEncoder(context)
      const plain = new seal.Plaintext()
      const pool = seal.MemoryPoolHandle.New(false)
      const scale = Math.pow(2, 20)

      try {
        encoder.encodeWithPool(Float64Array.from([1, 2, value]), scale, plain, pool)
        expect(true).toBe(false)
      } catch (e: any) {
        expect(e.constructor.name).toBe('Exception')
        expect(e.message).toEqual([
          'std::invalid_argument',
          'values must be finite'
        ])
      }
      expect(plain.capacity()).toBe(0)
    }
  })

  test('It should reject non-finite scale with encodeWithPool', () => {
    for (const value of [NaN, Infinity, -Infinity]) {
      const encoder = new seal.CKKSEncoder(context)
      const plain = new seal.Plaintext()
      const pool = seal.MemoryPoolHandle.New(false)
      const arr = Float64Array.from([1, 2, 3])

      try {
        encoder.encodeWithPool(arr, value, plain, pool)
        expect(true).toBe(false)
      } catch (e: any) {
        expect(e.constructor.name).toBe('Exception')
        expect(e.message).toEqual([
          'std::invalid_argument',
          'scale out of bounds'
        ])
      }
      expect(plain.capacity()).toBe(0)
    }
  })

  test('It should return independent decoded arrays', () => {
    const encoder = new seal.CKKSEncoder(context)
    const arr = Float64Array.from([-3, 0, 2])
    const plain = new seal.Plaintext()
    encoder.encode(arr, Math.pow(2, 20), plain)
    const arr2 = encoder.decodeFloat64(plain) as Float64Array
    arr2[0] = 99
    const arr3 = encoder.decodeFloat64(plain) as Float64Array
    expect(arr3[0]).toBeCloseTo(-3, 2)
    encoder.encode(Float64Array.from([7]), Math.pow(2, 20), plain)
    expect(arr3.slice(0, 3).map(x => 0 + Math.round(x))).toEqual(arr)
  })
})
