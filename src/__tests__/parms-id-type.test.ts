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
})
