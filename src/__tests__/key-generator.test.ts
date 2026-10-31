import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type EncryptionParameters,
  type KeyGenerator,
  type MainModule,
  type SEALContext
} from '../index_throws'

let seal: MainModule
let encParms: EncryptionParameters
let context: SEALContext
let keyGenerator: KeyGenerator

beforeAll(async () => {
  seal = await MainModuleFactory()
  const schemeType = seal.SchemeType.bfv
  const securityLevel = seal.SecLevelType.tc128
  const polyModulusDegree = 4096
  const coeffModulus = seal.CoeffModulus.BFVDefault(
    polyModulusDegree,
    securityLevel
  )
  const plainModulus = seal.PlainModulus.Batching(polyModulusDegree, 20)
  encParms = new seal.EncryptionParameters(schemeType)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(coeffModulus)
  encParms.setPlainModulus(plainModulus)
  context = new seal.SEALContext(encParms, true, securityLevel)
  keyGenerator = new seal.KeyGenerator(context)
})

describe('KeyGenerator', () => {
  test('It should create a secret key', () => {
    const key = keyGenerator.secretKey()
    const vec = key.saveToArray(seal.ComprModeType.none) as Uint8Array
    expect(vec.length).toEqual(98392)
  })
  test('It should return independent copies of the secret key', () => {
    const keyGen = new seal.KeyGenerator(context)
    const key = keyGen.secretKey()
    const copy = keyGen.secretKey()
    const bytes = key.saveToArray(seal.ComprModeType.none)

    key.assign(new seal.SecretKey())

    expect(copy.saveToArray(seal.ComprModeType.none)).toEqual(bytes)
    expect(keyGen.secretKey().saveToArray(seal.ComprModeType.none)).toEqual(
      bytes
    )
  })
  test('It should keep generated keys after deleting the key generator', () => {
    const keyGen = new seal.KeyGenerator(context)
    const steps = Int32Array.from([1])
    const keys = [
      keyGen.secretKey(),
      keyGen.createPublicKey(),
      keyGen.createPublicKeySerializable(),
      keyGen.createRelinKeys(),
      keyGen.createRelinKeysSerializable(),
      keyGen.createGaloisKeys(),
      keyGen.createGaloisKeysSerializable(),
      keyGen.createGaloisKeysWithSteps(steps),
      keyGen.createGaloisKeysSerializableWithSteps(steps)
    ]
    const saved = keys.map(key => key.saveToBase64(seal.ComprModeType.none))
    keyGen.delete()

    for (let i = 0; i < keys.length; i++) {
      expect(keys[i].saveToBase64(seal.ComprModeType.none)).toBe(saved[i])
    }
  })
  test('It should create a public key', () => {
    const key = keyGenerator.createPublicKey()
    const vec = key.saveToArray(seal.ComprModeType.none) as Uint8Array
    expect(vec.length).toEqual(196721)
  })
  test('It should create a serializable public key', () => {
    const key = keyGenerator.createPublicKeySerializable()
    const vec = key.saveToArray(seal.ComprModeType.none) as Uint8Array
    expect(vec.length).toEqual(98498)
  })
  test('It should create relin keys', () => {
    const key = keyGenerator.createRelinKeys()
    const vec = key.saveToArray(seal.ComprModeType.none) as Uint8Array
    expect(vec.length).toEqual(393506)
  })
  test('It should create serializable relin keys', () => {
    const key = keyGenerator.createRelinKeysSerializable()
    const vec = key.saveToArray(seal.ComprModeType.none) as Uint8Array
    expect(vec.length).toEqual(197060)
  })
  test('It should create galois keys', () => {
    const key = keyGenerator.createGaloisKeys()
    const vec = key.saveToArray(seal.ComprModeType.none) as Uint8Array
    expect(vec.length).toEqual(8688548)
  })
  test('It should create serializable galois keys', () => {
    const key = keyGenerator.createGaloisKeysSerializable()
    const vec = key.saveToArray(seal.ComprModeType.none) as Uint8Array
    expect(vec.length).toEqual(4366736)
  })
  test('It should create galois keys with steps', () => {
    const key = keyGenerator.createGaloisKeysWithSteps(
      Int32Array.from([1, 2, 4, 8, 16])
    )
    const vec = key.saveToArray(seal.ComprModeType.none) as Uint8Array
    expect(vec.length).toEqual(2000034)
  })
  test('It should create serializable galois keys with steps', () => {
    const key = keyGenerator.createGaloisKeysSerializableWithSteps(
      Int32Array.from([1, 2, 4, 8, 16])
    )
    const vec = key.saveToArray(seal.ComprModeType.none) as Uint8Array
    expect(vec.length).toEqual(1017804)
  })
})
