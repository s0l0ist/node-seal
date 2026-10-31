import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('UtilHashFunction', () => {
  test('It should hash a BigUint64Array', () => {
    const arr = BigUint64Array.from([
      0n,
      0n,
      1n,
      1n << 63n,
      (1n << 64n) - 1n,
      0n
    ])
    const vec = seal.UtilHashFunction.hash(arr.subarray(1, 5)) as BigUint64Array
    expect(vec.length).toBe(seal.UtilHashFunction.hashBlockUint64Count)
    expect(vec.byteLength).toBe(seal.UtilHashFunction.hashBlockByteCount)

    // BLAKE2b-256 of the four little-endian uint64 values.
    expect(vec).toEqual(
      BigUint64Array.from([
        956230148655445236n,
        9441186720718332020n,
        14660119233030045745n,
        3465740400057470831n
      ])
    )
  })

  test('It should return an independent hash result', () => {
    const arr = BigUint64Array.from([0n, 1n, 2n, 3n])
    const vec = seal.UtilHashFunction.hash(arr) as BigUint64Array
    const expected = vec.slice()

    seal.UtilHashFunction.hash(BigUint64Array.from([2n, 3n, 4n, 5n]))
    expect(vec).toEqual(expected)
  })

  test('It should fail to hash a BigInt64Array', () => {
    const arr = BigInt64Array.from([1n])
    try {
      seal.UtilHashFunction.hash(arr)
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual([
        'std::invalid_argument',
        'expected BigUint64Array'
      ])
    }
  })

  test('It should fail to hash a Uint32Array', () => {
    const arr = Uint32Array.from([1])
    try {
      seal.UtilHashFunction.hash(arr)
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual([
        'std::invalid_argument',
        'expected BigUint64Array'
      ])
    }
  })

  test('It should fail to hash a null value', () => {
    try {
      seal.UtilHashFunction.hash(null)
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual([
        'std::invalid_argument',
        'expected BigUint64Array'
      ])
    }
  })
})
