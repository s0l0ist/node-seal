import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { CoeffModulus } from '../../components'

let Morfix = null
let CoeffModulusObject = null
beforeAll(async () => {
  Morfix = await Seal
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

  test('It should return a max bit count', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'MaxBitCount')
    const count = CoeffModulusObject.MaxBitCount(
      4096,
      Morfix.SecurityLevel.tc128
    )
    expect(spyOn).toHaveBeenCalledWith(4096, Morfix.SecurityLevel.tc128)
    expect(typeof count).toBe('number')
    expect(count).toBe(109)
  })
  test('It should a return a default Vector of SmallModulus', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'BFVDefault')
    const vect = CoeffModulusObject.BFVDefault(4096, Morfix.SecurityLevel.tc128)
    expect(spyOn).toHaveBeenCalledWith(4096, Morfix.SecurityLevel.tc128)
    expect(vect).toBeDefined()
    expect(typeof vect.constructor).toBe('function')
    expect(vect).toBeInstanceOf(Object)
    expect(vect.constructor.name).toBe('std$$vector$SmallModulus$')
    expect(vect.values()).toBe('68719403009,68719230977,137438822401')
  })
  test('It should a create a Vector of SmallModulus', () => {
    const spyOn = jest.spyOn(CoeffModulusObject, 'Create')
    const vect = CoeffModulusObject.Create(4096, Int32Array.from([36, 36, 37]))
    expect(spyOn).toHaveBeenCalledWith(4096, Int32Array.from([36, 36, 37]))
    expect(vect).toBeDefined()
    expect(typeof vect.constructor).toBe('function')
    expect(vect).toBeInstanceOf(Object)
    expect(vect.constructor.name).toBe('std$$vector$SmallModulus$')
    expect(vect.values()).toBe('68719230977,68719403009,137438822401')
  })
})
