import SEAL from '../index_wasm_node'
import { SEALLibrary } from '../implementation/seal'
let seal: SEALLibrary
beforeAll(async () => {
  seal = await SEAL()
})

describe('CoeffModulus', () => {
  test('It should be a static instance', () => {
    expect(seal.CoeffModulus).toBeDefined()
    expect(typeof seal.CoeffModulus.constructor).toBe('function')
    expect(seal.CoeffModulus).toBeInstanceOf(Object)
    expect(seal.CoeffModulus.constructor).toBe(Object)
    expect(seal.CoeffModulus.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    // Test properties
    expect(seal.CoeffModulus).toHaveProperty('MaxBitCount')
    expect(seal.CoeffModulus).toHaveProperty('BFVDefault')
    expect(seal.CoeffModulus).toHaveProperty('Create')
  })
  test('It should return a max bit count with default security level', () => {
    const spyOn = jest.spyOn(seal.CoeffModulus, 'MaxBitCount')
    const count = seal.CoeffModulus.MaxBitCount(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(typeof count).toBe('number')
  })
  test('It should return a max bit count with a specified security level', () => {
    const spyOn = jest.spyOn(seal.CoeffModulus, 'MaxBitCount')
    const count = seal.CoeffModulus.MaxBitCount(4096, seal.SecurityLevel.tc256)
    expect(spyOn).toHaveBeenCalledWith(4096, seal.SecurityLevel.tc256)
    expect(typeof count).toBe('number')
  })
  test('It should a return a default Vector of Modulus with a default security level', () => {
    const spyOn = jest.spyOn(seal.CoeffModulus, 'BFVDefault')
    const vect = seal.CoeffModulus.BFVDefault(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(vect.instance).toBeDefined()
    const values = vect.toArray()
    expect(values).toEqual(
      BigUint64Array.from([
        BigInt('68719403009'),
        BigInt('68719230977'),
        BigInt('137438822401')
      ])
    )
  })
  test('It should a return a default Vector of Modulus with a specified security level', () => {
    const spyOn = jest.spyOn(seal.CoeffModulus, 'BFVDefault')
    const vect = seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc256)
    expect(spyOn).toHaveBeenCalledWith(4096, seal.SecurityLevel.tc256)
    expect(vect.instance).toBeDefined()
    const values = vect.toArray()
    expect(values).toEqual(BigUint64Array.from([BigInt('288230376135196673')]))
  })
  test('It should fail to return a default Vector of Modulus', () => {
    const spyOn = jest.spyOn(seal.CoeffModulus, 'BFVDefault')
    expect(() =>
      seal.CoeffModulus.BFVDefault(4095, seal.SecurityLevel.tc128)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, seal.SecurityLevel.tc128)
  })
  test('It should a create a Vector of Modulus', () => {
    const spyOn = jest.spyOn(seal.CoeffModulus, 'Create')
    const vect = seal.CoeffModulus.Create(4096, Int32Array.from([36, 36, 37]))
    expect(spyOn).toHaveBeenCalledWith(4096, Int32Array.from([36, 36, 37]))
    expect(vect.instance).toBeDefined()
    const values = vect.toArray()
    expect(values).toEqual(
      BigUint64Array.from([
        BigInt('68719230977'),
        BigInt('68719403009'),
        BigInt('137438822401')
      ])
    )
  })
  test('It should fail to create a Vector of Modulus', () => {
    const spyOn = jest.spyOn(seal.CoeffModulus, 'Create')
    expect(() => seal.CoeffModulus.Create(4095, [36, 36, 37] as any)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, [36, 36, 37])
  })
  test('It should fail to create a Vector of Modulus', () => {
    const spyOn = jest.spyOn(seal.CoeffModulus, 'Create')
    expect(() =>
      seal.CoeffModulus.Create(4095, Int32Array.from([36, 36, 37]))
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, Int32Array.from([36, 36, 37]))
  })
})
