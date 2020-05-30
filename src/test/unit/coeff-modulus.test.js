import { Seal, getLibrary } from '../../target/wasm/main'
import { CoeffModulus } from '../../components'

let Morfix = null
let CoeffModulusObject = null
beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  CoeffModulusObject = CoeffModulus(lib)(Morfix)
})

describe('CoeffModulus', () => {
  test('It should be a static instance', () => {
    expect(CoeffModulusObject).toBeDefined()
    expect(typeof CoeffModulusObject.constructor).toBe('function')
    expect(CoeffModulusObject).toBeInstanceOf(Object)
    expect(CoeffModulusObject.constructor).toBe(Object)
    expect(CoeffModulusObject.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    // Test properties
    expect(CoeffModulusObject).toHaveProperty('MaxBitCount')
    expect(CoeffModulusObject).toHaveProperty('BFVDefault')
    expect(CoeffModulusObject).toHaveProperty('Create')
  })
  test('It should return a max bit count with default security level', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'MaxBitCount')
    const count = CoeffModulusObject.MaxBitCount(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(typeof count).toBe('number')
  })
  test('It should return a max bit count with a specified security level', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'MaxBitCount')
    const count = CoeffModulusObject.MaxBitCount(
      4096,
      Morfix.SecurityLevel.tc256
    )
    expect(spyOn).toHaveBeenCalledWith(4096, Morfix.SecurityLevel.tc256)
    expect(typeof count).toBe('number')
  })
  test('It should a return a default Vector of Modulus with a default security level', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'BFVDefault')
    const vect = CoeffModulusObject.BFVDefault(4096)
    expect(spyOn).toHaveBeenCalledWith(4096)
    expect(vect).toBeDefined()
    expect(typeof vect.constructor).toBe('function')
    expect(vect).toBeInstanceOf(Object)
    expect(vect.constructor.name).toBe('std$$vector$Modulus$')
  })
  test('It should a return a default Vector of Modulus with a specified security level', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'BFVDefault')
    const vect = CoeffModulusObject.BFVDefault(4096, Morfix.SecurityLevel.tc256)
    expect(spyOn).toHaveBeenCalledWith(4096, Morfix.SecurityLevel.tc256)
    expect(vect).toBeDefined()
    expect(typeof vect.constructor).toBe('function')
    expect(vect).toBeInstanceOf(Object)
    expect(vect.constructor.name).toBe('std$$vector$Modulus$')
  })
  test('It should fail to return a default Vector of Modulus', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'BFVDefault')
    expect(() =>
      CoeffModulusObject.BFVDefault(4095, Morfix.SecurityLevel.tc128)
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, Morfix.SecurityLevel.tc128)
  })
  test('It should a create a Vector of Modulus', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'Create')
    const vect = CoeffModulusObject.Create(4096, Int32Array.from([36, 36, 37]))
    expect(spyOn).toHaveBeenCalledWith(4096, Int32Array.from([36, 36, 37]))
    expect(vect).toBeDefined()
    expect(typeof vect.constructor).toBe('function')
    expect(vect).toBeInstanceOf(Object)
    expect(vect.constructor.name).toBe('std$$vector$Modulus$')
  })
  test('It should fail to create a Vector of Modulus', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'Create')
    expect(() => CoeffModulusObject.Create(4095, [36, 36, 37])).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, [36, 36, 37])
  })
  test('It should fail to create a Vector of Modulus', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'Create')
    expect(() =>
      CoeffModulusObject.Create(4095, Int32Array.from([36, 36, 37]))
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, Int32Array.from([36, 36, 37]))
  })
})
