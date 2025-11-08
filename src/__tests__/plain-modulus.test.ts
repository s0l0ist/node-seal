import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('PlainModulus', () => {
  test('It should create a batching modulus', () => {
    const modulus = seal.PlainModulus.Batching(4096, 20)
    expect(modulus.isZero()).toBe(false)
    expect(modulus.isPrime()).toBe(true)
    expect(modulus.bitCount()).toBe(20)
    expect(modulus.value()).toBe(1032193n)
  })

  test('It should create a batching vector of modulus', () => {
    const vecModulus = seal.PlainModulus.BatchingVector(
      4096,
      Int32Array.from([20, 20, 20])
    )
    const arr = seal.jsArrayFromVecModulus(vecModulus)
    expect(arr).toEqual([925697n, 974849n, 1032193n])
  })

  test('It should fail to create a batching modulus', () => {
    expect(() => seal.PlainModulus.Batching(4095, 20)).toThrow()
  })

  test('It should fail to create a batching vector of modulus', () => {
    expect(() =>
      seal.PlainModulus.BatchingVector(4095, Int32Array.from([20, 20, 20]))
    ).toThrow()
  })
})
