import SEAL from '../index_wasm_node'
import { SEALLibrary } from 'implementation/seal'
import { EncryptionParameters } from 'implementation/encryption-parameters'
let seal: SEALLibrary
let parms: EncryptionParameters
beforeAll(async () => {
  seal = await SEAL()
  parms = seal.EncryptionParameters(seal.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
  )
  parms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
})

describe('PlainModulus', () => {
  test('It should be a static instance', () => {
    expect(seal.PlainModulus).toBeDefined()
    expect(typeof seal.PlainModulus.constructor).toBe('function')
    expect(seal.PlainModulus).toBeInstanceOf(Object)
    expect(seal.PlainModulus.constructor).toBe(Object)
    expect(seal.PlainModulus.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    // Test properties
    expect(seal.PlainModulus).toHaveProperty('Batching')
    expect(seal.PlainModulus).toHaveProperty('BatchingVector')
  })

  test('It should a return a Modulus', () => {
    const spyOn = jest.spyOn(seal.PlainModulus, 'Batching')
    const modulus = seal.PlainModulus.Batching(4096, 20)
    expect(spyOn).toHaveBeenCalledWith(4096, 20)
    expect(modulus).toBeDefined()
    expect(typeof modulus.constructor).toBe('function')
    expect(modulus).toBeInstanceOf(Object)
    expect(modulus.constructor).toBe(Object)
    expect(modulus.constructor.name).toBe('Object')
    expect(modulus.instance.constructor.name).toBe('Modulus')
  })
  test('It should fail to return a Modulus', () => {
    const spyOn = jest.spyOn(seal.PlainModulus, 'Batching')
    expect(() => seal.PlainModulus.Batching(4095, 20)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, 20)
  })
  test('It should a create a Vector of Modulus', () => {
    const spyOn = jest.spyOn(seal.PlainModulus, 'BatchingVector')
    const vectModulus = seal.PlainModulus.BatchingVector(
      4096,
      Int32Array.from([20, 20, 20])
    )
    expect(spyOn).toHaveBeenCalledWith(4096, Int32Array.from([20, 20, 20]))
    expect(vectModulus).toBeDefined()
    expect(typeof vectModulus.constructor).toBe('function')
    expect(vectModulus).toBeInstanceOf(Object)
    expect(vectModulus.constructor.name).toBe('std$$vector$Modulus$')
  })
  test('It should fail to create a Vector of Modulus', () => {
    const spyOn = jest.spyOn(seal.PlainModulus, 'BatchingVector')
    expect(() =>
      seal.PlainModulus.BatchingVector(4095, Int32Array.from([20, 20, 20]))
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, Int32Array.from([20, 20, 20]))
  })
})
