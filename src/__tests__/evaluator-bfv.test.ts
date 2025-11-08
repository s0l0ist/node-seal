import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type BatchEncoder,
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
let encoder: BatchEncoder
let encryptor: Encryptor
let decryptor: Decryptor
let evaluator: Evaluator
let data: BigInt64Array
let relinKeys: RelinKeys
let galoisKeys: GaloisKeys

beforeAll(async () => {
  seal = await MainModuleFactory()
  const polyModulusDegree = 4096
  const securityLevel = seal.SecLevelType.tc128
  encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(polyModulusDegree, securityLevel)
  )
  encParms.setPlainModulus(seal.PlainModulus.Batching(polyModulusDegree, 20))
  context = new seal.SEALContext(encParms, true, securityLevel)
  encoder = new seal.BatchEncoder(context)
  data = BigInt64Array.from({ length: encoder.slotCount() }, _ => BigInt(-5))
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
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.negate(cipher, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => -x))
  })
  test('It should negate a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.negateInplace(cipher)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => -x))
  })
  // add
  test('It should add a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.add(cipher1, cipher2, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x + x))
  })
  test('It should add a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    evaluator.addInplace(cipher1, cipher2)
    decryptor.decrypt(cipher1, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x + x))
  })
  test('It should add a plain', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const cipherDest = new seal.Ciphertext()
    evaluator.addPlain(cipher, plain, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x + x))
  })
  test('It should add a plain with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x + x))
  })
  test('It should add a plain inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.addPlainInplace(cipher, plain)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x + x))
  })
  test('It should add a plain inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.addPlainInplaceWithPool(
      cipher,
      plain,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x + x))
  })

  // Sub
  test('It should sub a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.sub(cipher1, cipher2, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x - x))
  })
  test('It should sub a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    evaluator.subInplace(cipher1, cipher2)
    decryptor.decrypt(cipher1, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x - x))
  })
  test('It should sub a plain', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const cipherDest = new seal.Ciphertext()
    evaluator.subPlain(cipher, plain, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x - x))
  })
  test('It should sub a plain with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x - x))
  })
  test('It should sub a plain inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.subPlainInplace(cipher, plain)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x - x))
  })
  test('It should sub a plain inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.subPlainInplaceWithPool(
      cipher,
      plain,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x - x))
  })

  // Multiply
  test('It should multiply a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.multiply(cipher1, cipher2, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x * x))
  })
  test('It should multiply a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x * x))
  })
  test('It should multiply a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher1 = new seal.Ciphertext()
    const cipher2 = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher1)
    encryptor.encrypt(plain, cipher2)
    // Clear plaintext
    plain.setZero()
    evaluator.multiplyInplace(cipher1, cipher2)
    decryptor.decrypt(cipher1, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x * x))
  })
  test('It should multiply a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x * x))
  })
  test('It should multiply a plain', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    const cipherDest = new seal.Ciphertext()
    evaluator.multiplyPlain(cipher, plain, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x * x))
  })
  test('It should multiply a plain with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x * x))
  })
  test('It should multiply a plain inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.multiplyPlainInplace(cipher, plain)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x * x))
  })
  test('It should multiply a plain inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    evaluator.multiplyPlainInplaceWithPool(
      cipher,
      plain,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x * x))
  })

  // Square
  test('It should square a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.square(cipher, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x ** 2n))
  })
  test('It should square a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.squareWithPool(cipher, cipherDest, seal.MemoryPoolHandle.Global())
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x ** 2n))
  })
  test('It should square a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.squareInplace(cipher)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x ** 2n))
  })
  test('It should square a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.squareInplaceWithPool(cipher, seal.MemoryPoolHandle.Global())
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x ** 2n))
  })

  // Relinearize
  test('It should relinearize a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.relinearize(cipher, relinKeys, cipherDest)
    expect(cipherDest.size()).toBe(2)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should relinearize a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should relinearize a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.relinearizeInplace(cipher, relinKeys)
    expect(cipher.size()).toBe(2)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should relinearize a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })

  // Cipher mod switch to next
  test('It should switch to the next modulus of a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.cipherModSwitchToNext(cipher, cipherDest)
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should switch to the next modulus of a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should switch to the next modulus of a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.cipherModSwitchToNextInplace(cipher)
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should switch to the next modulus of a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  // Cipher mod switch to
  test('It should switch to a modulus of a cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.cipherModSwitchTo(cipher, context.lastParmsId(), cipherDest)
    expect(cipherDest.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should switch to a modulus of a cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should switch to a modulus of a cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.cipherModSwitchToInplace(cipher, context.lastParmsId())
    expect(cipher.coeffModulusSize()).toBe(1)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should switch to a modulus of a cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })

  // Exponentiate
  test('It should exponentiate cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.exponentiate(cipher, 2n, relinKeys, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x ** 2n))
  })
  test('It should exponentiate cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.exponentiateWithPool(
      cipher,
      2n,
      relinKeys,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x ** 2n))
  })
  test('It should exponentiate cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.exponentiateInplace(cipher, 2n, relinKeys)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x ** 2n))
  })
  test('It should exponentiate cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.exponentiateInplaceWithPool(
      cipher,
      2n,
      relinKeys,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x ** 2n))
  })

  // Apply Galois
  test('It should applyGalois on a cipher to a destination cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should applyGalois on a cipher to a destination cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should applyGalois on a cipher to a destination cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should applyGalois on a cipher to a destination cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
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
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })

  // Rotate rows (only bfv or bgv)
  test('It should rotate rows on a cipher to a destination cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rotateRows(
      cipher,
      encParms.polyModulusDegree() / 4,
      galoisKeys,
      cipherDest
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should rotate rows on a cipher to a destination cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rotateRowsWithPool(
      cipher,
      encParms.polyModulusDegree() / 4,
      galoisKeys,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should rotate rows on a cipher to a destination cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rotateRowsInplace(
      cipher,
      encParms.polyModulusDegree() / 4,
      galoisKeys
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should rotate rows on a cipher to a destination cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rotateRowsInplaceWithPool(
      cipher,
      encParms.polyModulusDegree() / 4,
      galoisKeys,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })

  // Rotate columns (only bfv or bgv)
  test('It should rotate columns on a cipher to a destination cipher', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rotateColumns(cipher, galoisKeys, cipherDest)
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should rotate columns on a cipher to a destination cipher with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    const cipherDest = new seal.Ciphertext()
    evaluator.rotateColumnsWithPool(
      cipher,
      galoisKeys,
      cipherDest,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipherDest, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should rotate columns on a cipher to a destination cipher inplace', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rotateColumnsInplace(cipher, galoisKeys)
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
  test('It should rotate columns on a cipher to a destination cipher inplace with pool', () => {
    const plain = new seal.Plaintext()
    encoder.encode(data, plain)
    const cipher = new seal.Ciphertext()
    encryptor.encrypt(plain, cipher)
    // Clear plaintext
    plain.setZero()
    evaluator.rotateColumnsInplaceWithPool(
      cipher,
      galoisKeys,
      seal.MemoryPoolHandle.Global()
    )
    decryptor.decrypt(cipher, plain)
    const decoded = encoder.decodeBigInt64(plain) as BigInt64Array
    expect(decoded).toEqual(data.map(x => x))
  })
})
