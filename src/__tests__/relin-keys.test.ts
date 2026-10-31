import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type EncryptionParameters,
  type KeyGenerator,
  type MainModule,
  type SEALContext
} from '../index_throws'

let seal: MainModule
let keyGen: KeyGenerator
let context: SEALContext
let parms: EncryptionParameters

beforeAll(async () => {
  seal = await MainModuleFactory()
  const polyModulusDegree = 4096
  parms = new seal.EncryptionParameters(seal.SchemeType.bfv)
  const securityLevel = seal.SecLevelType.tc128
  parms.setPolyModulusDegree(polyModulusDegree)
  parms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(polyModulusDegree, securityLevel)
  )
  parms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, 20))

  context = new seal.SEALContext(parms, true, securityLevel)
  keyGen = new seal.KeyGenerator(context)
})

describe('RelinKeys', () => {
  test('It should find keys by secret key power', () => {
    const key = keyGen.createRelinKeys()
    expect(key.getIndex(2)).toBe(0)
    expect(key.getIndex(3)).toBe(1)
    expect(key.hasKey(2)).toBe(true)
    expect(key.hasKey(3)).toBe(false)
    expect(new seal.RelinKeys().hasKey(2)).toBe(false)
  })
  test('It should return a copy of a key', () => {
    const key = keyGen.createRelinKeys()
    const components = key.key(2)
    const bytes = components[0].saveToArray(seal.ComprModeType.none)

    expect(components.length).toBe(parms.coeffModulus().size() - 1)
    const loaded = new seal.PublicKey()
    loaded.loadFromArray(context, bytes)
    expect(loaded.saveToArray(seal.ComprModeType.none)).toEqual(bytes)

    components[0].assign(new seal.PublicKey())
    expect(key.key(2)[0].saveToArray(seal.ComprModeType.none)).toEqual(bytes)
  })
  test('It should keep a returned key after deleting the keys', () => {
    const key = keyGen.createRelinKeys()
    const component = key.key(2)[0]
    const bytes = component.saveToArray(seal.ComprModeType.none)
    key.delete()

    expect(component.saveToArray(seal.ComprModeType.none)).toEqual(bytes)
  })
  test('It should fail to return a missing key', () => {
    const key = keyGen.createRelinKeys()
    expect(() => key.key(1)).toThrow()
    expect(() => key.key(3)).toThrow()
    expect(() => new seal.RelinKeys().key(2)).toThrow()
  })
  test('It should clone', () => {
    const key = new seal.RelinKeys()
    const clone = key.clone()
    expect(clone.isAliasOf(key)).toBe(true)
  })

  test('It should copy', () => {
    const key = keyGen.createRelinKeys()
    const saved = key.saveToBase64(seal.ComprModeType.none)
    const copy = key.copy()
    expect(copy.isAliasOf(key)).toBe(false)
    expect(copy.saveToBase64(seal.ComprModeType.none)).toBe(saved)

    copy.assign(new seal.RelinKeys())
    expect(key.saveToBase64(seal.ComprModeType.none)).toBe(saved)
  })

  test('It should assign', () => {
    const realKey = keyGen.createRelinKeys()
    const emptyKey = new seal.RelinKeys()

    emptyKey.assign(realKey)

    expect(emptyKey.saveToBase64(seal.ComprModeType.none)).toEqual(
      realKey.saveToBase64(seal.ComprModeType.none)
    )
  })

  test('It should delete', () => {
    const key = new seal.RelinKeys()
    key.delete()
    expect(key.isDeleted()).toBe(true)
  })

  test('It should save / load from base64 string', () => {
    const key1 = keyGen.createRelinKeys()
    const key2 = new seal.RelinKeys()

    const base64Str = key1.saveToBase64(seal.ComprModeType.none)
    key2.loadFromBase64(context, base64Str)

    expect(key2.saveToBase64(seal.ComprModeType.none)).toEqual(
      key1.saveToBase64(seal.ComprModeType.none)
    )
  })

  test('It should save / load from vec', () => {
    const key1 = keyGen.createRelinKeys()
    const key2 = new seal.RelinKeys()

    const vec = key1.saveToArray(seal.ComprModeType.none)
    key2.loadFromArray(context, vec)

    expect(key2.saveToBase64(seal.ComprModeType.none)).toEqual(
      key1.saveToBase64(seal.ComprModeType.none)
    )
  })
})
