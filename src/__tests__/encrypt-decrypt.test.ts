import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type BatchEncoder,
  type Decryptor,
  type Encryptor,
  type MainModule,
  type SEALContext
} from '../index_throws'

let seal: MainModule
let context: SEALContext
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
  context = new seal.SEALContext(parms, true, securityLevel)
  encoder = new seal.BatchEncoder(context)
  const keyGen = new seal.KeyGenerator(context)
  const pubKey = keyGen.createPublicKey()
  const secKey = keyGen.secretKey()
  encryptor = new seal.Encryptor(context, pubKey, secKey)
  decryptor = new seal.Decryptor(context, secKey)
})

describe('Encryptor', () => {
  test('It should keep serializable ciphertexts after deleting the encryptor', () => {
    const keyGen = new seal.KeyGenerator(context)
    const secretKey = keyGen.secretKey()
    const encryptor = new seal.Encryptor(
      context,
      keyGen.createPublicKey(),
      secretKey
    )
    const decryptor = new seal.Decryptor(context, secretKey)
    const data = new BigInt64Array(encoder.slotCount())
    data.set([2n, -3n, 4n])
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const pool = seal.MemoryPoolHandle.New(false)
    const ciphers = [
      encryptor.encryptSerializable(plain),
      encryptor.encryptSerializableWithPool(plain, pool),
      encryptor.encryptSymmetricSerializable(plain),
      encryptor.encryptSymmetricSerializableWithPool(plain, pool),
      encryptor.encryptZeroSerializable(),
      encryptor.encryptZeroSerializableWithPool(pool)
    ]
    encryptor.delete()
    const zero = new BigInt64Array(encoder.slotCount())

    for (let i = 0; i < ciphers.length; i++) {
      const cipher = new seal.Ciphertext()
      cipher.loadFromArray(
        context,
        ciphers[i].saveToArray(seal.ComprModeType.none)
      )
      decryptor.decrypt(cipher, plain)
      expect(encoder.decodeBigInt64(plain)).toEqual(i < 4 ? data : zero)
    }
  })
  test('It should encrypt with a replacement public key', () => {
    const keyGen = new seal.KeyGenerator(context)
    const keyGen2 = new seal.KeyGenerator(context)
    const encryptor = new seal.Encryptor(context, keyGen.createPublicKey())
    encryptor.setPublicKey(keyGen2.createPublicKey())
    const decryptor = new seal.Decryptor(context, keyGen2.secretKey())
    const arr = BigInt64Array.from([-3n, 0n, 2n])
    const plain = new seal.Plaintext()
    encoder.encode(arr, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    plain.setZero()
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded.slice(0, 3)).toEqual(arr)
  })
  test('It should encrypt with a replacement secret key', () => {
    const keyGen = new seal.KeyGenerator(context)
    const keyGen2 = new seal.KeyGenerator(context)
    const encryptor = new seal.Encryptor(
      context,
      keyGen.createPublicKey(),
      keyGen.secretKey()
    )
    encryptor.setSecretKey(keyGen2.secretKey())
    const decryptor = new seal.Decryptor(context, keyGen2.secretKey())
    const arr = BigInt64Array.from([-3n, 0n, 2n])
    const plain = new seal.Plaintext()
    encoder.encode(arr, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encryptSymmetric(plain, cipher)
    plain.setZero()
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded.slice(0, 3)).toEqual(arr)
  })
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
    const vec = cipher.saveToArray(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromArray(context, vec)
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
    const vec = cipher.saveToArray(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromArray(context, vec)
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
    const vec = cipher.saveToArray(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromArray(context, vec)
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
    const vec = cipher.saveToArray(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromArray(context, vec)
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
    const vec = cipher.saveToArray(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromArray(context, vec)
    const plain = new seal.Plaintext()
    decryptor.decrypt(cipher2, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
  test('Encrypt a zero, serialized cipher and decrypt with pool (bfv)', () => {
    const data = BigInt64Array.from({ length: encoder.slotCount() }, _ => 0n)
    const pool = seal.MemoryPoolHandle.Global()
    const cipher = encryptor.encryptZeroSerializableWithPool(pool)
    const vec = cipher.saveToArray(seal.ComprModeType.none) as BigInt64Array
    cipher.delete()
    const cipher2 = new seal.Ciphertext()
    cipher2.loadFromArray(context, vec)
    const plain = new seal.Plaintext()
    decryptor.decrypt(cipher2, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data)
  })
})

describe('Decryptor', () => {
  test('It should report the remaining noise budget after multiplication', () => {
    const plain = new seal.Plaintext()
    encoder.encode(BigInt64Array.from([2n, 3n, 4n]), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const noiseBudget = decryptor.invariantNoiseBudget(cipher)
    expect(noiseBudget).toBeGreaterThan(0)
    const evaluator = new seal.Evaluator(context)
    evaluator.multiplyPlainInplace(cipher, plain)
    const noiseBudget2 = decryptor.invariantNoiseBudget(cipher)
    expect(noiseBudget2).toBeGreaterThan(0)
    expect(noiseBudget2).toBeLessThan(noiseBudget)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded.slice(0, 3)).toEqual(BigInt64Array.from([4n, 9n, 16n]))
  })
})
