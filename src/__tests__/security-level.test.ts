import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('SecurityLevel', () => {
  test('SecLevelType binding exists and has expected values', async () => {
    expect(seal.SecLevelType.none.value).toBe(0)
    expect(seal.SecLevelType.tc128.value).toBe(128)
    expect(seal.SecLevelType.tc192.value).toBe(192)
    expect(seal.SecLevelType.tc256.value).toBe(256)
  })
})
