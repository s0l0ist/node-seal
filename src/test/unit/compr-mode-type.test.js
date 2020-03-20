import { Seal } from '../../index.js'

let Morfix = null
beforeAll(async () => {
  Morfix = await Seal
})

describe('ComprModeType', () => {
  test('It should be a static instance', () => {
    expect(Morfix).toHaveProperty('ComprModeType')
    expect(Morfix.ComprModeType).toBeDefined()
    expect(typeof Morfix.ComprModeType.constructor).toBe('function')
    expect(Morfix.ComprModeType).toBeInstanceOf(Object)
    expect(Morfix.ComprModeType.constructor).toBe(Object)
    expect(Morfix.ComprModeType.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(Morfix.ComprModeType).toHaveProperty('none')
    expect(Morfix.ComprModeType).toHaveProperty('deflate')
  })
  test('It should return type none', async () => {
    const comprMode = Morfix.ComprModeType.none
    expect(comprMode).toBeDefined()
    expect(typeof comprMode.constructor).toBe('function')
    expect(comprMode).toBeInstanceOf(Object)
    expect(comprMode.constructor).toBe(Morfix.ComprModeType.none.constructor)
    expect(Morfix.ComprModeType.none.constructor.name).toBe(
      'ComprModeType_none'
    )
  })
  test('It should return type deflate', async () => {
    const comprMode = Morfix.ComprModeType.deflate
    expect(comprMode).toBeDefined()
    expect(typeof comprMode.constructor).toBe('function')
    expect(comprMode).toBeInstanceOf(Object)
    expect(comprMode.constructor).toBe(Morfix.ComprModeType.deflate.constructor)
    expect(Morfix.ComprModeType.deflate.constructor.name).toBe(
      'ComprModeType_deflate'
    )
  })
})
