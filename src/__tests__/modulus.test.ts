import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('Modulus', () => {
  test('It construct from a prime value', () => {
    const modulus = new seal.Modulus(786433n)
    expect(modulus.isZero()).toBe(false)
    expect(modulus.isPrime()).toBe(true)
    expect(modulus.bitCount()).toBe(20)
    expect(modulus.value()).toBe(786433n)
  })

  test('It construct from a zero value', () => {
    const modulus = new seal.Modulus(0n)
    expect(modulus.isZero()).toBe(true)
    expect(modulus.isPrime()).toBe(false)
    expect(modulus.bitCount()).toBe(0)
    expect(modulus.value()).toBe(0n)
  })

  test('It can set a value', () => {
    const modulus = new seal.Modulus(0n)
    modulus.setValue(7n)
    expect(modulus.isZero()).toBe(false)
    expect(modulus.isPrime()).toBe(true)
    expect(modulus.bitCount()).toBe(3)
    expect(modulus.value()).toBe(7n)
  })

  test('Modulus(1n) throws', () => {
    expect(() => new seal.Modulus(1n)).toThrow()
  })

  test('Modulus(1<<61) throws exact message', () => {
    expect(() => new seal.Modulus(1n << 61n)).toThrow()
  })

  test('Modulus#setValue(1n) throws exact message', () => {
    const m = new seal.Modulus(3n)
    expect(() => m.setValue(1n)).toThrow()
  })

  test('Modulus#setValue(>61 bits) throws exact message', () => {
    const m = new seal.Modulus(3n)
    expect(() => m.setValue(1n << 61n)).toThrow()
  })

  test('It can save/load from a string', () => {
    const m = new seal.Modulus(3n)
    const str = m.saveToBase64(seal.ComprModeType.none)
    // The header records serialization format 4.0, not the library version.
    expect(str).toBe('XqEQBAAAAAAYAAAAAAAAAAMAAAAAAAAA')
    const m2 = new seal.Modulus(0n)
    m2.loadFromBase64(str)
    expect(m2.value()).toBe(3n)
  })

  test('It should reject invalid Base64 lengths', () => {
    const modulus = new seal.Modulus(0n)
    for (const encoded of ['A', 'AAAAA', 'Zg=', 'Zg===']) {
      try {
        modulus.loadFromBase64(encoded)
        expect(true).toBe(false)
      } catch (e: any) {
        expect(e.constructor.name).toBe('Exception')
        expect(e.message).toEqual(['std::invalid_argument', 'invalid base64'])
      }
    }
  })

  test('It should reject invalid Base64 characters', () => {
    const modulus = new seal.Modulus(0n)
    for (const encoded of [
      '!!!!', 'AA A', 'AA\nA', 'AA-A', 'AA_A', 'AA\0A', 'AAéA',
      'AAAA!AAAAAAAAAAA', 'AAAAAAAAAAAAAAA!'
    ]) {
      try {
        modulus.loadFromBase64(encoded)
        expect(true).toBe(false)
      } catch (e: any) {
        expect(e.constructor.name).toBe('Exception')
        expect(e.message).toEqual(['std::invalid_argument', 'invalid base64'])
      }
    }
  })

  test('It should reject invalid Base64 padding', () => {
    const modulus = new seal.Modulus(0n)
    for (const encoded of ['=AAA', 'A=AA', 'AA=A', 'A===', '====', 'Zg==AAAA']) {
      try {
        modulus.loadFromBase64(encoded)
        expect(true).toBe(false)
      } catch (e: any) {
        expect(e.constructor.name).toBe('Exception')
        expect(e.message).toEqual(['std::invalid_argument', 'invalid base64'])
      }
    }
  })

  test('It can save/load from a vec', () => {
    const m = new seal.Modulus(3n)
    const vec = m.saveToArray(seal.ComprModeType.none)
    expect(vec).toEqual(
      Uint8Array.from([
        94, 161, 16, 4, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0,
        0, 0
      ])
    )
    const m2 = new seal.Modulus(0n)
    m2.loadFromArray(vec)
    expect(m2.value()).toBe(3n)
  })

  test('It should load from a Uint8Array subarray', () => {
    const m = new seal.Modulus(3n)
    const vec = m.saveToArray(seal.ComprModeType.none) as Uint8Array
    const array = new Uint8Array(vec.length + 8).fill(255)
    array.set(vec, 4)
    const m2 = new seal.Modulus(0n)

    m2.loadFromArray(array.subarray(4, 4 + vec.length))
    expect(m2.value()).toBe(3n)
  })

  test('It should keep a saved array after deleting the modulus', () => {
    const m = new seal.Modulus(3n)
    const vec = m.saveToArray(seal.ComprModeType.none) as Uint8Array
    const expected = vec.slice()
    m.delete()

    const m2 = new seal.Modulus(17n)
    const vec2 = m2.saveToArray(seal.ComprModeType.none) as Uint8Array
    vec2.fill(0)
    expect(vec).toEqual(expected)
  })
})
