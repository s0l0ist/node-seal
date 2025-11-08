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
    expect(str).toBe('XqEQBAEAAAAYAAAAAAAAAAMAAAAAAAAA')
    const m2 = new seal.Modulus(0n)
    m2.loadFromBase64(str)
    expect(m2.value()).toBe(3n)
  })

  test('It can save/load from a vec', () => {
    const m = new seal.Modulus(3n)
    const vec = m.saveToVec(seal.ComprModeType.none)
    expect(vec).toEqual(
      Uint8Array.from([
        94, 161, 16, 4, 1, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0,
        0, 0
      ])
    )
    const m2 = new seal.Modulus(0n)
    m2.loadFromVec(vec)
    expect(m2.value()).toBe(3n)
  })
})
