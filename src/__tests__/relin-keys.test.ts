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
  test('It should clone', () => {
    const key = new seal.RelinKeys()
    const clone = key.clone()
    expect(clone.isAliasOf(key)).toBe(true)
  })

  test('It should copy', () => {
    const key = new seal.RelinKeys()
    const copy = key.copy()
    expect(copy.isAliasOf(key)).toBe(false)
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
