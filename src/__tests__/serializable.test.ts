import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from 'implementation/seal'
import { EncryptionParameters } from 'implementation/encryption-parameters'
import { Context } from 'implementation/context'
import { KeyGenerator } from 'implementation/key-generator'
import { BatchEncoder } from 'implementation/batch-encoder'
import { Encryptor } from 'implementation/encryptor'
import { PlainText } from 'implementation/plain-text'
let seal: SEALLibrary
let parms: EncryptionParameters
let context: Context
let encoder: BatchEncoder
let keyGenerator: KeyGenerator
let encryptor: Encryptor
beforeAll(async () => {
  seal = await SEAL()
  parms = seal.EncryptionParameters(seal.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
  )
  parms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
  context = seal.Context(parms, true, seal.SecurityLevel.tc128)
  encoder = seal.BatchEncoder(context)
  keyGenerator = seal.KeyGenerator(context)
  const secretKey = keyGenerator.secretKey()
  const publicKey = keyGenerator.publicKey()
  encryptor = seal.Encryptor(context, publicKey, secretKey)
})

describe('SecretKey', () => {
  test('It should be a factory', () => {
    expect(seal.Serializable).toBeDefined()
    expect(typeof seal.Serializable.constructor).toBe('function')
    expect(seal.Serializable).toBeInstanceOf(Object)
    expect(seal.Serializable.constructor).toBe(Function)
    expect(seal.Serializable.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = seal.Serializable()
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('save')
    expect(item).toHaveProperty('saveArray')
  })
  test('It should not have an instance by default', () => {
    const item = seal.Serializable()
    expect(item.instance).toBeUndefined()
  })
  test('It should inject', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr) as PlainText
    const item = encryptor.encryptSymmetricSerializable(plain)
    const saved = item.save()
    const newItem = seal.Serializable()
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(saved)
  })
  test('It should delete the old instance and inject', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr) as PlainText
    const item = encryptor.encryptSymmetricSerializable(plain)
    const item2 = encryptor.encryptSymmetricSerializable(plain)
    const saved = item2.save()
    const newItem = seal.Serializable()
    newItem.unsafeInject(item.instance)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item2.instance)
    expect(spyOn).toHaveBeenCalledWith(item2.instance)
    expect(newItem.save()).toEqual(saved)
  })
  test("It should delete it's instance", () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr) as PlainText
    const item = encryptor.encryptSymmetricSerializable(plain)
    const newItem = seal.Serializable()
    newItem.unsafeInject(item.instance)
    const spyOn = jest.spyOn(newItem, 'delete')
    newItem.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(newItem.instance).toBeUndefined()
    expect(() => newItem.save()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr) as PlainText
    const item = encryptor.encryptSymmetricSerializable(plain)
    const newItem = seal.Serializable()
    newItem.unsafeInject(item.instance)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'delete')
    newItem.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(newItem.instance).toBeUndefined()
  })
  test('It should save to a string', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr) as PlainText
    const item = encryptor.encryptSymmetricSerializable(plain)
    const newItem = seal.Serializable()
    newItem.unsafeInject(item.instance)
    const spyOn = jest.spyOn(newItem, 'save')
    const str = newItem.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr) as PlainText
    const item = encryptor.encryptSymmetricSerializable(plain)
    const newItem = seal.Serializable()
    newItem.unsafeInject(item.instance)
    const spyOn = jest.spyOn(newItem, 'saveArray')
    const array = newItem.saveArray()
    expect(spyOn).toHaveBeenCalledWith()
    expect(array.constructor).toBe(Uint8Array)
  })
})
