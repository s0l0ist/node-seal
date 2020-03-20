import { Seal } from '../../index.js'

let Morfix = null
beforeAll(async () => {
  Morfix = await Seal
})

describe('MemoryPoolHandle', () => {
  test('It should be a static instance', () => {
    expect(Morfix).toHaveProperty('MemoryPoolHandle')
    expect(Morfix.MemoryPoolHandle).toBeDefined()
    expect(typeof Morfix.MemoryPoolHandle.constructor).toBe('function')
    expect(Morfix.MemoryPoolHandle).toBeInstanceOf(Object)
    expect(Morfix.MemoryPoolHandle.constructor).toBe(Object)
    expect(Morfix.MemoryPoolHandle.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(Morfix.MemoryPoolHandle).toHaveProperty('global')
    expect(Morfix.MemoryPoolHandle).toHaveProperty('threadLocal')
  })
  test('It should return a pointer to the global handle', () => {
    const pool = Morfix.MemoryPoolHandle.global
    expect(pool).toBeDefined()
    expect(typeof pool.constructor).toBe('function')
    expect(pool).toBeInstanceOf(Object)
    expect(pool.constructor).toBe(Morfix.MemoryPoolHandle.global.constructor)
    expect(Morfix.MemoryPoolHandle.global.constructor.name).toBe(
      'MemoryPoolHandle'
    )
  })
  test('It should return a pointer to a threadLocal handle', () => {
    const pool = Morfix.MemoryPoolHandle.threadLocal
    expect(pool).toBeDefined()
    expect(typeof pool.constructor).toBe('function')
    expect(pool).toBeInstanceOf(Object)
    expect(pool.constructor).toBe(
      Morfix.MemoryPoolHandle.threadLocal.constructor
    )
    expect(Morfix.MemoryPoolHandle.threadLocal.constructor.name).toBe(
      'MemoryPoolHandle'
    )
  })
})
