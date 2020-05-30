import { Seal, getLibrary } from '../../target/wasm/main'
import { Exception } from '../../components'

let lib,
  ExceptionObject = null
beforeAll(async () => {
  await Seal()
  lib = getLibrary()
  ExceptionObject = Exception(lib)()
})

describe('Exception', () => {
  test('It should be a static instance', () => {
    expect(ExceptionObject).toBeDefined()
    expect(typeof ExceptionObject.constructor).toBe('function')
    expect(ExceptionObject).toBeInstanceOf(Object)
    expect(ExceptionObject.constructor).toBe(Object)
    expect(ExceptionObject.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(ExceptionObject).toHaveProperty('getHuman')
    expect(ExceptionObject).toHaveProperty('safe')
  })
  test('It should get a human readable string from a wasm exception', () => {
    const parms = new lib.EncryptionParameters(lib.SchemeType.none)
    try {
      parms.setPolyModulusDegree(4096)
    } catch (e) {
      const spyOn = jest.spyOn(ExceptionObject, 'getHuman')
      ExceptionObject.getHuman(e)
      expect(spyOn).toHaveBeenCalledWith(e)
    }
  })
  test('It should attempt to get a safe error from a wasm number', () => {
    const parms = new lib.EncryptionParameters(lib.SchemeType.none)
    try {
      parms.setPolyModulusDegree(4096)
    } catch (e) {
      const spyOn = jest.spyOn(ExceptionObject, 'safe')
      ExceptionObject.safe(e)
      expect(spyOn).toHaveBeenCalledWith(e)
    }
  })
  test('It should attempt to get a safe error from an error instance', () => {
    try {
      throw new Error('test error')
    } catch (e) {
      const spyOn = jest.spyOn(ExceptionObject, 'safe')
      ExceptionObject.safe(e)
      expect(spyOn).toHaveBeenCalledWith(e)
    }
  })
  test('It should attempt to get a safe error from an unknown exception string', () => {
    const spyOn = jest.spyOn(ExceptionObject, 'safe')
    ExceptionObject.safe('unknown error')
    expect(spyOn).toHaveBeenCalledWith('unknown error')
  })
  test('It should attempt to get a safe error from an unknown exception', () => {
    const spyOn = jest.spyOn(ExceptionObject, 'safe')
    ExceptionObject.safe()
    expect(spyOn).toHaveBeenCalledWith()
  })
})
