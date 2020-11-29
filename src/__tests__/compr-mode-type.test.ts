import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from '../implementation/seal'
let seal: SEALLibrary
beforeAll(async () => {
  seal = await SEAL()
})

describe('ComprModeType', () => {
  test('It should be a static instance', () => {
    expect(seal.ComprModeType).toBeDefined()
    expect(typeof seal.ComprModeType.constructor).toBe('function')
    expect(seal.ComprModeType).toBeInstanceOf(Object)
    expect(seal.ComprModeType.constructor).toBe(Object)
    expect(seal.ComprModeType.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(seal.ComprModeType).toHaveProperty('none')
    expect(seal.ComprModeType).toHaveProperty('zlib')
    expect(seal.ComprModeType).toHaveProperty('zstd')
  })
  test('It should return type none', async () => {
    const comprMode = seal.ComprModeType.none
    expect(comprMode).toBeDefined()
    expect(typeof comprMode.constructor).toBe('function')
    expect(comprMode).toBeInstanceOf(Object)
    expect(comprMode.constructor).toBe(seal.ComprModeType.none.constructor)
    expect(seal.ComprModeType.none.constructor.name).toBe('ComprModeType_none')
  })
  test('It should return type zlib', async () => {
    const comprMode = seal.ComprModeType.zlib
    expect(comprMode).toBeDefined()
    expect(typeof comprMode.constructor).toBe('function')
    expect(comprMode).toBeInstanceOf(Object)
    expect(comprMode.constructor).toBe(seal.ComprModeType.zlib.constructor)
    expect(seal.ComprModeType.zlib.constructor.name).toBe('ComprModeType_zlib')
  })
  test('It should return type zstd', async () => {
    const comprMode = seal.ComprModeType.zstd
    expect(comprMode).toBeDefined()
    expect(typeof comprMode.constructor).toBe('function')
    expect(comprMode).toBeInstanceOf(Object)
    expect(comprMode.constructor).toBe(seal.ComprModeType.zstd.constructor)
    expect(seal.ComprModeType.zstd.constructor.name).toBe('ComprModeType_zstd')
  })
})
