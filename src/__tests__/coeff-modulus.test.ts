import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('CoeffModulus', () => {
  test('It should return a max bit count with security level (none)', () => {
    const count = seal.CoeffModulus.MaxBitCount(4096, seal.SecLevelType.none)
    expect(count).toBe(2147483647)
  })
  test('It should return a max bit count with security level (tc128)', () => {
    const count = seal.CoeffModulus.MaxBitCount(4096, seal.SecLevelType.tc128)
    expect(count).toBe(109)
  })
  test('It should return a max bit count with security level (tc192)', () => {
    const count = seal.CoeffModulus.MaxBitCount(4096, seal.SecLevelType.tc192)
    expect(count).toBe(75)
  })
  test('It should return a max bit count with security level (tc256)', () => {
    const count = seal.CoeffModulus.MaxBitCount(4096, seal.SecLevelType.tc256)
    expect(count).toBe(58)
  })

  test('It should throw with security level (none)', () => {
    expect(() =>
      seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.none)
    ).toThrow()
  })
  test('It should a return a default Vector of Modulus with security level (tc128)', () => {
    const vec = seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.tc128)
    const arr = seal.jsArrayFromVecModulus(vec)
    expect(arr).toEqual([68719403009n, 68719230977n, 137438822401n])
  })
  test('It should a return a default Vector of Modulus with security level (tc192)', () => {
    const vec = seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.tc192)
    const arr = seal.jsArrayFromVecModulus(vec)
    expect(arr).toEqual([33538049n, 33349633n, 33292289n])
  })
  test('It should a return a default Vector of Modulus with security level (tc256)', () => {
    const vec = seal.CoeffModulus.BFVDefault(4096, seal.SecLevelType.tc256)
    const arr = seal.jsArrayFromVecModulus(vec)
    expect(arr).toEqual([288230376135196673n])
  })

  test('It should create from Vector of bit sizes', () => {
    const vec = seal.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
    const arr = seal.jsArrayFromVecModulus(vec)
    expect(arr).toEqual([70368743587841n, 40961n, 70368743669761n])
  })
})
