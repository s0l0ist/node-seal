import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type BatchEncoder,
  type Context,
  type Decryptor,
  type Encryptor,
  type MainModule
} from '../index_throws'

let seal: MainModule
let context: Context
let encoder: BatchEncoder
let encryptor: Encryptor
let decryptor: Decryptor

beforeAll(async () => {
  seal = await MainModuleFactory()
  const polyModulusDegree = 4096
  const securityLevel = seal.SecLevelType.tc128
  const parms = new seal.EncryptionParameters(seal.SchemeType.bfv)
  parms.setPolyModulusDegree(polyModulusDegree)
  parms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(polyModulusDegree, securityLevel)
  )
  parms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, 20))
  context = new seal.Context(parms, true, securityLevel)
  encoder = new seal.BatchEncoder(context)
  const keyGen = new seal.KeyGenerator(context)
  const pubKey = keyGen.createPublicKey()
  const secKey = keyGen.secretKey()
  encryptor = new seal.Encryptor(context, pubKey, secKey)
  decryptor = new seal.Decryptor(context, secKey)
})

describe('Encryptor', () => {
  test('Encrypt a plaintext to a cipher and decrypt (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext(context)
    encryptor.encrypt(plain, cipher)
    // Clear the plaintext
    plain.setZero()
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Encrypt a plaintext to a cipher and decrypt with pool (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext(context)
    const pool = seal.MemoryPoolHandle.Global()
    encryptor.encryptWithPool(plain, cipher, pool)
    // Clear the plaintext
    plain.setZero()
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Encrypt a plaintext as a serialized cipher and decrypt (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = encryptor.encryptSerializable(plain)
    const vec = cipher.saveToVec(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromVec(context, vec)
    // Clear the plaintext
    plain.setZero()
    decryptor.decrypt(cipher2, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Encrypt a plaintext as a serialized cipher and decrypt with pool (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const pool = seal.MemoryPoolHandle.Global()
    const cipher = encryptor.encryptSerializableWithPool(plain, pool)
    const vec = cipher.saveToVec(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromVec(context, vec)
    // Clear the plaintext
    plain.setZero()
    decryptor.decrypt(cipher2, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Symmetric encrypt a plaintext to a cipher and decrypt (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext(context)
    encryptor.encryptSymmetric(plain, cipher)
    // Clear the plaintext
    plain.setZero()
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Symmetric encrypt a plaintext to a cipher and decrypt with pool  (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext(context)
    const pool = seal.MemoryPoolHandle.Global()
    encryptor.encryptSymmetricWithPool(plain, cipher, pool)
    // Clear the plaintext
    plain.setZero()
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Symmetric encrypt a plaintext as a serialized cipher and decrypt (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = encryptor.encryptSymmetricSerializable(plain)
    const vec = cipher.saveToVec(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromVec(context, vec)
    // Clear the plaintext
    plain.setZero()
    decryptor.decrypt(cipher2, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Symmetric encrypt a plaintext as a serialized cipher and decrypt with pool (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, (_, i) =>
      BigInt(-i)
    )
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const pool = seal.MemoryPoolHandle.Global()
    const cipher = encryptor.encryptSymmetricSerializableWithPool(plain, pool)
    const vec = cipher.saveToVec(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromVec(context, vec)
    // Clear the plaintext
    plain.setZero()
    decryptor.decrypt(cipher2, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })

  ///
  test('Encrypt a zero cipher and decrypt (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, _ => 0n)
    const cipher = new seal.Ciphertext(context)
    encryptor.encryptZero(cipher)
    const plain = new seal.Plaintext()
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Encrypt a zero cipher and decrypt with pool  (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, _ => 0n)
    const cipher = new seal.Ciphertext(context)
    const pool = seal.MemoryPoolHandle.Global()
    encryptor.encryptZeroWithPool(cipher, pool)
    const plain = new seal.Plaintext()
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Encrypt a zero, serialized cipher and decrypt (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, _ => 0n)
    const cipher = encryptor.encryptZeroSerializable()
    const vec = cipher.saveToVec(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromVec(context, vec)
    const plain = new seal.Plaintext()
    decryptor.decrypt(cipher2, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Encrypt a zero, serialized cipher and decrypt with pool (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, _ => 0n)
    const pool = seal.MemoryPoolHandle.Global()
    const cipher = encryptor.encryptZeroSerializableWithPool(pool)
    const vec = cipher.saveToVec(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromVec(context, vec)
    const plain = new seal.Plaintext()
    decryptor.decrypt(cipher2, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
})
