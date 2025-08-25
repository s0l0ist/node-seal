import { Context } from '../implementation/context'
import { EncryptionParameters } from '../implementation/encryption-parameters'
import { KeyGenerator } from '../implementation/key-generator'
import { Modulus } from '../implementation/modulus'
import { SEALLibrary } from '../implementation/seal'
import { SecretKey } from '../implementation/secret-key'
import { Vector } from '../implementation/vector'
import SEAL from '../throws_wasm_node_umd'

let seal: SEALLibrary
let context: Context
let coeffModulus: Vector
let plainModulus: Modulus
let encParms: EncryptionParameters
let keyGenerator: KeyGenerator
let secretKey: SecretKey
let invalidParms: EncryptionParameters
let invalidContext: Context
beforeAll(async () => {
  seal = await SEAL()
  const schemeType = seal.SchemeType.bfv
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 4096
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  encParms = seal.EncryptionParameters(schemeType)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(coeffModulus)
  encParms.setPlainModulus(plainModulus)
  context = seal.Context(encParms, true, securityLevel)
  keyGenerator = seal.KeyGenerator(context)
  secretKey = keyGenerator.secretKey()

  invalidParms = seal.EncryptionParameters(seal.SchemeType.bfv)
  invalidParms.setPolyModulusDegree(1024)
  invalidParms.setCoeffModulus(
    seal.CoeffModulus.Create(1024, Int32Array.from([27]))
  )
  invalidParms.setPlainModulus(seal.PlainModulus.Batching(1024, 20))
  invalidContext = seal.Context(invalidParms)
})

describe('KeyGenerator', () => {
  test('It should be a factory', () => {
    expect(seal.KeyGenerator).toBeDefined()
    expect(typeof seal.KeyGenerator.constructor).toBe('function')
    expect(seal.KeyGenerator).toBeInstanceOf(Object)
    expect(seal.KeyGenerator.constructor).toBe(Function)
    expect(seal.KeyGenerator.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.KeyGenerator)
    Constructor(context)
    expect(Constructor).toHaveBeenCalledWith(context)
  })
  test('It should construct an instance with a secretkey', () => {
    const Constructor = jest.fn(seal.KeyGenerator)
    Constructor(context, secretKey)
    expect(Constructor).toHaveBeenCalledWith(context, secretKey)
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(seal.KeyGenerator)
    expect(() => Constructor(null as unknown as Context)).toThrow()
    expect(Constructor).toHaveBeenCalledWith(null)
  })
  test('It should have properties', () => {
    const item = seal.KeyGenerator(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('secretKey')
    expect(item).toHaveProperty('createPublicKey')
    expect(item).toHaveProperty('createRelinKeys')
    expect(item).toHaveProperty('createRelinKeys')
    expect(item).toHaveProperty('createGaloisKeys')
    expect(item).toHaveProperty('createGaloisKeys')
  })
  test('It should have an instance (bfv)', () => {
    const item = seal.KeyGenerator(context)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.KeyGenerator(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(keyGenerator.instance)
    expect(spyOn).toHaveBeenCalledWith(keyGenerator.instance)
    expect(item.instance).toBeDefined()
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(keyGenerator.instance)
    expect(spyOn).toHaveBeenCalledWith(keyGenerator.instance)
  })
  test("It should delete it's instance", () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
    expect(() => item.secretKey()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    item.delete()
    expect(spyOn).toHaveBeenCalledTimes(2)
    expect(item.instance).toBeUndefined()
  })
  test('It should return its secret key', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'secretKey')
    const key = item.secretKey()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).toBeDefined()
  })
  test('It should create a public key', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createPublicKey')
    const key = item.createPublicKey()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).toBeDefined()
  })
  test('It should create a serializable public key', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createPublicKeySerializable')
    const serializable = item.createPublicKeySerializable()
    expect(spyOn).toHaveBeenCalledWith()
    expect(serializable.instance).toBeDefined()
  })
  test('It should create a set of relin keys', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createRelinKeys')
    const key = item.createRelinKeys()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).toBeDefined()
  })
  test('It should fail to create a set of relin keys', () => {
    const item = seal.KeyGenerator(invalidContext)
    const spyOn = jest.spyOn(item, 'createRelinKeys')
    expect(() => item.createRelinKeys()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should create serializable relin keys', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createRelinKeysSerializable')
    const serializable = item.createRelinKeysSerializable()
    const serialized = serializable.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof serialized).toBe('string')
  })
  test('It should fail to create serializable relin keys', () => {
    const item = seal.KeyGenerator(invalidContext)
    const spyOn = jest.spyOn(item, 'createRelinKeysSerializable')
    expect(() => item.createRelinKeysSerializable()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should generate and return all galoisKeys', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createGaloisKeys')
    const key = item.createGaloisKeys()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).toBeDefined()
  })
  test('It should generate and return specific galoisKeys', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createGaloisKeys')
    const key = item.createGaloisKeys(
      Int32Array.from([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
    )
    expect(spyOn).toHaveBeenCalledWith(
      Int32Array.from([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
    )
    expect(key.instance).toBeDefined()
  })
  test('It should fail to generate and return galoisKeys', () => {
    const item = seal.KeyGenerator(invalidContext)
    const spyOn = jest.spyOn(item, 'createGaloisKeys')
    expect(() => item.createGaloisKeys()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should generate and return all galoisKeys as a base64 string', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createGaloisKeys')
    const serializable = item.createGaloisKeys()
    const serialized = serializable.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof serialized).toBe('string')
  })
  test('It should generate and return specific galoisKeys as a base64 string', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createGaloisKeys')
    const serializable = item.createGaloisKeys(
      Int32Array.from([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
    )
    expect(spyOn).toHaveBeenCalledWith(
      Int32Array.from([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
    )
    const serialized = serializable.save()
    expect(typeof serialized).toBe('string')
  })
  test('It should fail to generate and return specific galoisKeys as a base64 string', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createGaloisKeys')
    expect(() => item.createGaloisKeys(Int32Array.from([99999]))).toThrow()
    expect(spyOn).toHaveBeenCalledWith(Int32Array.from([99999]))
  })
  test('It should create serializable galois keys', () => {
    const item = seal.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'createGaloisKeysSerializable')
    const serializable = item.createGaloisKeysSerializable()
    const serialized = serializable.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof serialized).toBe('string')
  })
  test('It should fail to create serializable galois keys', () => {
    const item = seal.KeyGenerator(invalidContext)
    const spyOn = jest.spyOn(item, 'createGaloisKeysSerializable')
    expect(() => item.createGaloisKeysSerializable()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
})
