import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from '../implementation/seal'
import { Context } from '../implementation/context'
import { Modulus } from '../implementation/modulus'
import { Vector } from '../implementation/vector'
import { EncryptionParameters } from '../implementation/encryption-parameters'
import { BatchEncoder } from '../implementation/batch-encoder'
import { Encryptor } from '../implementation/encryptor'
import { KeyGenerator } from '../implementation/key-generator'
import { PublicKey } from '../implementation/public-key'
import { PlainText } from '../implementation/plain-text'
import { SecretKey } from '../implementation/secret-key'
import { Evaluator } from '../implementation/evaluator'

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
let bfvEvaluator: Evaluator

let ckksEncParms: EncryptionParameters
beforeAll(async () => {
  seal = await SEAL()
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 4096
  const bitSizes = Int32Array.from([46, 16, 46])
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.Create(polyModulusDegree, bitSizes)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.bfv)
  bfvEncParms.setPolyModulusDegree(polyModulusDegree)
  bfvEncParms.setCoeffModulus(coeffModulus)
  bfvEncParms.setPlainModulus(plainModulus)
  bfvContext = seal.Context(bfvEncParms, true, securityLevel)
  batchEncoder = seal.BatchEncoder(bfvContext)
  bfvKeyGenerator = seal.KeyGenerator(bfvContext)
  bfvSecretKey = bfvKeyGenerator.secretKey()
  bfvPublicKey = bfvKeyGenerator.createPublicKey()
  bfvEncryptor = seal.Encryptor(bfvContext, bfvPublicKey)
  bfvEvaluator = seal.Evaluator(bfvContext)

  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.ckks)
  ckksEncParms.setPolyModulusDegree(polyModulusDegree)
  ckksEncParms.setCoeffModulus(coeffModulus)
})

describe('Decryptor', () => {
  test('It should be a factory', () => {
    expect(seal.Decryptor).toBeDefined()
    expect(typeof seal.Decryptor.constructor).toBe('function')
    expect(seal.Decryptor).toBeInstanceOf(Object)
    expect(seal.Decryptor.constructor).toBe(Function)
    expect(seal.Decryptor.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.Decryptor)
    Constructor(bfvContext, bfvSecretKey)
    expect(Constructor).toHaveBeenCalledWith(bfvContext, bfvSecretKey)
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
    const newSecretKey = newKeyGenerator.secretKey()

    const Constructor = jest.fn(seal.Decryptor)
    expect(() => Constructor(bfvContext, newSecretKey)).toThrow()
    expect(Constructor).toHaveBeenCalledWith(bfvContext, newSecretKey)
  })
  test('It should have properties', () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('decrypt')
    expect(item).toHaveProperty('invariantNoiseBudget')
  })
  test('It should have an instance', () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    const newItem = seal.Decryptor(bfvContext, bfvSecretKey)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    const newItem = seal.Decryptor(bfvContext, bfvSecretKey)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
  })
  test('It should skip deleting twice', () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
  })
  test('It should encrypt a ciphertext to a destination plain', () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    const cipher = seal.CipherText()
    batchEncoder.encode(arr, plain)
    bfvEncryptor.encrypt(plain, cipher)
    const plainResult = seal.PlainText()
    const spyOn = jest.spyOn(item, 'decrypt')
    item.decrypt(cipher, plainResult)
    expect(spyOn).toHaveBeenCalledWith(cipher, plainResult)
    const decoded = batchEncoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
  test('It should encrypt a ciphertext and return a plain', () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    const cipher = seal.CipherText()
    batchEncoder.encode(arr, plain)
    bfvEncryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(item, 'decrypt')
    const plainResult = item.decrypt(cipher) as PlainText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(plainResult).toBeDefined()
    expect(typeof plainResult.constructor).toBe('function')
    expect(plainResult).toBeInstanceOf(Object)
    expect(plainResult.constructor).toBe(Object)
    expect(plainResult.instance.constructor.name).toBe('Plaintext')
    const decoded = batchEncoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
  test('It should return the invariant noise budget', () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    const cipher = seal.CipherText()
    batchEncoder.encode(arr, plain)
    bfvEncryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(item, 'invariantNoiseBudget')
    const noise = item.invariantNoiseBudget(cipher)
    expect(typeof noise).toBe('number')
    expect(spyOn).toHaveBeenCalledWith(cipher)
  })
  test('It should fail to return the invariant noise budget', () => {
    const item = seal.Decryptor(bfvContext, bfvSecretKey)
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const plain = seal.PlainText()
    const cipher = seal.CipherText()
    batchEncoder.encode(arr, plain)
    bfvEncryptor.encrypt(plain, cipher)
    bfvEvaluator.cipherTransformToNtt(cipher, cipher)
    const spyOn = jest.spyOn(item, 'invariantNoiseBudget')
    expect(() => item.invariantNoiseBudget(cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher)
  })
})
