import SEAL from '../index_throws_wasm_node'
import { SEALLibrary } from 'implementation/seal'
import { Context } from 'implementation/context'
import { Modulus } from 'implementation/modulus'
import { Vector } from 'implementation/vector'
import { EncryptionParameters } from 'implementation/encryption-parameters'
import { BatchEncoder } from 'implementation/batch-encoder'
import { Encryptor } from 'implementation/encryptor'
import { KeyGenerator } from 'implementation/key-generator'
import { PublicKey } from 'implementation/public-key'
import { PlainText } from 'implementation/plain-text'
import { CKKSEncoder } from 'implementation/ckks-encoder'

let seal: SEALLibrary
let bfvContext: Context
let coeffModulus: Vector
let plainModulus: Modulus
let bfvEncParms: EncryptionParameters
let batchEncoder: BatchEncoder
let bfvKeyGenerator: KeyGenerator
let bfvPublicKey: PublicKey
let bfvEncryptor: Encryptor

let ckksContext: Context
let ckksEncParms: EncryptionParameters
let ckksEncoder: CKKSEncoder
let ckksKeyGenerator: KeyGenerator
let ckksPublicKey: PublicKey
let ckksEncryptor: Encryptor
beforeAll(async () => {
  seal = await SEAL()
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 1024
  const bitSizes = Int32Array.from([27])
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.Create(polyModulusDegree, bitSizes)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
  bfvEncParms.setPolyModulusDegree(polyModulusDegree)
  bfvEncParms.setCoeffModulus(coeffModulus)
  bfvEncParms.setPlainModulus(plainModulus)
  bfvContext = seal.Context(bfvEncParms, true, securityLevel)
  batchEncoder = seal.BatchEncoder(bfvContext)
  bfvKeyGenerator = seal.KeyGenerator(bfvContext)
  bfvPublicKey = bfvKeyGenerator.publicKey()
  bfvEncryptor = seal.Encryptor(bfvContext, bfvPublicKey)

  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
  ckksEncParms.setPolyModulusDegree(polyModulusDegree)
  ckksEncParms.setCoeffModulus(coeffModulus)
  ckksContext = seal.Context(ckksEncParms, true, securityLevel)
  ckksEncoder = seal.CKKSEncoder(ckksContext)
  ckksKeyGenerator = seal.KeyGenerator(ckksContext)
  ckksPublicKey = ckksKeyGenerator.publicKey()
  ckksEncryptor = seal.Encryptor(ckksContext, ckksPublicKey)
})

describe('CipherText', () => {
  test('It should be a factory', () => {
    expect(seal.CipherText).toBeDefined()
    expect(typeof seal.CipherText.constructor).toBe('function')
    expect(seal.CipherText).toBeInstanceOf(Object)
    expect(seal.CipherText.constructor).toBe(Function)
    expect(seal.CipherText.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.CipherText)
    Constructor()
    expect(Constructor).toBeCalledWith()
  })
  test('It should construct an instance with a bfvContext', () => {
    const Constructor = jest.fn(seal.CipherText)
    Constructor({ context: bfvContext })
    expect(Constructor).toBeCalledWith({ context: bfvContext })
  })
  test('It should construct an instance with a bfvContext, parmsId', () => {
    const Constructor = jest.fn(seal.CipherText)
    const parmsId = bfvContext.firstParmsId
    Constructor({ context: bfvContext, parmsId })
    expect(Constructor).toBeCalledWith({
      context: bfvContext,
      parmsId
    })
  })
  test('It should construct an instance with a bfvContext, parmsId, sizeCapacity', () => {
    const Constructor = jest.fn(seal.CipherText)
    const parmsId = bfvContext.firstParmsId
    Constructor({ context: bfvContext, parmsId, sizeCapacity: 2 })
    expect(Constructor).toBeCalledWith({
      context: bfvContext,
      parmsId,
      sizeCapacity: 2
    })
  })
  test('It should fail to construct an instance from invalid parameters', () => {
    const Constructor = jest.fn(seal.CipherText)
    expect(() =>
      Constructor({ context: bfvContext, sizeCapacity: 2 })
    ).toThrow()
    expect(Constructor).toBeCalledWith({
      context: bfvContext,
      sizeCapacity: 2
    })
  })
  test('It should fail to construct an instance from bad parameters', () => {
    const Constructor = jest.fn(seal.CipherText)
    const parmsId = bfvContext.firstParmsId
    expect(() =>
      Constructor({ context: bfvContext, parmsId, sizeCapacity: -2 })
    ).toThrow()
    expect(Constructor).toBeCalledWith({
      context: bfvContext,
      parmsId,
      sizeCapacity: -2
    })
  })
  test('It should have properties', () => {
    const cipher = seal.CipherText()
    // Test properties
    expect(cipher).toHaveProperty('instance')
    expect(cipher).toHaveProperty('unsafeInject')
    expect(cipher).toHaveProperty('delete')
    expect(cipher).toHaveProperty('reserve')
    expect(cipher).toHaveProperty('resize')
    expect(cipher).toHaveProperty('release')
    expect(cipher).toHaveProperty('coeffModulusSize')
    expect(cipher).toHaveProperty('polyModulusDegree')
    expect(cipher).toHaveProperty('size')
    expect(cipher).toHaveProperty('sizeCapacity')
    expect(cipher).toHaveProperty('isTransparent')
    expect(cipher).toHaveProperty('isNttForm')
    expect(cipher).toHaveProperty('parmsId')
    expect(cipher).toHaveProperty('scale')
    expect(cipher).toHaveProperty('setScale')
    expect(cipher).toHaveProperty('pool')
    expect(cipher).toHaveProperty('save')
    expect(cipher).toHaveProperty('saveArray')
    expect(cipher).toHaveProperty('load')
    expect(cipher).toHaveProperty('loadArray')
    expect(cipher).toHaveProperty('copy')
    expect(cipher).toHaveProperty('clone')
    expect(cipher).toHaveProperty('move')
  })

  test('It should have an instance', () => {
    const cipher = seal.CipherText()
    expect(cipher.instance).toBeDefined()
  })
  test('It should inject', () => {
    const cipher = seal.CipherText()
    const newCipher = seal.CipherText()
    newCipher.delete()
    const spyOn = jest.spyOn(newCipher, 'unsafeInject')
    newCipher.unsafeInject(cipher.instance)
    expect(spyOn).toHaveBeenCalledWith(cipher.instance)
  })
  test('It should delete the old instance and inject', () => {
    const cipher = seal.CipherText()
    const newCipher = seal.CipherText()
    const spyOn = jest.spyOn(newCipher, 'unsafeInject')
    newCipher.unsafeInject(cipher.instance)
    expect(spyOn).toHaveBeenCalledWith(cipher.instance)
  })
  test("It should delete it's instance", () => {
    const cipher = seal.CipherText()
    const spyOn = jest.spyOn(cipher, 'delete')
    cipher.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(cipher.instance).toBeUndefined()
  })
  test('It should skip deleting twice', () => {
    const cipher = seal.CipherText()
    cipher.delete()
    const spyOn = jest.spyOn(cipher, 'delete')
    cipher.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(cipher.instance).toBeUndefined()
  })
  test('It should reserve memory', () => {
    const cipher = seal.CipherText()
    const spyOn = jest.spyOn(cipher, 'reserve')
    cipher.reserve(bfvContext, 2)
    expect(spyOn).toHaveBeenCalledWith(bfvContext, 2)
  })
  test('It should fail to reserve memory', () => {
    const cipher = seal.CipherText()
    const spyOn = jest.spyOn(cipher, 'reserve')
    expect(() => cipher.reserve(bfvContext, 50000)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(bfvContext, 50000)
  })
  test('It should resize', () => {
    const cipher = seal.CipherText()
    cipher.reserve(bfvContext, 2)
    expect(cipher.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(cipher, 'resize')
    cipher.resize(5)
    expect(spyOn).toHaveBeenCalledWith(5)
  })
  test('It should fail to resize', () => {
    const cipher = seal.CipherText()
    cipher.reserve(bfvContext, 2)
    expect(cipher.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(cipher, 'resize')
    expect(() => cipher.resize(1)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(1)
  })
  test('It should release allocated memory', () => {
    const cipher = seal.CipherText()
    cipher.reserve(bfvContext, 2)
    expect(cipher.sizeCapacity).toEqual(2)
    const spyOn = jest.spyOn(cipher, 'release')
    cipher.release()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should return the coeff mod size', () => {
    const cipher = seal.CipherText()
    cipher.reserve(bfvContext, 2)
    expect(typeof cipher.coeffModulusSize).toBe('number')
  })
  test('It should return the poly modulus degree', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    expect(typeof cipher.polyModulusDegree).toBe('number')
  })
  test('It should return the size', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    expect(typeof cipher.size).toBe('number')
  })
  test('It should return the size capacity', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    expect(typeof cipher.sizeCapacity).toBe('number')
  })
  test('It should return if the cipher is transparent', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    expect(typeof cipher.isTransparent).toBe('boolean')
  })
  test('It should return if the cipher is not in NTT form', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    expect(typeof cipher.isNttForm).toBe('boolean')
  })
  test('It should return a parms id type', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const parms = cipher.parmsId
    const values = parms.values
    expect(values.constructor).toBe(BigUint64Array)
    values.forEach(x => {
      expect(typeof x).toBe('bigint')
    })
  })
  test('It should return the scale', () => {
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    ckksEncryptor.encrypt(plain, cipher)
    expect(typeof cipher.scale).toBe('number')
  })
  test('It should set the scale', () => {
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const scale1 = Math.pow(2, 20)
    const scale2 = 2097152.32
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    ckksEncryptor.encrypt(plain, cipher)
    expect(cipher.scale).toEqual(scale1)
    cipher.setScale(scale2)
    expect(cipher.scale).toEqual(scale2)
  })
  test('It should return the currently used memory pool handle', () => {
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    ckksEncryptor.encrypt(plain, cipher)
    const pool = cipher.pool
    expect(pool.constructor.name).toBe('MemoryPoolHandle')
  })
  test('It should save to a string', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(cipher, 'save')
    const str = cipher.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(cipher, 'saveArray')
    const array = cipher.saveArray()
    expect(spyOn).toHaveBeenCalled()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const str = cipher.save()
    cipher.delete()
    const newCipher = seal.CipherText()
    const spyOn = jest.spyOn(newCipher, 'load')
    newCipher.load(bfvContext, str)
    expect(spyOn).toHaveBeenCalledWith(bfvContext, str)
    expect(newCipher.save()).toBe(str)
  })
  test('It should load from a typed array', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const array = cipher.saveArray(seal.ComprModeType.deflate)
    cipher.delete()
    const newCipher = seal.CipherText()
    const spyOn = jest.spyOn(newCipher, 'loadArray')
    newCipher.loadArray(bfvContext, array)
    expect(spyOn).toHaveBeenCalledWith(bfvContext, array)
    expect(newCipher.saveArray()).toEqual(array)
  })
  test('It should fail to load from a string', () => {
    const newCipher = seal.CipherText()
    const spyOn = jest.spyOn(newCipher, 'load')
    expect(() =>
      newCipher.load(
        bfvContext,
        'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      bfvContext,
      'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
    )
  })
  test('It should fail to load from a Uint8Array', () => {
    const newCipher = seal.CipherText()
    const spyOn = jest.spyOn(newCipher, 'loadArray')
    expect(() =>
      newCipher.loadArray(
        bfvContext,
        Uint8Array.from([
          94,
          161,
          16,
          3,
          5,
          1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          120,
          156,
          99,
          96,
          160,
          8,
          124,
          176,
          143,
          91,
          40,
          192,
          204,
          10,
          100,
          73,
          160,
          201,
          0,
          0,
          57,
          170,
          2,
          95
        ])
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      bfvContext,
      Uint8Array.from([
        94,
        161,
        16,
        3,
        5,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        120,
        156,
        99,
        96,
        160,
        8,
        124,
        176,
        143,
        91,
        40,
        192,
        204,
        10,
        100,
        73,
        160,
        201,
        0,
        0,
        57,
        170,
        2,
        95
      ])
    )
  })
  test('It should copy another instance', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const newCipher = seal.CipherText()
    const spyOn = jest.spyOn(newCipher, 'copy')
    newCipher.copy(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(newCipher.save()).toEqual(cipher.save())
  })
  test('It should fail to copy another instance', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const newCipher = seal.CipherText()
    cipher.delete()
    const spyOn = jest.spyOn(newCipher, 'copy')
    expect(() => newCipher.copy(cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher)
  })
  test('It should clone itself', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(cipher, 'clone')
    const newCipher = cipher.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newCipher).toBeDefined()
    expect(typeof newCipher.constructor).toBe('function')
    expect(newCipher).toBeInstanceOf(Object)
    expect(newCipher.constructor).toBe(Object)
    expect(newCipher.instance.constructor.name).toBe('Ciphertext')
    expect(newCipher.save()).toEqual(cipher.save())
  })
  test('It should fail to clone itself', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    cipher.delete()
    const spyOn = jest.spyOn(cipher, 'clone')
    expect(() => cipher.clone()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should move another instance into itself and delete the old', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const str = cipher.save()
    const newCipher = seal.CipherText()
    const spyOn = jest.spyOn(newCipher, 'move')
    newCipher.move(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipher.instance).toBeUndefined()
    expect(() => cipher.size).toThrow(TypeError)
    expect(newCipher.save()).toEqual(str)
  })
  test('It should fail to move another instance into itself and delete the old', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).fill(5)
    const cipher = seal.CipherText()
    const plain = batchEncoder.encode(arr) as PlainText
    bfvEncryptor.encrypt(plain, cipher)
    const newCipher = seal.CipherText()
    cipher.delete()
    const spyOn = jest.spyOn(newCipher, 'move')
    expect(() => newCipher.move(cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher)
  })
})
