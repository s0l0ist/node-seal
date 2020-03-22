import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { ComprModeType } from '../../components'

let ComprModeTypeObject = null
beforeAll(async () => {
  await Seal
  const lib = getLibrary()
  ComprModeTypeObject = ComprModeType(lib)()
})

describe('ComprModeType', () => {
  test('It should be a static instance', () => {
    expect(ComprModeTypeObject).toBeDefined()
    expect(typeof ComprModeTypeObject.constructor).toBe('function')
    expect(ComprModeTypeObject).toBeInstanceOf(Object)
    expect(ComprModeTypeObject.constructor).toBe(Object)
    expect(ComprModeTypeObject.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(ComprModeTypeObject).toHaveProperty('none')
    expect(ComprModeTypeObject).toHaveProperty('deflate')
  })
  test('It should return type none', async () => {
    const comprMode = ComprModeTypeObject.none
    expect(comprMode).toBeDefined()
    expect(typeof comprMode.constructor).toBe('function')
    expect(comprMode).toBeInstanceOf(Object)
    expect(comprMode.constructor).toBe(ComprModeTypeObject.none.constructor)
    expect(ComprModeTypeObject.none.constructor.name).toBe('ComprModeType_none')
  })
  test('It should return type deflate', async () => {
    const comprMode = ComprModeTypeObject.deflate
    expect(comprMode).toBeDefined()
    expect(typeof comprMode.constructor).toBe('function')
    expect(comprMode).toBeInstanceOf(Object)
    expect(comprMode.constructor).toBe(ComprModeTypeObject.deflate.constructor)
    expect(ComprModeTypeObject.deflate.constructor.name).toBe(
      'ComprModeType_deflate'
    )
  })
})
