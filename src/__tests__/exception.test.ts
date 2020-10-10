import SEAL from '../index_wasm_node'
import { SEALLibrary } from 'implementation/seal'
let seal: SEALLibrary
beforeAll(async () => {
  seal = await SEAL()
})

describe('Exception', () => {
  test('It should be a static instance', () => {
    expect(seal.Exception).toBeDefined()
    expect(typeof seal.Exception.constructor).toBe('function')
    expect(seal.Exception).toBeInstanceOf(Object)
    expect(seal.Exception.constructor).toBe(Object)
    expect(seal.Exception.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    expect(seal.Exception).toHaveProperty('safe')
  })
  test('It should attempt to get a safe error from a wasm number', () => {
    const parms = seal.EncryptionParameters(seal.SchemeType.none)
    try {
      parms.setPolyModulusDegree(4096)
    } catch (e) {
      const spyOn = jest.spyOn(seal.Exception, 'safe')
      seal.Exception.safe(e)
      expect(spyOn).toHaveBeenCalledWith(e)
    }
  })
  test('It should attempt to get a safe error from an error instance', () => {
    try {
      throw new Error('test error')
    } catch (e) {
      const spyOn = jest.spyOn(seal.Exception, 'safe')
      seal.Exception.safe(e)
      expect(spyOn).toHaveBeenCalledWith(e)
    }
  })
  test('It should attempt to get a safe error from an unknown exception string', () => {
    const spyOn = jest.spyOn(seal.Exception, 'safe')
    seal.Exception.safe('unknown error')
    expect(spyOn).toHaveBeenCalledWith('unknown error')
  })
  //   test('It should attempt to get a safe error from an unknown exception', () => {
  //     const spyOn = jest.spyOn(seal.Exception, 'safe')
  //     seal.Exception.safe(55)
  //     expect(spyOn).toHaveBeenCalledWith()
  //   })
})
