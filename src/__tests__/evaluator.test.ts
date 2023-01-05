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
import { CKKSEncoder } from '../implementation/ckks-encoder'
import { Decryptor } from '../implementation/decryptor'
import { SecretKey } from '../implementation/secret-key'
import { PlainText } from '../implementation/plain-text'
import { CipherText } from '../implementation/cipher-text'
import { RelinKeys } from '../implementation/relin-keys'
import { GaloisKeys } from '../implementation/galois-keys'
import { ParmsIdType } from '../implementation/parms-id-type'

let seal: SEALLibrary
let bfvContext: Context
let bfvCoeffModulus: Vector
let bfvPlainModulus: Modulus
let bfvEncParms: EncryptionParameters
let bfvBatchEncoder: BatchEncoder
let bfvKeyGenerator: KeyGenerator
let bfvSecretKey: SecretKey
let bfvPublicKey: PublicKey
let bfvRelinKeys: RelinKeys
let bfvGaloisKeys: GaloisKeys
let bfvEncryptor: Encryptor
let bfvDecryptor: Decryptor

let ckksContext: Context
let ckksCoeffModulus: Vector
let ckksEncParms: EncryptionParameters
let ckksEncoder: CKKSEncoder
let ckksKeyGenerator: KeyGenerator
let ckksSecretKey: SecretKey
let ckksPublicKey: PublicKey
let ckksRelinKeys: RelinKeys
let ckksGaloisKeys: GaloisKeys
let ckksEncryptor: Encryptor
let ckksDecryptor: Decryptor

let bgvContext: Context
let bgvCoeffModulus: Vector
let bgvPlainModulus: Modulus
let bgvEncParms: EncryptionParameters
let bgvBatchEncoder: BatchEncoder
let bgvKeyGenerator: KeyGenerator
let bgvSecretKey: SecretKey
let bgvPublicKey: PublicKey
let bgvRelinKeys: RelinKeys
let bgvGaloisKeys: GaloisKeys
let bgvEncryptor: Encryptor
let bgvDecryptor: Decryptor

let invalidCkksPlain: PlainText
let invalidCkksCipher: CipherText
beforeAll(async () => {
  seal = await SEAL()
  const polyModulusDegree = 4096
  const bitSize = 20
  bfvCoeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
  bfvPlainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.bfv)
  bfvEncParms.setPolyModulusDegree(polyModulusDegree)
  bfvEncParms.setCoeffModulus(bfvCoeffModulus)
  bfvEncParms.setPlainModulus(bfvPlainModulus)
  bfvContext = seal.Context(bfvEncParms)
  bfvBatchEncoder = seal.BatchEncoder(bfvContext)
  bfvKeyGenerator = seal.KeyGenerator(bfvContext)
  bfvSecretKey = bfvKeyGenerator.secretKey()
  bfvPublicKey = bfvKeyGenerator.createPublicKey()
  bfvRelinKeys = bfvKeyGenerator.createRelinKeys()
  bfvGaloisKeys = bfvKeyGenerator.createGaloisKeys(
    Int32Array.from([1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0])
  )
  bfvEncryptor = seal.Encryptor(bfvContext, bfvPublicKey)
  bfvDecryptor = seal.Decryptor(bfvContext, bfvSecretKey)

  bgvCoeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
  bgvPlainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bgvEncParms = seal.EncryptionParameters(seal.SchemeType.bgv)
  bgvEncParms.setPolyModulusDegree(polyModulusDegree)
  bgvEncParms.setCoeffModulus(bgvCoeffModulus)
  bgvEncParms.setPlainModulus(bgvPlainModulus)
  bgvContext = seal.Context(bgvEncParms)
  bgvBatchEncoder = seal.BatchEncoder(bgvContext)
  bgvKeyGenerator = seal.KeyGenerator(bgvContext)
  bgvSecretKey = bgvKeyGenerator.secretKey()
  bgvPublicKey = bgvKeyGenerator.createPublicKey()
  bgvRelinKeys = bgvKeyGenerator.createRelinKeys()
  bgvGaloisKeys = bgvKeyGenerator.createGaloisKeys(
    Int32Array.from([1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0])
  )
  bgvEncryptor = seal.Encryptor(bgvContext, bgvPublicKey)
  bgvDecryptor = seal.Decryptor(bgvContext, bgvSecretKey)

  ckksCoeffModulus = seal.CoeffModulus.Create(
    polyModulusDegree,
    Int32Array.from([46, 16, 46])
  )
  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.ckks)
  ckksEncParms.setPolyModulusDegree(polyModulusDegree)
  ckksEncParms.setCoeffModulus(ckksCoeffModulus)
  ckksContext = seal.Context(ckksEncParms)
  ckksEncoder = seal.CKKSEncoder(ckksContext)
  ckksKeyGenerator = seal.KeyGenerator(ckksContext)
  ckksSecretKey = ckksKeyGenerator.secretKey()
  ckksPublicKey = ckksKeyGenerator.createPublicKey()
  ckksRelinKeys = ckksKeyGenerator.createRelinKeys()
  ckksGaloisKeys = ckksKeyGenerator.createGaloisKeys()
  ckksEncryptor = seal.Encryptor(ckksContext, ckksPublicKey)
  ckksDecryptor = seal.Decryptor(ckksContext, ckksSecretKey)

  const arr2 = Float64Array.from({ length: ckksEncoder.slotCount / 2 }, _ => 5)
  invalidCkksPlain = ckksEncoder.encode(arr2, Math.pow(2, 20)) as PlainText
  invalidCkksCipher = ckksEncryptor.encrypt(invalidCkksPlain) as CipherText
})

describe('Evaluator', () => {
  test('It should be a factory', () => {
    expect(seal).toHaveProperty('Evaluator')
    expect(seal.Evaluator).toBeDefined()
    expect(typeof seal.Evaluator.constructor).toBe('function')
    expect(seal.Evaluator).toBeInstanceOf(Object)
    expect(seal.Evaluator.constructor).toBe(Function)
    expect(seal.Evaluator.constructor.name).toBe('Function')
  })

  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.Evaluator)
    Constructor(bfvContext)
    expect(Constructor).toHaveBeenCalledWith(bfvContext)
  })
  test('It should fail to construct an instance', () => {
    const newParms = seal.EncryptionParameters(seal.SchemeType.bfv)
    newParms.setPolyModulusDegree(4096)
    newParms.setCoeffModulus(
      seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
    )
    const newContext = seal.Context(newParms, true, seal.SecurityLevel.tc128)
    const Constructor = jest.fn(seal.Evaluator)
    expect(() => Constructor(newContext)).toThrow()
    expect(Constructor).toHaveBeenCalledWith(newContext)
  })
  test('It should have properties', () => {
    const item = seal.Evaluator(bfvContext)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('negate')
    expect(item).toHaveProperty('add')
    expect(item).toHaveProperty('sub')
    expect(item).toHaveProperty('multiply')
    expect(item).toHaveProperty('square')
    expect(item).toHaveProperty('relinearize')
    expect(item).toHaveProperty('cipherModSwitchToNext')
    expect(item).toHaveProperty('cipherModSwitchTo')
    expect(item).toHaveProperty('plainModSwitchToNext')
    expect(item).toHaveProperty('plainModSwitchTo')
    expect(item).toHaveProperty('rescaleToNext')
    expect(item).toHaveProperty('rescaleTo')
    expect(item).toHaveProperty('modReduceToNext')
    expect(item).toHaveProperty('modReduceTo')
    expect(item).toHaveProperty('exponentiate')
    expect(item).toHaveProperty('addPlain')
    expect(item).toHaveProperty('subPlain')
    expect(item).toHaveProperty('multiplyPlain')
    expect(item).toHaveProperty('plainTransformToNtt')
    expect(item).toHaveProperty('cipherTransformToNtt')
    expect(item).toHaveProperty('cipherTransformFromNtt')
    expect(item).toHaveProperty('applyGalois')
    expect(item).toHaveProperty('rotateRows')
    expect(item).toHaveProperty('rotateColumns')
    expect(item).toHaveProperty('rotateVector')
    expect(item).toHaveProperty('complexConjugate')
    expect(item).toHaveProperty('sumElements')
    expect(item).toHaveProperty('dotProduct')
    expect(item).toHaveProperty('dotProductPlain')
  })
  test('It should have an instance', () => {
    const item = seal.Evaluator(bfvContext)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.Evaluator(bfvContext)
    const newItem = seal.Evaluator(bfvContext)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.Evaluator(bfvContext)
    const newItem = seal.Evaluator(bfvContext)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = seal.Evaluator(bfvContext)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
  })
  test('It should skip deleting twice', () => {
    const item = seal.Evaluator(bfvContext)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
  })
  // Negate
  test('It should fail to negate a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    expect(() => item.negate(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should negate a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should negate a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should negate a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should negate a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should negate a cipher to a destination cipher (bfv) (int64)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = BigInt64Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => BigInt(-i)
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decodeBigInt(result, true)
    expect(decoded).toEqual(arr.map(x => BigInt(-x)))
  })
  test('It should negate a cipher to a destination cipher (bgv) (int64)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = BigInt64Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => BigInt(-i)
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decodeBigInt(result, true)
    expect(decoded).toEqual(arr.map(x => BigInt(-x)))
  })
  test('It should negate a cipher and return a cipher result (bfv) (int64)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = BigInt64Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => BigInt(-i)
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decodeBigInt(result, true)
    expect(decoded).toEqual(arr.map(x => BigInt(-x)))
  })
  test('It should negate a cipher and return a cipher result (bgv) (int64)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = BigInt64Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => BigInt(-i)
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decodeBigInt(result, true)
    expect(decoded).toEqual(arr.map(x => BigInt(-x)))
  })
  test('It should negate a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 1032188))
  })
  test('It should negate a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 1032188))
  })
  test('It should negate a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 1032188))
  })
  test('It should negate a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 1032188))
  })
  test('It should negate a cipher to a destination cipher (bfv) (uint64)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = BigUint64Array.from({ length: bfvBatchEncoder.slotCount }, _ =>
      BigInt('5')
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decodeBigInt(result, false)
    const expected = BigUint64Array.from(
      { length: bfvBatchEncoder.slotCount },
      _ => BigInt('1032188')
    )
    expect(decoded).toEqual(expected)
  })
  test('It should negate a cipher to a destination cipher (bgv) (uint64)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = BigUint64Array.from({ length: bgvBatchEncoder.slotCount }, _ =>
      BigInt('5')
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decodeBigInt(result, false)
    const expected = BigUint64Array.from(
      { length: bgvBatchEncoder.slotCount },
      _ => BigInt('1032188')
    )
    expect(decoded).toEqual(expected)
  })
  test('It should negate a cipher and return a cipher result (bfv) (uint64)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = BigUint64Array.from({ length: bfvBatchEncoder.slotCount }, _ =>
      BigInt('5')
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()

    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decodeBigInt(result, false)
    const expected = BigUint64Array.from(
      { length: bfvBatchEncoder.slotCount },
      _ => BigInt('1032188')
    )
    expect(decoded).toEqual(expected)
  })
  test('It should negate a cipher and return a cipher result (bgv) (uint64)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = BigUint64Array.from({ length: bgvBatchEncoder.slotCount }, _ =>
      BigInt('5')
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()

    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decodeBigInt(result, false)
    const expected = BigUint64Array.from(
      { length: bgvBatchEncoder.slotCount },
      _ => BigInt('1032188')
    )
    expect(decoded).toEqual(expected)
  })
  test('It should negate a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'negate')
    item.negate(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  test('It should negate a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'negate')
    const cipherDest = item.negate(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  // Add
  test('It should fail to add ciphers', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    expect(() => item.add(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should add a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    item.add(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    item.add(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'add')
    const cipherDest = item.add(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'add')
    const cipherDest = item.add(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    item.add(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    item.add(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'add')
    const cipherDest = item.add(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'add')
    const cipherDest = item.add(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'add')
    item.add(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(2 * x))
    )
  })
  test('It should add a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'add')
    const cipherDest = item.add(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(2 * x))
    )
  })
  // Sub
  test('It should fail to sub ciphers', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    expect(() => item.sub(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should sub a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const arr2 = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -2 * i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plain2 = bfvBatchEncoder.encode(arr2) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipher2 = bfvEncryptor.encrypt(plain2) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    item.sub(cipher, cipher2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const arr2 = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -2 * i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plain2 = bgvBatchEncoder.encode(arr2) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipher2 = bgvEncryptor.encrypt(plain2) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    item.sub(cipher, cipher2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const arr2 = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -2 * i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plain2 = bfvBatchEncoder.encode(arr2) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipher2 = bfvEncryptor.encrypt(plain2) as CipherText
    const spyOn = jest.spyOn(item, 'sub')
    const cipherDest = item.sub(cipher, cipher2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const arr2 = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -2 * i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plain2 = bgvBatchEncoder.encode(arr2) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipher2 = bgvEncryptor.encrypt(plain2) as CipherText
    const spyOn = jest.spyOn(item, 'sub')
    const cipherDest = item.sub(cipher, cipher2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => 2 * i
    )
    const arr2 = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plain2 = bfvBatchEncoder.encode(arr2) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipher2 = bfvEncryptor.encrypt(plain2) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    item.sub(cipher, cipher2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => 2 * i
    )
    const arr2 = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plain2 = bgvBatchEncoder.encode(arr2) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipher2 = bgvEncryptor.encrypt(plain2) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    item.sub(cipher, cipher2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => 2 * i
    )
    const arr2 = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plain2 = bfvBatchEncoder.encode(arr2) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipher2 = bfvEncryptor.encrypt(plain2) as CipherText
    const spyOn = jest.spyOn(item, 'sub')
    const cipherDest = item.sub(cipher, cipher2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => 2 * i
    )
    const arr2 = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plain2 = bgvBatchEncoder.encode(arr2) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipher2 = bgvEncryptor.encrypt(plain2) as CipherText
    const spyOn = jest.spyOn(item, 'sub')
    const cipherDest = item.sub(cipher, cipher2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const arr2 = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => 2 * i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const plain2 = ckksEncoder.encode(arr2, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipher2 = ckksEncryptor.encrypt(plain2) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sub')
    item.sub(cipher, cipher2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  test('It should sub a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const arr2 = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => 2 * i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const plain2 = ckksEncoder.encode(arr2, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipher2 = ckksEncryptor.encrypt(plain2) as CipherText
    const spyOn = jest.spyOn(item, 'sub')
    const cipherDest = item.sub(cipher, cipher2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher2)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  // Multiply
  test('It should fail to multiply ciphers', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    expect(() =>
      item.multiply(invalidCkksCipher, cipherDest, invalidCkksCipher)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      cipherDest,
      invalidCkksCipher
    )
  })
  test('It should multiply a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    item.multiply(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)

    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    item.multiply(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)

    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiply')
    const cipherDest = item.multiply(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiply')
    const cipherDest = item.multiply(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    item.multiply(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    item.multiply(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiply')
    const cipherDest = item.multiply(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiply')
    const cipherDest = item.multiply(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiply')
    item.multiply(cipher, cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiply')
    const cipherDest = item.multiply(cipher, cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  // Square
  test('It should fail to square ciphers', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    expect(() => item.square(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should square a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    item.square(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    item.square(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'square')
    const cipherDest = item.square(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'square')
    const cipherDest = item.square(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    item.square(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    item.square(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'square')
    const cipherDest = item.square(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'square')
    const cipherDest = item.square(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should square a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'square')
    item.square(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should square a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'square')
    const cipherDest = item.square(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  // Relinearize
  test('It should fail to relinearize a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'relinearize')
    expect(() =>
      item.relinearize(invalidCkksCipher, bfvRelinKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      bfvRelinKeys,
      cipherDest
    )
  })
  test('It should relinearize a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'relinearize')
    item.square(cipher, cipherDest)
    item.relinearize(cipherDest, bfvRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipherDest, bfvRelinKeys, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'relinearize')
    item.square(cipher, cipherDest)
    item.relinearize(cipherDest, bgvRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipherDest, bgvRelinKeys, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }).map(
      (x, i) => -5
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherResult = item.square(cipher) as CipherText
    const spyOn = jest.spyOn(item, 'relinearize')
    const cipherDest = item.relinearize(
      cipherResult,
      bfvRelinKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipherResult, bfvRelinKeys)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }).map(
      (x, i) => -5
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherResult = item.square(cipher) as CipherText
    const spyOn = jest.spyOn(item, 'relinearize')
    const cipherDest = item.relinearize(
      cipherResult,
      bgvRelinKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipherResult, bgvRelinKeys)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    item.square(cipher, cipherDest)
    const spyOn = jest.spyOn(item, 'relinearize')
    item.relinearize(cipherDest, bfvRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipherDest, bfvRelinKeys, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    item.square(cipher, cipherDest)
    const spyOn = jest.spyOn(item, 'relinearize')
    item.relinearize(cipherDest, bgvRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipherDest, bgvRelinKeys, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherResult = item.square(cipher) as CipherText
    const spyOn = jest.spyOn(item, 'relinearize')
    const cipherDest = item.relinearize(
      cipherResult,
      bfvRelinKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipherResult, bfvRelinKeys)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherResult = item.square(cipher) as CipherText
    const spyOn = jest.spyOn(item, 'relinearize')
    const cipherDest = item.relinearize(
      cipherResult,
      bgvRelinKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipherResult, bgvRelinKeys)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should relinearize a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (x, i) => 6
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    item.square(cipher, cipherDest)
    const spyOn = jest.spyOn(item, 'relinearize')
    item.relinearize(cipherDest, ckksRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipherDest, ckksRelinKeys, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should relinearize a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherResult = item.square(cipher) as CipherText
    const spyOn = jest.spyOn(item, 'relinearize')
    const cipherDest = item.relinearize(
      cipherResult,
      ckksRelinKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipherResult, ckksRelinKeys)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  // CipherModSwitchToNext
  test('It should fail to cipherModSwitchToNext a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    expect(() =>
      item.cipherModSwitchToNext(invalidCkksCipher, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should cipherModSwitchToNext a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    item.cipherModSwitchToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    item.cipherModSwitchToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    const cipherDest = item.cipherModSwitchToNext(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    const cipherDest = item.cipherModSwitchToNext(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    item.cipherModSwitchToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    item.cipherModSwitchToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    const cipherDest = item.cipherModSwitchToNext(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    const cipherDest = item.cipherModSwitchToNext(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchToNext a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    item.cipherModSwitchToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should cipherModSwitchToNext a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherModSwitchToNext')
    const cipherDest = item.cipherModSwitchToNext(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // cipherModSwitchTo
  test('It should fail to cipherModSwitchTo a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const parmsId = bfvContext.lastParmsId

    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    expect(() =>
      item.cipherModSwitchTo(invalidCkksCipher, parmsId, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, parmsId, cipherDest)
  })
  test('It should cipherModSwitchTo a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const parmsId = bfvContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    item.cipherModSwitchTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const parmsId = bgvContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    item.cipherModSwitchTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const parmsId = bfvContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    const cipherDest = item.cipherModSwitchTo(cipher, parmsId) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const parmsId = bgvContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    const cipherDest = item.cipherModSwitchTo(cipher, parmsId) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const parmsId = bfvContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    item.cipherModSwitchTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const parmsId = bgvContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    item.cipherModSwitchTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const parmsId = bfvContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    const cipherDest = item.cipherModSwitchTo(cipher, parmsId) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const parmsId = bgvContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    const cipherDest = item.cipherModSwitchTo(cipher, parmsId) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x))
  })
  test('It should cipherModSwitchTo a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const parmsId = ckksContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    item.cipherModSwitchTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should cipherModSwitchTo a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const parmsId = ckksContext.lastParmsId
    const spyOn = jest.spyOn(item, 'cipherModSwitchTo')
    const cipherDest = item.cipherModSwitchTo(cipher, parmsId) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // plainModSwitchToNext
  test('It should fail to plainModSwitchToNext a plain', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    expect(() =>
      item.plainModSwitchToNext(invalidCkksPlain, plainDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksPlain, plainDest)
  })
  test('It should plainModSwitchToNext a plain to a destination plain (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    item.plainModSwitchToNext(plain, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, plainDest)
  })
  test('It should plainModSwitchToNext a plain to a destination plain (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = bgvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    item.plainModSwitchToNext(plain, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, plainDest)
  })
  test('It should plainModSwitchToNext a plain and return a plain result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    const plainDest = item.plainModSwitchToNext(plain) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainModSwitchToNext a plain and return a plain result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const parmsId = bgvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    const plainDest = item.plainModSwitchToNext(plain) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainModSwitchToNext a plain to a destination plain (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    item.plainModSwitchToNext(plain, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, plainDest)
  })
  test('It should plainModSwitchToNext a plain to a destination plain (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = bgvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    item.plainModSwitchToNext(plain, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, plainDest)
  })
  test('It should plainModSwitchToNext a plain and return a plain result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    const plainDest = item.plainModSwitchToNext(plain) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainModSwitchToNext a plain and return a plain result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const parmsId = bgvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    const plainDest = item.plainModSwitchToNext(plain) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainModSwitchToNext a plain to a destination plain (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const plainDest = seal.PlainText()
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    item.plainModSwitchToNext(plain, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, plainDest)
    const decoded = ckksEncoder.decode(plainDest)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should plainModSwitchToNext a plain and return a plain result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const spyOn = jest.spyOn(item, 'plainModSwitchToNext')
    const plainDest = item.plainModSwitchToNext(plain) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(plainDest.instance).toBeDefined()
    const decoded = ckksEncoder.decode(plainDest)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // plainModSwitchTo
  test('It should fail to plainModSwitchTo a plain', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    expect(() =>
      item.plainModSwitchTo(invalidCkksPlain, parmsId, plainDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksPlain, parmsId, plainDest)
  })
  test('It should plainModSwitchTo a plain to a destination plain (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    item.plainModSwitchTo(plain, parmsId, plain)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plain)
  })
  test('It should plainModSwitchTo a plain to a destination plain (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const parmsId = bgvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    item.plainModSwitchTo(plain, parmsId, plain)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plain)
  })
  test('It should plainModSwitchTo a plain and return a plain result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    const plainDest = item.plainModSwitchTo(plain, parmsId) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainModSwitchTo a plain and return a plain result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const parmsId = bgvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    const plainDest = item.plainModSwitchTo(plain, parmsId) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainModSwitchTo a plain to a destination plain (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    item.plainModSwitchTo(plain, parmsId, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plainDest)
  })
  test('It should plainModSwitchTo a plain to a destination plain (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = bgvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    item.plainModSwitchTo(plain, parmsId, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plainDest)
  })
  test('It should plainModSwitchTo a plain and return a plain result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    const plainDest = item.plainModSwitchTo(plain, parmsId) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainModSwitchTo a plain and return a plain result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const parmsId = bgvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    const plainDest = item.plainModSwitchTo(plain, parmsId) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainModSwitchTo a plain to a destination plain (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = ckksContext.lastParmsId
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    item.plainModSwitchTo(plain, parmsId, plainDest)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plainDest)
    const decoded = ckksEncoder.decode(plainDest)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should plainModSwitchTo a plain and return a plain result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const parmsId = ckksContext.lastParmsId
    const spyOn = jest.spyOn(item, 'plainModSwitchTo')
    const plainDest = item.plainModSwitchTo(plain, parmsId) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest.instance).toBeDefined()
    const decoded = ckksEncoder.decode(plainDest)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // rescaleToNext
  test('It should fail to rescaleToNext a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rescaleToNext')
    expect(() => item.rescaleToNext(invalidCkksCipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipherDest)
  })
  test('It should fail to rescaleToNext for bfv scheme', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rescaleToNext')
    expect(() => item.rescaleToNext(cipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
  })
  test('It should fail to rescaleToNext for bgv scheme', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rescaleToNext')
    expect(() => item.rescaleToNext(cipher, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
  })
  test('It should rescaleToNext a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rescaleToNext')
    item.rescaleToNext(cipher, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipherDest)
    const decrypted = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescaleToNext a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rescaleToNext')
    const cipherDest = item.rescaleToNext(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
    const decrypted = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  // rescaleTo
  test('It should fail to rescaleTo for bfv scheme', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const parmsId = bfvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'rescaleTo')
    expect(() => item.rescaleTo(cipher, parmsId, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
  })
  test('It should fail to rescaleTo for bgv scheme', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const parmsId = bgvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'rescaleTo')
    expect(() => item.rescaleTo(cipher, parmsId, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
  })

  test('It should rescaleTo a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const parmsId = ckksContext.firstParmsId
    const spyOn = jest.spyOn(item, 'rescaleTo')
    item.rescaleTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const decrypted = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescaleTo a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const parmsId = ckksContext.firstParmsId
    const spyOn = jest.spyOn(item, 'rescaleTo')
    const cipherDest = item.rescaleTo(cipher, parmsId) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest.instance).toBeDefined()
    const decrypted = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })

  // modReduceTo
  test('It should modReduceTo a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const parmsId = ckksContext.firstParmsId
    const spyOn = jest.spyOn(item, 'modReduceTo')
    item.modReduceTo(cipher, parmsId, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId, cipherDest)
    const decrypted = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should modReduceTo a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 35)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const parmsId = ckksContext.firstParmsId
    const spyOn = jest.spyOn(item, 'modReduceTo')
    const cipherDest = item.modReduceTo(cipher, parmsId) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, parmsId)
    expect(cipherDest.instance).toBeDefined()
    const decrypted = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(decrypted)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })

  // Exponentiate
  test('It should fail to exponentiate a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    expect(() =>
      item.exponentiate(invalidCkksCipher, 2, bfvRelinKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      2,
      bfvRelinKeys,
      cipherDest
    )
  })
  test('It should exponentiate a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    item.exponentiate(cipher, 2, bfvRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, bfvRelinKeys, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    item.exponentiate(cipher, 2, bgvRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, bgvRelinKeys, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'exponentiate')
    const cipherDest = item.exponentiate(cipher, 2, bfvRelinKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, bfvRelinKeys)
    expect(cipherDest.instance).toBeDefined()

    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'exponentiate')
    const cipherDest = item.exponentiate(cipher, 2, bgvRelinKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, bgvRelinKeys)
    expect(cipherDest.instance).toBeDefined()

    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    item.exponentiate(cipher, 2, bfvRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, bfvRelinKeys, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    item.exponentiate(cipher, 2, bgvRelinKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, bgvRelinKeys, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'exponentiate')
    const cipherDest = item.exponentiate(cipher, 2, bfvRelinKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, bfvRelinKeys)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should exponentiate a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'exponentiate')
    const cipherDest = item.exponentiate(cipher, 2, bgvRelinKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, bgvRelinKeys)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should fail to exponentiate for ckks scheme', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'exponentiate')
    expect(() =>
      item.exponentiate(cipher, 2, ckksRelinKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, 2, ckksRelinKeys, cipherDest)
  })
  // Add plain
  test('It should fail to add a plain to a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    expect(() => item.addPlain(cipher, invalidCkksPlain, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, invalidCkksPlain, cipherDest)
  })
  test('It should add a plain to a cipher and store in a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    item.addPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher and store in a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    item.addPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'addPlain')
    const cipherDest = item.addPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()

    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'addPlain')
    const cipherDest = item.addPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()

    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    item.addPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    item.addPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'addPlain')
    const cipherDest = item.addPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'addPlain')
    const cipherDest = item.addPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => 2 * x))
  })
  test('It should add a plain to a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'addPlain')
    item.addPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(2 * x))
    )
  })
  test('It should add a plain to a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'addPlain')
    const cipherDest = item.addPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(2 * x))
    )
  })
  // Sub plain
  test('It should fail to sub a plain from a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    expect(() => item.subPlain(cipher, invalidCkksPlain, cipherDest)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, invalidCkksPlain, cipherDest)
  })
  test('It should sub a plain from a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const arr2 = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -2 * i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plain2 = bfvBatchEncoder.encode(arr2) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    item.subPlain(cipher, plain2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a plain from a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const arr2 = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -2 * i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plain2 = bgvBatchEncoder.encode(arr2) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    item.subPlain(cipher, plain2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a plain from a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const arr2 = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -2 * i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plain2 = bfvBatchEncoder.encode(arr2) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'subPlain')
    const cipherDest = item.subPlain(cipher, plain2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2)
    expect(cipherDest.instance).toBeDefined()

    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a plain from a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const arr2 = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => -2 * i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plain2 = bgvBatchEncoder.encode(arr2) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'subPlain')
    const cipherDest = item.subPlain(cipher, plain2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2)
    expect(cipherDest.instance).toBeDefined()

    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => -x))
  })
  test('It should sub a plain from a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => 2 * i
    )
    const arr2 = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plain2 = bfvBatchEncoder.encode(arr2) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    item.subPlain(cipher, plain2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a plain from a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => 2 * i
    )
    const arr2 = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plain2 = bgvBatchEncoder.encode(arr2) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    item.subPlain(cipher, plain2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a plain from a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => 2 * i
    )
    const arr2 = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plain2 = bfvBatchEncoder.encode(arr2) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'subPlain')
    const cipherDest = item.subPlain(cipher, plain2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a plain from a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => 2 * i
    )
    const arr2 = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const plain2 = bgvBatchEncoder.encode(arr2) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'subPlain')
    const cipherDest = item.subPlain(cipher, plain2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr2.map(x => x))
  })
  test('It should sub a plain from a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const arr2 = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => 2 * i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const plain2 = ckksEncoder.encode(arr2, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'subPlain')
    item.subPlain(cipher, plain2, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  test('It should sub a plain from a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const arr2 = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => 2 * i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const plain2 = ckksEncoder.encode(arr2, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'subPlain')
    const cipherDest = item.subPlain(cipher, plain2) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain2)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(-x))
    )
  })
  // Multiply plain
  test('It should fail to multiply a cipher by a plain', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => -i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    expect(() =>
      item.multiplyPlain(cipher, invalidCkksPlain, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, invalidCkksPlain, cipherDest)
  })
  test('It should multiply a cipher by a plain and store it to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    item.multiplyPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and store it to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    item.multiplyPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    const cipherDest = item.multiplyPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    const cipherDest = item.multiplyPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, true)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and store it to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    item.multiplyPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and store it to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    item.multiplyPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    const cipherDest = item.multiplyPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()
    const result = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    const cipherDest = item.multiplyPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()
    const result = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(result, false)
    expect(decoded).toEqual(arr.map(x => x * x))
  })
  test('It should multiply a cipher by a plain and store it to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    item.multiplyPlain(cipher, plain, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, plain, cipherDest)
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a cipher by a plain and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 6)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'multiplyPlain')
    const cipherDest = item.multiplyPlain(cipher, plain) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, plain)
    expect(cipherDest.instance).toBeDefined()
    const result = ckksDecryptor.decrypt(cipherDest) as PlainText
    const decoded = ckksEncoder.decode(result)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x * x))
    )
  })
  // plainTransformToNtt
  test('It should fail to plainTransformToNtt a plain', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const plainDest = seal.PlainText()
    const parmsId = bfvContext.firstParmsId
    item.plainTransformToNtt(plain, parmsId, plain)
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    expect(() =>
      item.plainTransformToNtt(invalidCkksPlain, parmsId, plainDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksPlain, parmsId, plainDest)
  })
  test('It should plainTransformToNtt a plain to a destination plain (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const parmsId = bfvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    item.plainTransformToNtt(plain, parmsId, plain)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plain)
  })
  test('It should plainTransformToNtt a plain to a destination plain (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const parmsId = bgvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    item.plainTransformToNtt(plain, parmsId, plain)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plain)
  })
  test('It should plainTransformToNtt a plain and return a plain result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const parmsId = bfvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    const plainDest = item.plainTransformToNtt(plain, parmsId) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainTransformToNtt a plain and return a plain result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => -5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const parmsId = bgvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    const plainDest = item.plainTransformToNtt(plain, parmsId) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainTransformToNtt a plain to a destination plain (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const parmsId = bfvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    item.plainTransformToNtt(plain, parmsId, plain)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plain)
  })
  test('It should plainTransformToNtt a plain to a destination plain (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const parmsId = bgvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    item.plainTransformToNtt(plain, parmsId, plain)
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId, plain)
  })
  test('It should plainTransformToNtt a plain and return a plain result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const parmsId = bfvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    const plainDest = item.plainTransformToNtt(plain, parmsId) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should plainTransformToNtt a plain and return a plain result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 10)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const parmsId = bgvContext.firstParmsId
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    const plainDest = item.plainTransformToNtt(plain, parmsId) as PlainText
    expect(spyOn).toHaveBeenCalledWith(plain, parmsId)
    expect(plainDest.instance).toBeDefined()
  })
  test('It should fail to plainTransformToNtt on ckks scheme', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 10)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const spyOn = jest.spyOn(item, 'plainTransformToNtt')
    expect(() =>
      item.plainTransformToNtt(plain, null as unknown as ParmsIdType)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain, null)
  })
  // cipherTransformToNtt
  test('It should fail to cipherTransformToNtt a plain', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    expect(() => item.cipherTransformToNtt(invalidCkksCipher, cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(invalidCkksCipher, cipher)
  })
  test('It should cipherTransformToNtt a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    item.cipherTransformToNtt(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  test('It should cipherTransformToNtt a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    const cipherDest = item.cipherTransformToNtt(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should cipherTransformToNtt a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    item.cipherTransformToNtt(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  test('It should cipherTransformToNtt a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    const cipherDest = item.cipherTransformToNtt(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should fail to cipherTransformToNtt on ckks scheme', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 10)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherTransformToNtt')
    expect(() => item.cipherTransformToNtt(cipher, cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  // cipherTransformFromNtt
  test('It should cipherTransformFromNtt a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    item.cipherTransformToNtt(cipher, cipher)
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    item.cipherTransformFromNtt(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  test('It should cipherTransformFromNtt a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => -5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    item.cipherTransformToNtt(cipher, cipher)
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    const cipherDest = item.cipherTransformFromNtt(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should cipherTransformFromNtt a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    item.cipherTransformToNtt(cipher, cipher)
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    item.cipherTransformFromNtt(cipher, cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })
  test('It should cipherTransformFromNtt a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 10)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    item.cipherTransformToNtt(cipher, cipher)
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    const cipherDest = item.cipherTransformFromNtt(cipher) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should fail to cipherTransformFromNtt on ckks scheme', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 10)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'cipherTransformFromNtt')
    expect(() => item.cipherTransformFromNtt(cipher, cipher)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, cipher)
  })

  // applyGalois
  test('It should fail to applyGalois on a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const galElt = 2 * bfvEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    expect(() =>
      item.applyGalois(invalidCkksCipher, galElt, bfvGaloisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      galElt,
      bfvGaloisKeys,
      cipherDest
    )
  })
  test('It should applyGalois on a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const galElt = 2 * bfvEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    item.applyGalois(cipher, galElt, bfvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      galElt,
      bfvGaloisKeys,
      cipherDest
    )
  })
  test('It should applyGalois on a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const galElt = 2 * bgvEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    item.applyGalois(cipher, galElt, bgvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      galElt,
      bgvGaloisKeys,
      cipherDest
    )
  })
  test('It should applyGalois on a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const galElt = 2 * bfvEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    const cipherDest = item.applyGalois(
      cipher,
      galElt,
      bfvGaloisKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, bfvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should applyGalois on a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const galElt = 2 * bgvEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    const cipherDest = item.applyGalois(
      cipher,
      galElt,
      bgvGaloisKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, bgvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should applyGalois on a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const galElt = 2 * bfvEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    item.applyGalois(cipher, galElt, bfvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      galElt,
      bfvGaloisKeys,
      cipherDest
    )
  })
  test('It should applyGalois on a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const galElt = 2 * bgvEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    item.applyGalois(cipher, galElt, bgvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      galElt,
      bgvGaloisKeys,
      cipherDest
    )
  })
  test('It should applyGalois on a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const galElt = 2 * bfvEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    const cipherDest = item.applyGalois(
      cipher,
      galElt,
      bfvGaloisKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, bfvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should applyGalois on a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const galElt = 2 * bgvEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    const cipherDest = item.applyGalois(
      cipher,
      galElt,
      bgvGaloisKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, bgvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should applyGalois on a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const galElt = 2 * ckksEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    item.applyGalois(cipher, galElt, ckksGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      galElt,
      ckksGaloisKeys,
      cipherDest
    )
  })
  test('It should applyGalois on a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const galElt = 2 * ckksEncParms.polyModulusDegree - 1
    const spyOn = jest.spyOn(item, 'applyGalois')
    const cipherDest = item.applyGalois(
      cipher,
      galElt,
      ckksGaloisKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, galElt, ckksGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  // rotateRows
  test('It should rotateRows on a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateRows')
    item.rotateRows(cipher, 5, bfvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bfvGaloisKeys, cipherDest)
  })
  test('It should rotateRows on a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateRows')
    item.rotateRows(cipher, 5, bgvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bgvGaloisKeys, cipherDest)
  })
  test('It should rotateRows on a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rotateRows')
    const cipherDest = item.rotateRows(cipher, 5, bfvGaloisKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bfvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should rotateRows on a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rotateRows')
    const cipherDest = item.rotateRows(cipher, 5, bgvGaloisKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bgvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should rotateRows on a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateRows')
    item.rotateRows(cipher, 5, bfvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bfvGaloisKeys, cipherDest)
  })
  test('It should rotateRows on a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateRows')
    item.rotateRows(cipher, 5, bgvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bgvGaloisKeys, cipherDest)
  })
  test('It should rotateRows on a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rotateRows')
    const cipherDest = item.rotateRows(cipher, 5, bfvGaloisKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bfvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should rotateRows on a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rotateRows')
    const cipherDest = item.rotateRows(cipher, 5, bgvGaloisKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bgvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should fail to rotateRows when using ckks', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateRows')
    expect(() =>
      item.rotateRows(cipher, 5, ckksGaloisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, ckksGaloisKeys, cipherDest)
  })
  // rotateColumns
  test('It should rotateColumns on a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateColumns')
    item.rotateColumns(cipher, bfvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, bfvGaloisKeys, cipherDest)
  })
  test('It should rotateColumns on a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateColumns')
    item.rotateColumns(cipher, bgvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, bgvGaloisKeys, cipherDest)
  })
  test('It should rotateColumns on a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rotateColumns')
    const cipherDest = item.rotateColumns(cipher, bfvGaloisKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, bfvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should rotateColumns on a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rotateColumns')
    const cipherDest = item.rotateColumns(cipher, bgvGaloisKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, bgvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should rotateColumns on a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateColumns')
    item.rotateColumns(cipher, bfvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, bfvGaloisKeys, cipherDest)
  })
  test('It should rotateColumns on a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateColumns')
    item.rotateColumns(cipher, bgvGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, bgvGaloisKeys, cipherDest)
  })
  test('It should rotateColumns on a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rotateColumns')
    const cipherDest = item.rotateColumns(cipher, bfvGaloisKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, bfvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should rotateColumns on a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rotateColumns')
    const cipherDest = item.rotateColumns(cipher, bgvGaloisKeys) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, bgvGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  test('It should fail to rotateColumns when using ckks', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateColumns')
    expect(() =>
      item.rotateColumns(cipher, ckksGaloisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, ckksGaloisKeys, cipherDest)
  })
  // rotateVector
  test('It should fail to rotateVector when using bfv', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateVector')
    expect(() =>
      item.rotateVector(cipher, 5, bfvGaloisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bfvGaloisKeys, cipherDest)
  })
  test('It should fail to rotateVector when using bgv', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateVector')
    expect(() =>
      item.rotateVector(cipher, 5, bgvGaloisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, bgvGaloisKeys, cipherDest)
  })
  test('It should rotateVector on a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'rotateVector')
    item.rotateVector(cipher, 5, ckksGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, ckksGaloisKeys, cipherDest)
  })
  test('It should rotateVector on a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'rotateVector')
    const cipherDest = item.rotateVector(
      cipher,
      5,
      ckksGaloisKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, 5, ckksGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  // complexConjugate
  test('It should fail to complexConjugate when using bfv', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from(
      { length: bfvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'complexConjugate')
    expect(() =>
      item.complexConjugate(cipher, bfvGaloisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, bfvGaloisKeys, cipherDest)
  })
  test('It should fail to complexConjugate when using bgv', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from(
      { length: bgvBatchEncoder.slotCount },
      (_, i) => i
    )
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'complexConjugate')
    expect(() =>
      item.complexConjugate(cipher, bgvGaloisKeys, cipherDest)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(cipher, bgvGaloisKeys, cipherDest)
  })
  test('It should complexConjugate on a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'complexConjugate')
    item.complexConjugate(cipher, ckksGaloisKeys, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(cipher, ckksGaloisKeys, cipherDest)
  })
  test('It should complexConjugate on a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'complexConjugate')
    const cipherDest = item.complexConjugate(
      cipher,
      ckksGaloisKeys
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(cipher, ckksGaloisKeys)
    expect(cipherDest.instance).toBeDefined()
  })
  // sumElements
  test('It should fail to sumElements on a cipher', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    expect(() =>
      item.sumElements(
        invalidCkksCipher,
        bfvGaloisKeys,
        bfvEncParms.scheme,
        cipherDest
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
  })
  test('It should sumElements on a cipher to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    item.sumElements(cipher, bfvGaloisKeys, bfvEncParms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    item.sumElements(cipher, bgvGaloisKeys, bgvEncParms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      bgvGaloisKeys,
      bgvEncParms.scheme,
      cipherDest
    )
    const decrypted = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(decrypted)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'sumElements')
    const cipherDest = item.sumElements(
      cipher,
      bfvGaloisKeys,
      bfvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      bfvGaloisKeys,
      bfvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'sumElements')
    const cipherDest = item.sumElements(
      cipher,
      bgvGaloisKeys,
      bgvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      bgvGaloisKeys,
      bgvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
    const decrypted = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(decrypted)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    item.sumElements(cipher, bfvGaloisKeys, bfvEncParms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted, false)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    item.sumElements(cipher, bgvGaloisKeys, bgvEncParms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      bgvGaloisKeys,
      bgvEncParms.scheme,
      cipherDest
    )
    const decrypted = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(decrypted, false)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'sumElements')
    const cipherDest = item.sumElements(
      cipher,
      bfvGaloisKeys,
      bfvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      bfvGaloisKeys,
      bfvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()

    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted, false)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'sumElements')
    const cipherDest = item.sumElements(
      cipher,
      bgvGaloisKeys,
      bgvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      bgvGaloisKeys,
      bgvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()

    const decrypted = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(decrypted, false)
    const sum = arr.reduce((acc, x) => acc + x, 0)
    expect(decoded).toEqual(arr.fill(sum))
  })
  test('It should sumElements on a cipher to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 5)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 27)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'sumElements')
    item.sumElements(cipher, ckksGaloisKeys, ckksEncParms.scheme, cipherDest)
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      ckksGaloisKeys,
      ckksEncParms.scheme,
      cipherDest
    )
  })
  test('It should sumElements on a cipher and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 5)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 27)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'sumElements')
    const cipherDest = item.sumElements(
      cipher,
      ckksGaloisKeys,
      ckksEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      ckksGaloisKeys,
      ckksEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
  })
  // dotProduct
  test('It should fail to dotProduct two ciphers', () => {
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    expect(() =>
      item.dotProduct(
        invalidCkksCipher,
        invalidCkksCipher,
        bfvRelinKeys,
        bfvGaloisKeys,
        bfvEncParms.scheme,
        cipherDest
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      invalidCkksCipher,
      bfvRelinKeys,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
  })
  test('It should calculate the dotProduct of two ciphers to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    item.dotProduct(
      cipher,
      cipher2,
      bfvRelinKeys,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      bfvRelinKeys,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers to a destination cipher (bgv) (int32)', () => {
    const coeffMod = seal.CoeffModulus.BFVDefault(8192)
    const plainMod = seal.PlainModulus.Batching(8192, 20)
    const encParms = seal.EncryptionParameters(seal.SchemeType.bgv)
    encParms.setPolyModulusDegree(8192)
    encParms.setCoeffModulus(coeffMod)
    encParms.setPlainModulus(plainMod)
    const ctx = seal.Context(encParms)
    const encoder = seal.BatchEncoder(ctx)
    const keyGenerator = seal.KeyGenerator(ctx)
    const relinKeys = keyGenerator.createRelinKeys()
    const galoisKeys = keyGenerator.createGaloisKeys(
      Int32Array.from([2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0])
    )
    const secretKey = keyGenerator.secretKey()
    const publicKey = keyGenerator.createPublicKey()
    const encryptor = seal.Encryptor(ctx, publicKey)
    const decryptor = seal.Decryptor(ctx, secretKey)

    const item = seal.Evaluator(ctx)
    const arr = Int32Array.from({ length: encoder.slotCount }, _ => 5)
    const plain = encoder.encode(arr) as PlainText
    const cipher = encryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    item.dotProduct(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      encParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      encParms.scheme,
      cipherDest
    )
    const decrypted = decryptor.decrypt(cipherDest) as PlainText
    const decoded = encoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const spyOn = jest.spyOn(item, 'dotProduct')
    const cipherDest = item.dotProduct(
      cipher,
      cipher2,
      bfvRelinKeys,
      bfvGaloisKeys,
      bfvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      bfvRelinKeys,
      bfvGaloisKeys,
      bfvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers and return a cipher result (bgv) (int32)', () => {
    const coeffMod = seal.CoeffModulus.BFVDefault(8192)
    const plainMod = seal.PlainModulus.Batching(8192, 20)
    const encParms = seal.EncryptionParameters(seal.SchemeType.bgv)
    encParms.setPolyModulusDegree(8192)
    encParms.setCoeffModulus(coeffMod)
    encParms.setPlainModulus(plainMod)
    const ctx = seal.Context(encParms)
    const encoder = seal.BatchEncoder(ctx)
    const keyGenerator = seal.KeyGenerator(ctx)
    const relinKeys = keyGenerator.createRelinKeys()
    const galoisKeys = keyGenerator.createGaloisKeys(
      Int32Array.from([2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0])
    )
    const secretKey = keyGenerator.secretKey()
    const publicKey = keyGenerator.createPublicKey()
    const encryptor = seal.Encryptor(ctx, publicKey)
    const decryptor = seal.Decryptor(ctx, secretKey)

    const item = seal.Evaluator(ctx)
    const arr = Int32Array.from({ length: encoder.slotCount }, _ => 5)
    const plain = encoder.encode(arr) as PlainText
    const cipher = encryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const spyOn = jest.spyOn(item, 'dotProduct')
    const cipherDest = item.dotProduct(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      encParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      encParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
    const decrypted = decryptor.decrypt(cipherDest) as PlainText
    const decoded = encoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    item.dotProduct(
      cipher,
      cipher2,
      bfvRelinKeys,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      bfvRelinKeys,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers to a destination cipher (bgv) (uint32)', () => {
    const coeffMod = seal.CoeffModulus.BFVDefault(8192)
    const plainMod = seal.PlainModulus.Batching(8192, 20)
    const encParms = seal.EncryptionParameters(seal.SchemeType.bgv)
    encParms.setPolyModulusDegree(8192)
    encParms.setCoeffModulus(coeffMod)
    encParms.setPlainModulus(plainMod)
    const ctx = seal.Context(encParms)
    const encoder = seal.BatchEncoder(ctx)
    const keyGenerator = seal.KeyGenerator(ctx)
    const relinKeys = keyGenerator.createRelinKeys()
    const galoisKeys = keyGenerator.createGaloisKeys(
      Int32Array.from([2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0])
    )
    const secretKey = keyGenerator.secretKey()
    const publicKey = keyGenerator.createPublicKey()
    const encryptor = seal.Encryptor(ctx, publicKey)
    const decryptor = seal.Decryptor(ctx, secretKey)

    const item = seal.Evaluator(ctx)
    const arr = Uint32Array.from({ length: encoder.slotCount }, _ => 5)
    const plain = encoder.encode(arr) as PlainText
    const cipher = encryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    item.dotProduct(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      encParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      encParms.scheme,
      cipherDest
    )
    const decrypted = decryptor.decrypt(cipherDest) as PlainText
    const decoded = encoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const spyOn = jest.spyOn(item, 'dotProduct')
    const cipherDest = item.dotProduct(
      cipher,
      cipher2,
      bfvRelinKeys,
      bfvGaloisKeys,
      bfvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      bfvRelinKeys,
      bfvGaloisKeys,
      bfvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers and return a cipher result (bgv) (uint32)', () => {
    const coeffMod = seal.CoeffModulus.BFVDefault(8192)
    const plainMod = seal.PlainModulus.Batching(8192, 20)
    const encParms = seal.EncryptionParameters(seal.SchemeType.bgv)
    encParms.setPolyModulusDegree(8192)
    encParms.setCoeffModulus(coeffMod)
    encParms.setPlainModulus(plainMod)
    const ctx = seal.Context(encParms)
    const encoder = seal.BatchEncoder(ctx)
    const keyGenerator = seal.KeyGenerator(ctx)
    const relinKeys = keyGenerator.createRelinKeys()
    const galoisKeys = keyGenerator.createGaloisKeys(
      Int32Array.from([2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0])
    )
    const secretKey = keyGenerator.secretKey()
    const publicKey = keyGenerator.createPublicKey()
    const encryptor = seal.Encryptor(ctx, publicKey)
    const decryptor = seal.Decryptor(ctx, secretKey)

    const item = seal.Evaluator(ctx)
    const arr = Uint32Array.from({ length: encoder.slotCount }, _ => 5)
    const plain = encoder.encode(arr) as PlainText
    const cipher = encryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const spyOn = jest.spyOn(item, 'dotProduct')
    const cipherDest = item.dotProduct(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      encParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      relinKeys,
      galoisKeys,
      encParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
    const decrypted = decryptor.decrypt(cipherDest) as PlainText
    const decoded = encoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of two ciphers to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 5)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProduct')
    item.dotProduct(
      cipher,
      cipher2,
      ckksRelinKeys,
      ckksGaloisKeys,
      ckksEncParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      ckksRelinKeys,
      ckksGaloisKeys,
      ckksEncParms.scheme,
      cipherDest
    )
  })
  test('It should calculate the dotProduct of two ciphers and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 5)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipher2 = cipher.clone()
    const spyOn = jest.spyOn(item, 'dotProduct')
    const cipherDest = item.dotProduct(
      cipher,
      cipher2,
      ckksRelinKeys,
      ckksGaloisKeys,
      ckksEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      cipher2,
      ckksRelinKeys,
      ckksGaloisKeys,
      ckksEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
  })
  // dotProductPlain
  test('It should fail to dotProductPlain two ciphers', () => {
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 5)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const item = seal.Evaluator(bfvContext)
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    expect(() =>
      item.dotProductPlain(
        invalidCkksCipher,
        plain,
        bfvGaloisKeys,
        bfvEncParms.scheme,
        cipherDest
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      invalidCkksCipher,
      plain,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
  })
  test('It should calculate the dotProduct of a cipher and a plain to a destination cipher (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    item.dotProductPlain(
      cipher,
      plain,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain to a destination cipher (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    item.dotProductPlain(
      cipher,
      plain,
      bgvGaloisKeys,
      bgvEncParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      bgvGaloisKeys,
      bgvEncParms.scheme,
      cipherDest
    )
    const decrypted = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain and return a cipher result (bfv) (int32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Int32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    const cipherDest = item.dotProductPlain(
      cipher,
      plain,
      bfvGaloisKeys,
      bfvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      bfvGaloisKeys,
      bfvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain and return a cipher result (bgv) (int32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Int32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    const cipherDest = item.dotProductPlain(
      cipher,
      plain,
      bgvGaloisKeys,
      bgvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      bgvGaloisKeys,
      bgvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
    const decrypted = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(decrypted)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain to a destination cipher (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    item.dotProductPlain(
      cipher,
      plain,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      bfvGaloisKeys,
      bfvEncParms.scheme,
      cipherDest
    )
    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain to a destination cipher (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    item.dotProductPlain(
      cipher,
      plain,
      bgvGaloisKeys,
      bgvEncParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      bgvGaloisKeys,
      bgvEncParms.scheme,
      cipherDest
    )
    const decrypted = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain and return a cipher result (bfv) (uint32)', () => {
    const item = seal.Evaluator(bfvContext)
    const arr = Uint32Array.from({ length: bfvBatchEncoder.slotCount }, _ => 5)
    const plain = bfvBatchEncoder.encode(arr) as PlainText
    const cipher = bfvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    const cipherDest = item.dotProductPlain(
      cipher,
      plain,
      bfvGaloisKeys,
      bfvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      bfvGaloisKeys,
      bfvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()

    const decrypted = bfvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bfvBatchEncoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain and return a cipher result (bgv) (uint32)', () => {
    const item = seal.Evaluator(bgvContext)
    const arr = Uint32Array.from({ length: bgvBatchEncoder.slotCount }, _ => 5)
    const plain = bgvBatchEncoder.encode(arr) as PlainText
    const cipher = bgvEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    const cipherDest = item.dotProductPlain(
      cipher,
      plain,
      bgvGaloisKeys,
      bgvEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      bgvGaloisKeys,
      bgvEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()

    const decrypted = bgvDecryptor.decrypt(cipherDest) as PlainText
    const decoded = bgvBatchEncoder.decode(decrypted, false)
    const dot = arr.reduce((r, a, i) => r + a * arr[i], 0)
    expect(decoded).toEqual(arr.fill(dot))
  })
  test('It should calculate the dotProduct of a cipher and a plain to a destination cipher (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 5)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const cipherDest = seal.CipherText()
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    item.dotProductPlain(
      cipher,
      plain,
      ckksGaloisKeys,
      ckksEncParms.scheme,
      cipherDest
    )
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      ckksGaloisKeys,
      ckksEncParms.scheme,
      cipherDest
    )
  })
  test('It should calculate the dotProduct of a cipher and a plain and return a cipher result (ckks)', () => {
    const item = seal.Evaluator(ckksContext)
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 5)
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    const cipher = ckksEncryptor.encrypt(plain) as CipherText
    const spyOn = jest.spyOn(item, 'dotProductPlain')
    const cipherDest = item.dotProductPlain(
      cipher,
      plain,
      ckksGaloisKeys,
      ckksEncParms.scheme
    ) as CipherText
    expect(spyOn).toHaveBeenCalledWith(
      cipher,
      plain,
      ckksGaloisKeys,
      ckksEncParms.scheme
    )
    expect(cipherDest.instance).toBeDefined()
  })
})
