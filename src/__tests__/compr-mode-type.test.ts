import SEAL from '../throws_wasm_node'
import { SEALLibrary } from 'implementation/seal'
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
    expect(seal.ComprModeType).toHaveProperty('deflate')
  })
  test('It should return type none', async () => {
    const comprMode = seal.ComprModeType.none
    expect(comprMode).toBeDefined()
    expect(typeof comprMode.constructor).toBe('function')
    expect(comprMode).toBeInstanceOf(Object)
    expect(comprMode.constructor).toBe(seal.ComprModeType.none.constructor)
    expect(seal.ComprModeType.none.constructor.name).toBe('ComprModeType_none')
  })
  test('It should return type deflate', async () => {
    const comprMode = seal.ComprModeType.deflate
    expect(comprMode).toBeDefined()
    expect(typeof comprMode.constructor).toBe('function')
    expect(comprMode).toBeInstanceOf(Object)
    expect(comprMode.constructor).toBe(seal.ComprModeType.deflate.constructor)
    expect(seal.ComprModeType.deflate.constructor.name).toBe(
      'ComprModeType_deflate'
    )
  })
})
