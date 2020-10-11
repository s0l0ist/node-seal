import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from 'implementation/seal'
let seal: SEALLibrary
beforeAll(async () => {
  seal = await SEAL()
})

describe('MemoryPoolHandle', () => {
  test('It should be a static instance', () => {
    expect(seal.MemoryPoolHandle).toBeDefined()
    expect(typeof seal.MemoryPoolHandle.constructor).toBe('function')
    expect(seal.MemoryPoolHandle).toBeInstanceOf(Object)
    expect(seal.MemoryPoolHandle.constructor).toBe(Object)
    expect(seal.MemoryPoolHandle.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(seal.MemoryPoolHandle).toHaveProperty('global')
    expect(seal.MemoryPoolHandle).toHaveProperty('threadLocal')
  })
  test('It should return a pointer to the global handle', () => {
    const pool = seal.MemoryPoolHandle.global
    expect(pool).toBeDefined()
    expect(typeof pool.constructor).toBe('function')
    expect(pool).toBeInstanceOf(Object)
    expect(pool.constructor).toBe(seal.MemoryPoolHandle.global.constructor)
    expect(seal.MemoryPoolHandle.global.constructor.name).toBe(
      'MemoryPoolHandle'
    )
  })
  test('It should return a pointer to a threadLocal handle', () => {
    const pool = seal.MemoryPoolHandle.threadLocal
    expect(pool).toBeDefined()
    expect(typeof pool.constructor).toBe('function')
    expect(pool).toBeInstanceOf(Object)
    expect(pool.constructor).toBe(seal.MemoryPoolHandle.threadLocal.constructor)
    expect(seal.MemoryPoolHandle.threadLocal.constructor.name).toBe(
      'MemoryPoolHandle'
    )
  })
})
