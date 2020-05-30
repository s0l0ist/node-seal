import { Seal, getLibrary } from '../../target/wasm/main'
import { PlainModulus } from '../../components'

let Morfix = null
let PlainModulusObject = null

beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  PlainModulusObject = PlainModulus(lib)(Morfix)
})

describe('PlainModulus', () => {
  test('It should be a static instance', () => {
    expect(PlainModulusObject).toBeDefined()
    expect(typeof PlainModulusObject.constructor).toBe('function')
    expect(PlainModulusObject).toBeInstanceOf(Object)
    expect(PlainModulusObject.constructor).toBe(Object)
    expect(PlainModulusObject.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    // Test properties
    expect(PlainModulusObject).toHaveProperty('Batching')
    expect(PlainModulusObject).toHaveProperty('BatchingVector')
  })

  test('It should a return a Modulus', () => {
    const spyOn = jest.spyOn(PlainModulusObject, 'Batching')
    const modulus = PlainModulusObject.Batching(4096, 20)
    expect(spyOn).toHaveBeenCalledWith(4096, 20)
    expect(modulus).toBeDefined()
    expect(typeof modulus.constructor).toBe('function')
    expect(modulus).toBeInstanceOf(Object)
    expect(modulus.constructor).toBe(Object)
    expect(modulus.constructor.name).toBe('Object')
    expect(modulus.instance.constructor.name).toBe('Modulus')
  })
  test('It should fail to return a Modulus', () => {
    const spyOn = jest.spyOn(PlainModulusObject, 'Batching')
    expect(() => PlainModulusObject.Batching(4095, 20)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, 20)
  })
  test('It should a create a Vector of Modulus', () => {
    const spyOn = jest.spyOn(PlainModulusObject, 'BatchingVector')
    const vectModulus = PlainModulusObject.BatchingVector(
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
    const spyOn = jest.spyOn(PlainModulusObject, 'BatchingVector')
    expect(() =>
      PlainModulusObject.BatchingVector(4095, Int32Array.from([20, 20, 20]))
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, Int32Array.from([20, 20, 20]))
  })
})
