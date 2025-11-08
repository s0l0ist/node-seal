import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type Context,
  type EncryptionParameters,
  type Encryptor,
  type KeyGenerator,
  type MainModule
} from '../index_throws'
let seal: MainModule
let encParms: EncryptionParameters
let context: Context
let keygen: KeyGenerator
let encryptor: Encryptor

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

  keygen = new seal.KeyGenerator(context)
  const pub = keygen.createPublicKey()
  encryptor = new seal.Encryptor(context, pub)
})

describe('Ciphertext', () => {
  test('constructs empty', () => {
    const ct = new seal.Ciphertext()
    expect(ct.size()).toBe(0)
    expect(ct.sizeCapacity()).toBe(0)
  })
  test('constructs with context', () => {
    const ct = new seal.Ciphertext(context)
    expect(ct.size()).toBe(0)
    expect(ct.sizeCapacity()).toBe(2)
    expect(ct.polyModulusDegree()).toBe(1024)
  })
  test('class factories with pool', () => {
    const pool = seal.MemoryPoolHandle.Global()

    const c1 = seal.Ciphertext.withPool(pool)
    expect(c1.size()).toBe(0)

    const c2 = seal.Ciphertext.withContextAndPool(context, pool)
    expect(c2.polyModulusDegree()).toBe(1024)
  })
  test('clone / copy / assign', () => {
    const ct = new seal.Ciphertext(context)
    encryptor.encryptZero(ct)

    const clone = ct.clone()
    expect(clone.isAliasOf(ct)).toBe(true)

    const copy = ct.copy()
    expect(copy.isAliasOf(ct)).toBe(false)

    const other = new seal.Ciphertext()
    other.assign(ct)
    expect(other.size()).toBe(ct.size())
  })
  test('reserve / resize / release', () => {
    const ct = new seal.Ciphertext()
    expect(ct.size()).toBe(0)
    expect(ct.sizeCapacity()).toBe(0)

    ct.reserve(context, 4)
    expect(ct.sizeCapacity()).toBeGreaterThanOrEqual(4)

    ct.resize(2)
    expect(ct.size()).toBe(2)

    ct.release()
    expect(ct.size()).toBe(0)
    expect(ct.sizeCapacity()).toBe(0)
  })
  test('parmsId / pool / flags', () => {
    const ct = new seal.Ciphertext()
    encryptor.encryptZero(ct)

    const pid = ct.parmsId()
    expect(pid.values()).toEqual(
      BigUint64Array.from([
        17476483468957856337n,
        2996125235791699026n,
        16665771614849413640n,
        17359866543464280799n
      ])
    )

    expect(ct.isNttForm()).toBe(false)
    expect(ct.isTransparent()).toBe(false)
  })
  test('shape and modulus info', () => {
    const ct = new seal.Ciphertext()
    encryptor.encryptZero(ct)

    expect(ct.polyModulusDegree()).toBe(1024)
    expect(ct.coeffModulusSize()).toBeGreaterThanOrEqual(1)
    expect(ct.size()).toBeGreaterThanOrEqual(1)
    expect(ct.sizeCapacity()).toBeGreaterThanOrEqual(ct.size())
  })
  test('scale / correctionFactor / setScale', () => {
    const ct = new seal.Ciphertext()
    encryptor.encryptZero(ct)

    const s0 = ct.scale()
    const c0 = ct.correctionFactor()
    expect(typeof s0).toBe('number')
    expect(typeof c0).toBe('number')

    ct.setScale(3.14159)
    expect(ct.scale()).toBeCloseTo(3.14159)
  })
  test('saveToBase64 / loadFromBase64 roundtrip', () => {
    const ct1 = new seal.Ciphertext()
    encryptor.encryptZero(ct1)

    const s = ct1.saveToBase64(seal.ComprModeType.none)

    const ct2 = new seal.Ciphertext()
    ct2.loadFromBase64(context, s)

    expect(ct2.size()).toBe(ct1.size())
    expect(ct2.polyModulusDegree()).toBe(ct1.polyModulusDegree())
  })
  test('saveToVec / loadFromVec roundtrip', () => {
    const ct1 = new seal.Ciphertext()
    encryptor.encryptZero(ct1)

    const arr = ct1.saveToVec(seal.ComprModeType.none) as Uint8Array
    expect(arr).toBeInstanceOf(Uint8Array)

    const ct2 = new seal.Ciphertext()
    ct2.loadFromVec(context, arr)

    expect(ct2.size()).toBe(ct1.size())
    expect(ct2.polyModulusDegree()).toBe(ct1.polyModulusDegree())
  })
  test('delete', () => {
    const ct = new seal.Ciphertext()
    ct.delete()
    expect(ct.isDeleted()).toBe(true)
  })
  test('bad args surface wasm error', () => {
    const ct = new seal.Ciphertext()
    try {
      ct.resize(-2)
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual(['std::invalid_argument', 'invalid size'])
    }
  })
})
