import { beforeAll, describe, expect, test } from 'vitest'
import MainModuleFactory, { type MainModule } from '../index_throws'

let seal: MainModule

beforeAll(async () => {
  seal = await MainModuleFactory()
})

describe('CompressionModeType', () => {
  test('ComprModeType binding exists and has expected values', async () => {
    expect(seal.ComprModeType.none.value).toBe(0)
    expect(seal.ComprModeType.zlib.value).toBe(1)
    expect(seal.ComprModeType.zstd.value).toBe(2)
  })
})
