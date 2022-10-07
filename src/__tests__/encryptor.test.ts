import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from '../implementation/seal'
import { Context } from '../implementation/context'
import { Modulus } from '../implementation/modulus'
import { Vector } from '../implementation/vector'
import { EncryptionParameters } from '../implementation/encryption-parameters'
import { KeyGenerator } from '../implementation/key-generator'
import { PublicKey } from '../implementation/public-key'
import { Decryptor } from '../implementation/decryptor'
import { SecretKey } from '../implementation/secret-key'
import { PlainText } from '../implementation/plain-text'
import { CipherText } from '../implementation/cipher-text'

let seal: SEALLibrary
let bfvContext: Context
let coeffModulus: Vector
let plainModulus: Modulus
let bfvEncParms: EncryptionParameters
let bfvKeyGenerator: KeyGenerator
let bfvSecretKey: SecretKey
let bfvPublicKey: PublicKey
let bfvDecryptor: Decryptor

let ckksContext: Context
let ckksEncParms: EncryptionParameters
let ckksKeyGenerator: KeyGenerator
let ckksSecretKey: SecretKey
let ckksPublicKey: PublicKey
beforeAll(async () => {
  seal = await SEAL()
  const polyModulusDegree = 4096
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.bfv)
  bfvEncParms.setPolyModulusDegree(polyModulusDegree)
  bfvEncParms.setCoeffModulus(coeffModulus)
  bfvEncParms.setPlainModulus(plainModulus)
  bfvContext = seal.Context(bfvEncParms)
  bfvKeyGenerator = seal.KeyGenerator(bfvContext)
  bfvSecretKey = bfvKeyGenerator.secretKey()
  bfvPublicKey = bfvKeyGenerator.createPublicKey()
  bfvDecryptor = seal.Decryptor(bfvContext, bfvSecretKey)

  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.ckks)
  ckksEncParms.setPolyModulusDegree(polyModulusDegree)
  ckksEncParms.setCoeffModulus(coeffModulus)
  ckksContext = seal.Context(ckksEncParms)
  ckksKeyGenerator = seal.KeyGenerator(ckksContext)
  ckksSecretKey = ckksKeyGenerator.secretKey()
  ckksPublicKey = ckksKeyGenerator.createPublicKey()
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
    expect(Constructor).toHaveBeenCalledWith(bfvContext, bfvPublicKey)
  })
  test('It should construct an instance with a bfvSecretKey', () => {
    const Constructor = jest.fn(seal.Encryptor)
    Constructor(bfvContext, bfvPublicKey, bfvSecretKey)
    expect(Constructor).toHaveBeenCalledWith(
      bfvContext,
      bfvPublicKey,
      bfvSecretKey
    )
  })
  test('It should fail to construct an instance', () => {
    const newParms = seal.EncryptionParameters(seal.SchemeType.bfv)
    newParms.setPolyModulusDegree(2048)
    newParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(2048, seal.SecurityLevel.tc128)
    )
    newParms.setPlainModulus(seal.PlainModulus.Batching(2048, 20))
    const newContext = seal.Context(newParms)
    const newKeyGenerator = seal.KeyGenerator(newContext)
    const newPublicKey = newKeyGenerator.createPublicKey()

    const Constructor = jest.fn(seal.Encryptor)
    expect(() => Constructor(bfvContext, newPublicKey)).toThrow()
    expect(Constructor).toHaveBeenCalledWith(bfvContext, newPublicKey)
  })
  test('It should have properties', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encrypt')
    expect(item).toHaveProperty('encryptSerializable')
    expect(item).toHaveProperty('encryptSymmetric')
    expect(item).toHaveProperty('encryptSymmetricSerializable')
    expect(item).toHaveProperty('encryptZero')
    expect(item).toHaveProperty('encryptZeroSerializable')
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
    expect(item.instance).toBeUndefined()
  })
  test('It should skip deleting twice', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
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
  test('It should fail to encrypt serializable', () => {
    const item = seal.Encryptor(ckksContext, ckksPublicKey, ckksSecretKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(0)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encryptSerializable')
    expect(() => item.encryptSerializable(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
  test('It should encrypt a plaintext and return a cipher as a serializable object', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encryptSerializable')
    const serializable = item.encryptSerializable(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    const cipher = seal.CipherText()
    cipher.load(bfvContext, serializable.save())
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
  test('It should symmetrically encrypt a plaintext and return a cipher as a serializable object', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey, bfvSecretKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encryptSymmetricSerializable')
    const serializable = item.encryptSymmetricSerializable(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(serializable.instance).toBeDefined()
    const cipher = seal.CipherText()
    cipher.load(bfvContext, serializable.save())
    const plainResult = bfvDecryptor.decrypt(cipher) as PlainText
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })

  test('It should zero encrypt a plaintext to a destination cipher', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    const cipher = seal.CipherText()
    encoder.encode(arr, plain)
    item.encrypt(plain, cipher)
    const plainResult = bfvDecryptor.decrypt(cipher) as PlainText
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)

    const spyOn = jest.spyOn(item, 'encryptZero')
    item.encryptZero(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    const plainResultZero = bfvDecryptor.decrypt(cipher) as PlainText
    const decodedZero = encoder.decode(plainResultZero, true)
    const arrZero = Int32Array.from({ length: encoder.slotCount }).fill(0)
    expect(decodedZero).toEqual(arrZero)
  })
  test('It should zero encrypt a plaintext and return a cipher', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    const cipher = seal.CipherText()
    encoder.encode(arr, plain)
    item.encrypt(plain, cipher)
    const plainResult = bfvDecryptor.decrypt(cipher) as PlainText
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)

    const spyOn = jest.spyOn(item, 'encryptZero')
    const cipherZero = item.encryptZero() as CipherText
    expect(spyOn).toHaveBeenCalledWith()
    expect(cipherZero).toBeDefined()
    expect(typeof cipherZero.constructor).toBe('function')
    expect(cipherZero).toBeInstanceOf(Object)
    expect(cipherZero.constructor).toBe(Object)
    expect(cipherZero.instance.constructor.name).toBe('Ciphertext')
    const plainResultZero = bfvDecryptor.decrypt(cipherZero) as PlainText
    const decodedZero = encoder.decode(plainResultZero, true)
    const arrZero = Int32Array.from({ length: encoder.slotCount }).fill(0)
    expect(decodedZero).toEqual(arrZero)
  })
  test('It should zero encrypt a plaintext and return a cipher as a serializable object', () => {
    const item = seal.Encryptor(bfvContext, bfvPublicKey)
    const encoder = seal.BatchEncoder(bfvContext)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encryptZeroSerializable')
    const serializable = item.encryptZeroSerializable()
    expect(spyOn).toHaveBeenCalledWith()
    const cipherZero = seal.CipherText()
    cipherZero.load(bfvContext, serializable.save())
    const plainResultZero = bfvDecryptor.decrypt(cipherZero) as PlainText
    const decodedZero = encoder.decode(plainResultZero, true)
    const arrZero = Int32Array.from({ length: encoder.slotCount }).fill(0)
    expect(decodedZero).toEqual(arrZero)
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
