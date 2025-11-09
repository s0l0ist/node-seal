import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type BatchEncoder,
  type Decryptor,
  type EncryptionParameters,
  type Encryptor,
  type Evaluator,
  type KeyGenerator,
  type MainModule,
  type SEALContext
} from '../index_allows'

let seal: MainModule
let encParms: EncryptionParameters
let context: SEALContext
let keygen: KeyGenerator
let encryptor: Encryptor
let evaluator: Evaluator
let decryptor: Decryptor
let encoder: BatchEncoder

beforeAll(async () => {
  seal = await MainModuleFactory()

  const scheme = seal.SchemeType.bfv
  const polyModulusDegree = 1024
  const sec = seal.SecLevelType.tc128

  const coeffModulus = seal.CoeffModulus.Create(
    polyModulusDegree,
    Int32Array.from([27])
  )
  const plainModulus = seal.PlainModulus.Batching(polyModulusDegree, 20)

  encParms = new seal.EncryptionParameters(scheme)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(coeffModulus)
  encParms.setPlainModulus(plainModulus)

  context = new seal.SEALContext(encParms, true, sec)

  keygen = new seal.KeyGenerator(context)
  const pub = keygen.createPublicKey()
  const secKey = keygen.secretKey()

  encryptor = new seal.Encryptor(context, pub)
  evaluator = new seal.Evaluator(context)
  decryptor = new seal.Decryptor(context, secKey)
  encoder = new seal.BatchEncoder(context)
})

describe('Ciphertext (allows)', () => {
  test('It allows transparent ciphertext and decrypts to zeros', () => {
    const ct = new seal.Ciphertext()
    encryptor.encryptZero(ct)

    evaluator.subInplace(ct, ct)
    const plain = new seal.Plaintext()
    decryptor.decrypt(ct, plain)

    const arr = encoder.decodeBigUint64(plain) as BigUint64Array
    expect(arr).toEqual(
      BigUint64Array.from({ length: encoder.slotCount() }, _ => BigInt(0))
    )
  })
})
