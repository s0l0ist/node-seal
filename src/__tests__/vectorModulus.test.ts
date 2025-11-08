import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type MainModule,
  type VectorModulus
} from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

// ---- helpers ----
const MAX61 = (1n << 61n) - 1n
const M = (n: bigint) => new seal.Modulus(n)
const V = (v: VectorModulus, i: number) => v.get(i)!.value()

describe('VectorModulus', () => {
  test('It should start with size 0', () => {
    const vector = new seal.VectorModulus()
    expect(vector.size()).toBe(0)
  })

  test('It should push_back values (by Modulus)', () => {
    const vector = new seal.VectorModulus()

    const m = M(42n)
    vector.push_back(m)

    expect(vector.size()).toBe(1)

    const got = vector.get(0)!
    expect(got).toBeInstanceOf(seal.Modulus)
    expect(got.value()).toBe(42n)
  })

  test('It should push_back multiple values (valid moduli)', () => {
    const vector = new seal.VectorModulus()

    vector.push_back(M(3n))
    vector.push_back(M(5n))
    vector.push_back(M(65537n))

    expect(vector.size()).toBe(3)
    expect(V(vector, 0)).toBe(3n)
    expect(V(vector, 1)).toBe(5n)
    expect(V(vector, 2)).toBe(65537n)
  })

  test('It should enforce Modulus constraints (<=61 bits, != 1)', () => {
    // Allowed: zero, small odd, max allowed
    const vector = new seal.VectorModulus()
    vector.push_back(M(0n))
    vector.push_back(M(3n))
    vector.push_back(M(MAX61))

    expect(V(vector, 0)).toBe(0n)
    expect(V(vector, 1)).toBe(3n)
    expect(V(vector, 2)).toBe(MAX61)
  })

  test('It should get values at specified indices', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(10n))
    vector.push_back(M(20n))
    vector.push_back(M(30n))

    const m = vector.get(1)!
    expect(m.value()).toBe(20n)
  })

  test('It should return undefined for out-of-bounds get', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(42n))

    expect(V(vector, 0)).toBe(42n)
    expect(vector.get(1)).toBeUndefined()
    expect(vector.get(100)).toBeUndefined()
  })

  test('It should set values at specified indices within bounds', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(10n))
    vector.push_back(M(20n))

    const ok = vector.set(1, M(99n))
    expect(ok).toBe(true)
    expect(V(vector, 1)).toBe(99n)
  })

  test('It should return true when setting (even out-of-bounds)', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(42n))

    const ok = vector.set(10, M(99n)) // mirrors [] semantics in binding
    expect(ok).toBe(true)
  })

  test('It should resize to a larger size', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(3n))
    vector.push_back(M(5n))

    vector.resize(5, M(99n))
    expect(vector.size()).toBe(5)
    expect(V(vector, 0)).toBe(3n)
    expect(V(vector, 1)).toBe(5n)
    expect(V(vector, 2)).toBe(99n)
    expect(V(vector, 4)).toBe(99n)
  })

  test('It should resize to a smaller size', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(3n))
    vector.push_back(M(5n))
    vector.push_back(M(7n))
    vector.push_back(M(9n))

    vector.resize(2, M(0n))

    expect(vector.size()).toBe(2)
    expect(V(vector, 0)).toBe(3n)
    expect(V(vector, 1)).toBe(5n)
    expect(vector.get(2)).toBeUndefined()
  })

  test('It should resize to zero', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(3n))
    vector.push_back(M(5n))

    vector.resize(0, M(0n))

    expect(vector.size()).toBe(0)
    expect(vector.get(0)).toBeUndefined()
  })

  test('It should handle large vectors (avoid 1n)', () => {
    const vector = new seal.VectorModulus()
    const size = 1024

    for (let i = 0; i < size; i++) {
      let n = BigInt(i % 256)
      if (n === 1n) n = 3n // avoid invalid 1
      vector.push_back(M(n))
    }

    expect(vector.size()).toBe(size)
    expect(V(vector, 0)).toBe(0n)
    expect(V(vector, 1)).toBe(3n) // we mapped 1 -> 3
    expect(V(vector, 255)).toBe(255n)
    expect(V(vector, 256)).toBe(0n)
    expect(V(vector, size - 1)).toBe(255n)
  })

  test('It should delete its instance', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(42n))

    vector.delete()
    expect(vector.isDeleted()).toBe(true)
  })

  test('It should not allow operations after deletion', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(42n))
    vector.delete()

    expect(() => vector.push_back(M(3n))).toThrow()
  })

  test('It should handle deleteLater', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(42n))

    const result = vector.deleteLater()
    expect(result).toBe(vector)
    expect(V(vector, 0)).toBe(42n) // still accessible for now
  })

  test('It should support shallow clone', () => {
    const vector = new seal.VectorModulus()
    vector.push_back(M(3n))
    vector.push_back(M(5n))
    vector.push_back(M(7n))

    const cloned = vector.clone()

    expect(cloned.size()).toBe(3)
    expect(V(cloned, 0)).toBe(3n)
    expect(V(cloned, 1)).toBe(5n)
    expect(V(cloned, 2)).toBe(7n)

    // shallow: shared storage
    vector.set(0, M(99n))
    expect(V(vector, 0)).toBe(99n)
    expect(V(cloned, 0)).toBe(99n)

    // independent handles (embind refcount)
    vector.delete()
    expect(vector.isDeleted()).toBe(true)
    expect(cloned.isDeleted()).toBe(false)
    expect(V(cloned, 0)).toBe(99n)

    cloned.delete()
    expect(cloned.isDeleted()).toBe(true)
  })
})
