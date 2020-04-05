import { Seal, getLibrary } from '../../target/wasm'
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

  test('It should a return a SmallModulus', () => {
    const spyOn = jest.spyOn(PlainModulusObject, 'Batching')
    const smallModulus = PlainModulusObject.Batching(4096, 20)
    expect(spyOn).toHaveBeenCalledWith(4096, 20)
    expect(smallModulus).toBeDefined()
    expect(typeof smallModulus.constructor).toBe('function')
    expect(smallModulus).toBeInstanceOf(Object)
    expect(smallModulus.constructor).toBe(Object)
    expect(smallModulus.constructor.name).toBe('Object')
    expect(smallModulus.instance.constructor.name).toBe('SmallModulus')
  })
  test('It should fail to return a SmallModulus', () => {
    const spyOn = jest.spyOn(PlainModulusObject, 'Batching')
    expect(() => PlainModulusObject.Batching(4095, 20)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, 20)
  })
  test('It should a create a Vector of SmallModulus', () => {
    const spyOn = jest.spyOn(PlainModulusObject, 'BatchingVector')
    const vectSmallModulus = PlainModulusObject.BatchingVector(
      4096,
      Int32Array.from([20, 20, 20])
    )
    expect(spyOn).toHaveBeenCalledWith(4096, Int32Array.from([20, 20, 20]))
    expect(vectSmallModulus).toBeDefined()
    expect(typeof vectSmallModulus.constructor).toBe('function')
    expect(vectSmallModulus).toBeInstanceOf(Object)
    expect(vectSmallModulus.constructor.name).toBe('std$$vector$SmallModulus$')
  })
  test('It should fail to create a Vector of SmallModulus', () => {
    const spyOn = jest.spyOn(PlainModulusObject, 'BatchingVector')
    expect(() =>
      PlainModulusObject.BatchingVector(4095, Int32Array.from([20, 20, 20]))
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(4095, Int32Array.from([20, 20, 20]))
  })
})
