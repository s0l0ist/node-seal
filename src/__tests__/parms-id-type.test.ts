import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('ParmsIdType', () => {
  test('It should return (empty) values', () => {
    const parmsId = new seal.ParmsIdType()
    const vec = parmsId.values() as BigUint64Array
    expect(vec).toEqual(BigUint64Array.from([0n, 0n, 0n, 0n]))
  })

  test('It should return values', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    const parmsId = encParms.parmsId()
    const vec = parmsId.values() as BigUint64Array
    expect(vec).toEqual(
      BigUint64Array.from([
        3233990958110595687n,
        6540418720804205283n,
        7565231121574662035n,
        6360663316903180079n
      ])
    )
  })

  test('It should return independent copies of values', () => {
    const encParms = new seal.EncryptionParameters(seal.SchemeType.bfv)
    const parmsId = encParms.parmsId()
    const vec = parmsId.values() as BigUint64Array
    const expected = vec.slice()
    vec.fill(0n)

    const vec2 = parmsId.values() as BigUint64Array
    expect(vec2).toEqual(expected)
    expect(vec2.buffer).not.toBe(vec.buffer)
    parmsId.delete()
    expect(vec2).toEqual(expected)
  })

  test('It should construct from an existing parmsId', () => {
    const plain = new seal.Plaintext()
    const parmsId = plain.parmsId()
    const copy = new seal.ParmsIdType(parmsId)
    expect(copy.values()).toEqual(parmsId.values())
    parmsId.delete()
    expect(copy.values()).toEqual(BigUint64Array.from([0n, 0n, 0n, 0n]))
  })
})
