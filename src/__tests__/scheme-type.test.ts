import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('SchemeType', () => {
  test('SchemeType binding exists and has expected values', async () => {
    expect(seal.SchemeType.none.value).toBe(0)
    expect(seal.SchemeType.bfv.value).toBe(1)
    expect(seal.SchemeType.ckks.value).toBe(2)
    expect(seal.SchemeType.bgv.value).toBe(3)
  })
})
