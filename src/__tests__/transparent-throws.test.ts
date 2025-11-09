import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, {
  type Encryptor,
  type Evaluator,
  type MainModule
} from '../index_throws'

let seal: MainModule
let encryptor: Encryptor
let evaluator: Evaluator

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

  const encParms = new seal.EncryptionParameters(scheme)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(coeffModulus)
  encParms.setPlainModulus(plainModulus)

  const context = new seal.SEALContext(encParms, true, sec)
  const keygen = new seal.KeyGenerator(context)
  encryptor = new seal.Encryptor(context, keygen.createPublicKey())
  evaluator = new seal.Evaluator(context)
})

describe('Ciphertext', () => {
  test('It throws on transparent ciphertext', () => {
    const ct = new seal.Ciphertext()
    encryptor.encryptZero(ct)

    try {
      evaluator.subInplace(ct, ct)
      expect(true).toBe(false)
    } catch (e: any) {
      expect(e.constructor.name).toBe('Exception')
      expect(e.message).toEqual([
        'std::logic_error',
        'result ciphertext is transparent'
      ])
    }
  })
})
