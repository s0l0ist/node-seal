import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type Context,
  type EncryptionParameters,
  type MainModule
} from '../index_throws'

let seal: MainModule
let encParms: EncryptionParameters
let context: Context

beforeAll(async () => {
  seal = await MainModuleFactory()

  const scheme = seal.SchemeType.bfv
  const polyModulusDegree = 1024
  const sec = seal.SecLevelType.tc128

  const coeffModulus = seal.CoeffModulus.Create(
    polyModulusDegree,
    Int32Array.from([27])
  )
  const plainModulus = seal.PlainModulus.Batching(polyModulusDegree, 20)

  encParms = new seal.EncryptionParameters(scheme)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(coeffModulus)
  encParms.setPlainModulus(plainModulus)

  context = new seal.Context(encParms, true, sec)
})

describe('Plaintext', () => {
  test('constructs empty', () => {
    const plain = new seal.Plaintext()
    expect(plain.coeffCount()).toBe(0)
    expect(plain.capacity()).toBe(0)
  })
  test('constructs with coeffCount', () => {
    const plain = new seal.Plaintext(4)
    expect(plain.coeffCount()).toBe(4)
    expect(plain.capacity()).toBe(4)
  })
  test('constructs with (coeffCount, capacity)', () => {
    const plain = new seal.Plaintext(8, 8)
    expect(plain.coeffCount()).toBe(8)
    expect(plain.capacity()).toBe(8)
  })
  test('class factories with pool', () => {
    const pool = seal.MemoryPoolHandle.Global()

    const p1 = seal.Plaintext.withPool(pool)
    expect(p1.coeffCount()).toBe(0)
    expect(p1.capacity()).toBe(0)

    const p2 = seal.Plaintext.withCoeffCountAndPool(4, pool)
    expect(p2.coeffCount()).toBe(4)
    expect(p2.capacity()).toBe(4)

    const p3 = seal.Plaintext.withCapAndCoeffCountAndPool(8, 8, pool)
    expect(p3.coeffCount()).toBe(8)
    expect(p3.capacity()).toBe(8)
  })
  test('It should clone / copy / assign', () => {
    const plain = new seal.Plaintext()
    const clone = plain.clone()
    expect(clone.isAliasOf(plain)).toBe(true)

    const copy = plain.copy()
    expect(copy.isAliasOf(plain)).toBe(false)

    const assign = new seal.Plaintext(4)
    expect(assign.coeffCount()).toBe(4)
    assign.assign(plain)
    expect(assign.coeffCount()).toBe(0)
  })
  test('reserve / shrinkToFit / release / resize', () => {
    const plain = new seal.Plaintext()
    expect(plain.coeffCount()).toBe(0)
    expect(plain.capacity()).toBe(0)

    plain.reserve(32)
    expect(plain.coeffCount()).toBe(0)
    expect(plain.capacity()).toBe(32)

    plain.resize(10)
    expect(plain.coeffCount()).toBe(10)
    expect(plain.capacity()).toBeGreaterThanOrEqual(10)

    plain.shrinkToFit()
    expect(plain.coeffCount()).toBe(10)
    expect(plain.capacity()).toBe(10)

    plain.release()
    expect(plain.capacity()).toBe(0)
    expect(plain.coeffCount()).toBe(0)
  })
  test('saveToBase64 / loadFromBase64 roundtrip', () => {
    const p1 = new seal.Plaintext(4)
    const s = p1.saveToBase64(seal.ComprModeType.none)

    const p2 = new seal.Plaintext()
    p2.loadFromBase64(context, s)

    expect(p2.coeffCount()).toBe(4)
  })
  test('saveToVec / loadFromVec roundtrip', () => {
    const p1 = new seal.Plaintext(5)
    const arr = p1.saveToVec(seal.ComprModeType.none) as Uint8Array

    const p2 = new seal.Plaintext()
    p2.loadFromVec(context, arr)

    expect(p2.coeffCount()).toBe(5)
  })
  test('zero/polynomial helpers', () => {
    const plain = new seal.Plaintext(2)
    expect(plain.isZero()).toBe(true)
    expect(plain.toString()).toBe('0')
    expect(plain.significantCoeffCount()).toBe(0)
    expect(plain.nonzeroCoeffCount()).toBe(0)
  })
  test('delete', () => {
    const plain = new seal.Plaintext()
    plain.delete()
    expect(plain.isDeleted()).toBe(true)
  })
  test('bad args surface wasm error', () => {
    const plain = new seal.Plaintext()
    try {
      plain.resize(-2)
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual(['std::logic_error', 'unsigned overflow'])
    }
  })
})
