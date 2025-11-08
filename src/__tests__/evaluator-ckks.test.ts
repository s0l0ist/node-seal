import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type CKKSEncoder,
  type Decryptor,
  type EncryptionParameters,
  type Encryptor,
  type Evaluator,
  type GaloisKeys,
  type MainModule,
  type RelinKeys,
  type SEALContext
} from '../index_throws'

let seal: MainModule
let encParms: EncryptionParameters
let context: SEALContext
let encoder: CKKSEncoder
let encryptor: Encryptor
let decryptor: Decryptor
let evaluator: Evaluator
let data: Float64Array
let relinKeys: RelinKeys
let galoisKeys: GaloisKeys

beforeAll(async () => {
  seal = await MainModuleFactory()
  const polyModulusDegree = 4096
  const securityLevel = seal.SecLevelType.tc128
  encParms = new seal.EncryptionParameters(seal.SchemeType.ckks)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(
    seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from([40, 16, 40]))
  )
  context = new seal.SEALContext(encParms, true, securityLevel)
  encoder = new seal.CKKSEncoder(context)
  data = Float64Array.from({ length: encoder.slotCount() }, _ => -5)
  const keyGen = new seal.KeyGenerator(context)
  const pubKey = keyGen.createPublicKey()
  const secKey = keyGen.secretKey()
  relinKeys = keyGen.createRelinKeys()
  galoisKeys = keyGen.createGaloisKeys()
  encryptor = new seal.Encryptor(context, pubKey, secKey)
  decryptor = new seal.Decryptor(context, secKey)
  evaluator = new seal.Evaluator(context)
})

describe('Evaluator', () => {
  // Negate
  test('It should negate a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.negate(cipher, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(-x))
    )
  })
  test('It should negate a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.negateInplace(cipher)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(-x))
    )
  })
  // add
  test('It should add a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.add(cipher1, cipher2, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x + x))
    )
  })
  test('It should add a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    evaluator.addInplace(cipher1, cipher2)
    decryptor.decrypt(cipher1, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x + x))
    )
  })
  test('It should add a plain', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const cipherDest = new seal.Ciphertext()
    evaluator.addPlain(cipher, plain, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x + x))
    )
  })
  test('It should add a plain with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const cipherDest = new seal.Ciphertext()
    evaluator.addPlainWithPool(
      cipher,
      plain,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x + x))
    )
  })
  test('It should add a plain inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.addPlainInplace(cipher, plain)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x + x))
    )
  })
  test('It should add a plain inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.addPlainInplaceWithPool(
      cipher,
      plain,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x + x))
    )
  })

  // Sub
  test('It should sub a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.sub(cipher1, cipher2, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x - x))
    )
  })
  test('It should sub a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    evaluator.subInplace(cipher1, cipher2)
    decryptor.decrypt(cipher1, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x - x))
    )
  })
  test('It should sub a plain', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const cipherDest = new seal.Ciphertext()
    evaluator.subPlain(cipher, plain, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x - x))
    )
  })
  test('It should sub a plain with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const cipherDest = new seal.Ciphertext()
    evaluator.subPlainWithPool(
      cipher,
      plain,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x - x))
    )
  })
  test('It should sub a plain inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.subPlainInplace(cipher, plain)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x - x))
    )
  })
  test('It should sub a plain inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.subPlainInplaceWithPool(
      cipher,
      plain,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x - x))
    )
  })

  // Multiply
  test('It should multiply a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.multiply(cipher1, cipher2, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.multiplyWithPool(
      cipher1,
      cipher2,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    evaluator.multiplyInplace(cipher1, cipher2)
    decryptor.decrypt(cipher1, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    evaluator.multiplyInplaceWithPool(
      cipher1,
      cipher2,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher1, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a plain', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const cipherDest = new seal.Ciphertext()
    evaluator.multiplyPlain(cipher, plain, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a plain with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const cipherDest = new seal.Ciphertext()
    evaluator.multiplyPlainWithPool(
      cipher,
      plain,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a plain inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.multiplyPlainInplace(cipher, plain)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x * x))
    )
  })
  test('It should multiply a plain inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.multiplyPlainInplaceWithPool(
      cipher,
      plain,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x * x))
    )
  })

  // Square
  test('It should square a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.square(cipher, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x ** 2))
    )
  })
  test('It should square a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.squareWithPool(cipher, cipherDest, seal.MemoryPoolHandle.Global())
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x ** 2))
    )
  })
  test('It should square a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.squareInplace(cipher)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x ** 2))
    )
  })
  test('It should square a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.squareInplaceWithPool(cipher, seal.MemoryPoolHandle.Global())
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x ** 2))
    )
  })

  // Relinearize
  test('It should relinearize a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.relinearize(cipher, relinKeys, cipherDest)
    expect(cipherDest.size()).toBe(2)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should relinearize a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.relinearizeWithPool(
      cipher,
      relinKeys,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipherDest.size()).toBe(2)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should relinearize a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.relinearizeInplace(cipher, relinKeys)
    expect(cipher.size()).toBe(2)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should relinearize a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.relinearizeInplaceWithPool(
      cipher,
      relinKeys,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipher.size()).toBe(2)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })

  // Cipher mod switch to next
  test('It should switch to the next modulus of a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.cipherModSwitchToNext(cipher, cipherDest)
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should switch to the next modulus of a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.cipherModSwitchToNextWithPool(
      cipher,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should switch to the next modulus of a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.cipherModSwitchToNextInplace(cipher)
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should switch to the next modulus of a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.cipherModSwitchToNextInplaceWithPool(
      cipher,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  // Cipher mod switch to
  test('It should switch to a modulus of a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.cipherModSwitchTo(cipher, context.lastParmsId(), cipherDest)
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should switch to a modulus of a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.cipherModSwitchToWithPool(
      cipher,
      context.lastParmsId(),
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should switch to a modulus of a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.cipherModSwitchToInplace(cipher, context.lastParmsId())
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should switch to a modulus of a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.cipherModSwitchToInplaceWithPool(
      cipher,
      context.lastParmsId(),
      seal.MemoryPoolHandle.Global()
    )
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })

  // Plain mod switch to next (ckks only)
  test('It should switch to the next modulus of a plaintext', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const plainDest = new seal.Plaintext()
    evaluator.plainModSwitchToNext(plain, plainDest)
    const decoded = encoder.decodeFloat64(plainDest) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should switch to the next modulus of a plaintext inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    evaluator.plainModSwitchToNextInplace(plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  // Plain mod switch to (ckks only)
  test('It should switch to a modulus of a plaintext', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const plainDest = new seal.Plaintext()
    evaluator.plainModSwitchTo(plain, context.lastParmsId(), plainDest)
    const decoded = encoder.decodeFloat64(plainDest) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should switch to a modulus of a plaintext inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    evaluator.plainModSwitchToInplace(plain, context.lastParmsId())
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })

  // Rescale to next (ckks only)
  test('It should rescale to next of a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 40), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rescaleToNext(cipher, cipherDest)
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescale to next of a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 40), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rescaleToNextWithPool(
      cipher,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescale to next of a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 40), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rescaleToNextInplace(cipher)
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescale to next of a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 40), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rescaleToNextInplaceWithPool(
      cipher,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  // Rescale to (ckks only)
  test('It should rescale to of a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 40), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rescaleTo(cipher, context.lastParmsId(), cipherDest)
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescale to of a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 40), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rescaleToWithPool(
      cipher,
      context.lastParmsId(),
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescale to of a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 40), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rescaleToInplace(cipher, context.lastParmsId())
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should rescale to of a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 40), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rescaleToInplaceWithPool(
      cipher,
      context.lastParmsId(),
      seal.MemoryPoolHandle.Global()
    )
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })

  // Mod reduce to next (ckks only)
  test('It should mod reduce to next of a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.modReduceToNext(cipher, cipherDest)
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should mod reduce to next of a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.modReduceToNextWithPool(
      cipher,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should mod reduce to next of a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.modReduceToNextInplace(cipher)
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should mod reduce to next of a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.modReduceToNextInplaceWithPool(
      cipher,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  // Mod reduce to (ckks only)
  test('It should mod reduce to of a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.modReduceTo(cipher, context.lastParmsId(), cipherDest)
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should mod reduce to of a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.modReduceToWithPool(
      cipher,
      context.lastParmsId(),
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should mod reduce to of a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.modReduceToInplace(cipher, context.lastParmsId())
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should mod reduce to of a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.modReduceToInplaceWithPool(
      cipher,
      context.lastParmsId(),
      seal.MemoryPoolHandle.Global()
    )
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })

  // Cipher transform to NTT (ckks only)
  test('It should transform a cipher to NTT form', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.cipherTransformFromNttInplace(cipher)
    evaluator.cipherTransformToNtt(cipher, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should transform a cipher to NTT form inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.cipherTransformFromNttInplace(cipher)
    evaluator.cipherTransformToNttInplace(cipher)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  // Cipher transform from NTT (ckks only)
  test('It should transform a cipher from NTT form', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.cipherTransformFromNtt(cipher, cipherDest)
    evaluator.cipherTransformToNttInplace(cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should transform a cipher from NTT form inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.cipherTransformFromNttInplace(cipher)
    evaluator.cipherTransformToNttInplace(cipher)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })

  // Apply Galois
  test('It should applyGalois on a cipher to a destination cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.applyGalois(
      cipher,
      2 * encParms.polyModulusDegree() - 1,
      galoisKeys,
      cipherDest
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should applyGalois on a cipher to a destination cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.applyGaloisWithPool(
      cipher,
      2 * encParms.polyModulusDegree() - 1,
      galoisKeys,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should applyGalois on a cipher to a destination cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.applyGaloisInplace(
      cipher,
      2 * encParms.polyModulusDegree() - 1,
      galoisKeys
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should applyGalois on a cipher to a destination cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.applyGaloisInplaceWithPool(
      cipher,
      2 * encParms.polyModulusDegree() - 1,
      galoisKeys,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })

  // Rotate Vector (ckks only)
  test('It should rotate a vector on a cipher to a destination cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rotateVector(cipher, 1, galoisKeys, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should rotate a vector on a cipher to a destination cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rotateVectorWithPool(
      cipher,
      1,
      galoisKeys,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should rotate a vector on a cipher to a destination cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rotateVectorInplace(cipher, 1, galoisKeys)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should rotate a vector on a cipher to a destination cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rotateVectorInplaceWithPool(
      cipher,
      1,
      galoisKeys,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })

  // Complex conjugate (ckks only)
  test('It should perform a complex conjugate on a cipher to a destination cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.complexConjugate(cipher, galoisKeys, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should perform a complex conjugate on a cipher to a destination cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.complexConjugateWithPool(
      cipher,
      galoisKeys,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should perform a complex conjugate on a cipher to a destination cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.complexConjugateInplace(cipher, galoisKeys)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
  test('It should perform a complex conjugate on a cipher to a destination cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, Math.pow(2, 20), plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.complexConjugateInplaceWithPool(
      cipher,
      galoisKeys,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeFloat64(plain) as Float64Array
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      data.map(x => 0 + Math.round(x))
    )
  })
})
