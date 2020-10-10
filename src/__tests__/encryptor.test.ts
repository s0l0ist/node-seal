import SEAL from '../index_wasm_node'
import { SEALLibrary } from 'implementation/seal'
import { Context } from 'implementation/context'
import { Modulus } from 'implementation/modulus'
import { Vector } from 'implementation/vector'
import { EncryptionParameters } from 'implementation/encryption-parameters'
import { BatchEncoder } from 'implementation/batch-encoder'
import { Encryptor } from 'implementation/encryptor'
import { KeyGenerator } from 'implementation/key-generator'
import { PublicKey } from 'implementation/public-key'
import { CKKSEncoder } from 'implementation/ckks-encoder'
import { Decryptor } from 'implementation/decryptor'
import { SecretKey } from 'implementation/secret-key'
import { Evaluator } from 'implementation/evaluator'
import { PlainText } from 'implementation/plain-text'
import { CipherText } from 'implementation/cipher-text'

let seal: SEALLibrary
let bfvContext: Context
let coeffModulus: Vector
let plainModulus: Modulus
let bfvEncParms: EncryptionParameters
let batchEncoder: BatchEncoder
let bfvKeyGenerator: KeyGenerator
let bfvSecretKey: SecretKey
let bfvPublicKey: PublicKey
let bfvEncryptor: Encryptor
let bfvDecryptor: Decryptor
let bfvEvaluator: Evaluator

let ckksContext: Context
let ckksEncParms: EncryptionParameters
let ckksEncoder: CKKSEncoder
let ckksKeyGenerator: KeyGenerator
let ckksSecretKey: SecretKey
let ckksPublicKey: PublicKey
let ckksEncryptor: Encryptor
let ckksDecryptor: Decryptor
beforeAll(async () => {
  seal = await SEAL()
  const polyModulusDegree = 4096
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
  bfvEncParms.setPolyModulusDegree(polyModulusDegree)
  bfvEncParms.setCoeffModulus(coeffModulus)
  bfvEncParms.setPlainModulus(plainModulus)
  bfvContext = seal.Context(bfvEncParms)
  batchEncoder = seal.BatchEncoder(bfvContext)
  bfvKeyGenerator = seal.KeyGenerator(bfvContext)
  bfvSecretKey = bfvKeyGenerator.secretKey()
  bfvPublicKey = bfvKeyGenerator.publicKey()
  bfvEncryptor = seal.Encryptor(bfvContext, bfvPublicKey)
  bfvDecryptor = seal.Decryptor(bfvContext, bfvSecretKey)
  bfvEvaluator = seal.Evaluator(bfvContext)

  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
  ckksEncParms.setPolyModulusDegree(polyModulusDegree)
  ckksEncParms.setCoeffModulus(coeffModulus)
  ckksContext = seal.Context(ckksEncParms)
  ckksEncoder = seal.CKKSEncoder(ckksContext)
  ckksKeyGenerator = seal.KeyGenerator(ckksContext)
  ckksSecretKey = ckksKeyGenerator.secretKey()
  ckksPublicKey = ckksKeyGenerator.publicKey()
  ckksEncryptor = seal.Encryptor(ckksContext, ckksPublicKey)
  ckksDecryptor = seal.Decryptor(ckksContext, ckksSecretKey)
})

describe('Encryptor', () => {
  test('It should be a factory', () => {
    expect(seal.Encryptor).toBeDefined()
    expect(typeof seal.Encryptor.constructor).toBe('function')
    expect(seal.Encryptor).toBeInstanceOf(Object)
    expect(seal.Encryptor.constructor).toBe(Function)
    expect(seal.Encryptor.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.Encryptor)
    Constructor(bfvContext, bfvPublicKey)
    expect(Constructor).toBeCalledWith(bfvContext, bfvPublicKey)
  })
  test('It should construct an instance with a bfvSecretKey', () => {
    const Constructor = jest.fn(seal.Encryptor)
    Constructor(bfvContext, bfvPublicKey, bfvSecretKey)
    expect(Constructor).toBeCalledWith(bfvContext, bfvPublicKey, bfvSecretKey)
  })
  test('It should fail to construct an instance', () => {
    const newParms = seal.EncryptionParameters(seal.SchemeType.BFV)
    newParms.setPolyModulusDegree(2048)
    newParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(2048, seal.SecurityLevel.tc128)
    )
    newParms.setPlainModulus(seal.PlainModulus.Batching(2048, 20))
    const newContext = seal.Context(newParms)
    const newKeyGenerator = seal.KeyGenerator(newContext)
    const newPublicKey = newKeyGenerator.publicKey()

    const Constructor = jest.fn(seal.Encryptor)
    expect(() => Constructor(bfvContext, newPublicKey)).toThrow()
    expect(Constructor).toBeCalledWith(bfvContext, newPublicKey)
  })
  test('It should have properties', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encrypt')
    expect(item).toHaveProperty('encryptSymmetric')
  })
  test('It should have an instance', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    const newItem = seal.Encryptor(bfvContext, bfvPublicKey)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    const newItem = seal.Encryptor(bfvContext, bfvPublicKey)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
  })
  test('It should skip deleting twice', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
  })
  test('It should encrypt a plaintext to a destination cipher', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    const cipher = seal.CipherText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encrypt')
    item.encrypt(plain, cipher)
    expect(spyOn).toHaveBeenCalledWith(plain, cipher)
    const plainResult = bfvDecryptor.decrypt(cipher) as PlainText
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
  test('It should encrypt a plaintext and return a cipher', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encrypt')
    const cipher = item.encrypt(plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(cipher).toBeDefined()
    expect(typeof cipher.constructor).toBe('function')
    expect(cipher).toBeInstanceOf(Object)
    expect(cipher.constructor).toBe(Object)
    expect(cipher.instance.constructor.name).toBe('Ciphertext')
    const plainResult = bfvDecryptor.decrypt(cipher) as PlainText
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
  test('It should symmetrically encrypt a plaintext to a destination cipher', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey, bfvSecretKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    const cipher = seal.CipherText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encryptSymmetric')
    item.encryptSymmetric(plain, cipher)
    expect(spyOn).toHaveBeenCalledWith(plain, cipher)
    const plainResult = bfvDecryptor.decrypt(cipher) as PlainText
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
  test('It should symmetrically encrypt a plaintext and return a cipher', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey, bfvSecretKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encryptSymmetric')
    const cipher = item.encryptSymmetric(plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(cipher).toBeDefined()
    expect(typeof cipher.constructor).toBe('function')
    expect(cipher).toBeInstanceOf(Object)
    expect(cipher.constructor).toBe(Object)
    expect(cipher.instance.constructor.name).toBe('Ciphertext')
    const cipherTest = seal.CipherText()
    cipherTest.load(bfvContext, cipher.save())
    const plainResult = bfvDecryptor.decrypt(cipherTest) as PlainText
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
  test('It should fail to encrypt', () => {
    const item = seal.Encryptor(ckksContext, ckksPublicKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(0)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encrypt')
    expect(() => item.encrypt(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
  test('It should fail to symmetrically encrypt', () => {
    const item = seal.Encryptor(ckksContext, ckksPublicKey, ckksSecretKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(0)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encryptSymmetric')
    expect(() => item.encryptSymmetric(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
  test('It should symmetrically encrypt a plaintext and return a serializable ciphertext', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey, bfvSecretKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encryptSymmetricSerializable')
    const serialized = item.encryptSymmetricSerializable(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(serialized.instance).toBeDefined()
    const cipher = seal.CipherText()
    cipher.load(bfvContext, serialized.save())
    const plainResult = bfvDecryptor.decrypt(cipher) as PlainText
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
  test('It should fail to symmetrically encrypt and return a serializable ciphertext', () => {
    const item = seal.Encryptor(ckksContext, ckksPublicKey, ckksSecretKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(0)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encryptSymmetricSerializable')
    expect(() => item.encryptSymmetricSerializable(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
})
