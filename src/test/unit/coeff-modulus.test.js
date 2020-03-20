import { Seal } from '../../index.js'

let Morfix = null
beforeAll(async () => {
  Morfix = await Seal
})

describe('CoeffModulus', () => {
  test('It should be a static instance', () => {
    expect(Morfix).toHaveProperty('CoeffModulus')
    expect(Morfix.CoeffModulus).toBeDefined()
    expect(typeof Morfix.CoeffModulus.constructor).toBe('function')
    expect(Morfix.CoeffModulus).toBeInstanceOf(Object)
    expect(Morfix.CoeffModulus.constructor).toBe(Object)
    expect(Morfix.CoeffModulus.constructor.name).toBe('Object')
  })
  test('It should have properties', () => {
    // Test properties
    expect(Morfix.CoeffModulus).toHaveProperty('MaxBitCount')
    expect(Morfix.CoeffModulus).toHaveProperty('BFVDefault')
    expect(Morfix.CoeffModulus).toHaveProperty('Create')
  })

  test('It should return a max bit count', () => {
    const spyOn = jest.spyOn(Morfix.CoeffModulus, 'MaxBitCount')
    const count = Morfix.CoeffModulus.MaxBitCount(
      4096,
      Morfix.SecurityLevel.tc128
    )
    expect(spyOn).toHaveBeenCalledWith(4096, Morfix.SecurityLevel.tc128)
    expect(typeof count).toBe('number')
    expect(count).toBe(109)
  })
  test('It should a return a default Vector of SmallModulus', () => {
    const spyOn = jest.spyOn(Morfix.CoeffModulus, 'BFVDefault')
    const vect = Morfix.CoeffModulus.BFVDefault(
      4096,
      Morfix.SecurityLevel.tc128
    )
    expect(spyOn).toHaveBeenCalledWith(4096, Morfix.SecurityLevel.tc128)
    expect(vect).toBeDefined()
    expect(typeof vect.constructor).toBe('function')
    expect(vect).toBeInstanceOf(Object)
    expect(vect.constructor.name).toBe('std$$vector$SmallModulus$')
    expect(vect.values()).toBe('68719403009,68719230977,137438822401')
  })
  test('It should a create a Vector of SmallModulus', () => {
    const spyOn = jest.spyOn(Morfix.CoeffModulus, 'Create')
    const vect = Morfix.CoeffModulus.Create(4096, Int32Array.from([36, 36, 37]))
    expect(spyOn).toHaveBeenCalledWith(4096, Int32Array.from([36, 36, 37]))
    expect(vect).toBeDefined()
    expect(typeof vect.constructor).toBe('function')
    expect(vect).toBeInstanceOf(Object)
    expect(vect.constructor.name).toBe('std$$vector$SmallModulus$')
    expect(vect.values()).toBe('68719230977,68719403009,137438822401')
  })
})
