import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from '../implementation/seal'
import { SealError } from '../implementation/exception'

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
  test('It should attempt to get a safe error from an error instance', () => {
    const spyOn = jest.spyOn(seal.Exception, 'safe')
    const err = new Error('test error')
    seal.Exception.safe(err as SealError)
    expect(spyOn).toHaveBeenCalledWith(err)
  })
  test('It should attempt to get a safe error from a string', () => {
    const spyOn = jest.spyOn(seal.Exception, 'safe')
    seal.Exception.safe('unknown error')
    expect(spyOn).toHaveBeenCalledWith('unknown error')
  })
  test('It should attempt to get a safe error from a "falsy" value', () => {
    const spyOn = jest.spyOn(seal.Exception, 'safe')
    seal.Exception.safe('')
    expect(spyOn).toHaveBeenCalledWith('')
  })
})
