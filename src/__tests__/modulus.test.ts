import SEAL from '../index_throws_wasm_node'
import { SEALLibrary } from 'implementation/seal'
let seal: SEALLibrary
beforeAll(async () => {
  seal = await SEAL()
})

describe('Modulus', () => {
  test('It should be a factory', () => {
    expect(seal.Modulus).toBeDefined()
    expect(typeof seal.Modulus.constructor).toBe('function')
    expect(seal.Modulus).toBeInstanceOf(Object)
    expect(seal.Modulus.constructor).toBe(Function)
    expect(seal.Modulus.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.Modulus)
    Constructor(BigInt('0'))
    expect(Constructor).toBeCalledWith(BigInt('0'))
  })
  test('It should construct an instance from a string', () => {
    const Constructor = jest.fn(seal.Modulus)
    Constructor(BigInt('2'))
    expect(Constructor).toBeCalledWith(BigInt('2'))
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(seal.Modulus)
    expect(() => Constructor(BigInt('1'))).toThrow()
    expect(Constructor).toBeCalledWith(BigInt('1'))
  })
  test('It should have properties', () => {
    const modulus = seal.Modulus(BigInt('5'))
    // Test properties
    expect(modulus).toHaveProperty('instance')
    expect(modulus).toHaveProperty('inject')
    expect(modulus).toHaveProperty('delete')
    expect(modulus).toHaveProperty('setValue')
    expect(modulus).toHaveProperty('value')
    expect(modulus).toHaveProperty('bitCount')
    expect(modulus).toHaveProperty('isZero')
    expect(modulus).toHaveProperty('isPrime')
    expect(modulus).toHaveProperty('save')
    expect(modulus).toHaveProperty('saveArray')
    expect(modulus).toHaveProperty('load')
    expect(modulus).toHaveProperty('loadArray')
  })
  test('It should have an instance', () => {
    const modulus = seal.Modulus(BigInt('4'))
    expect(modulus.instance).toBeDefined()
  })
  test('It should inject', () => {
    const modulus = seal.Modulus(BigInt('4'))
    const newModulus = seal.Modulus(BigInt('6'))
    newModulus.delete()
    const spyOn = jest.spyOn(newModulus, 'inject')
    newModulus.inject(modulus.instance)
    expect(spyOn).toHaveBeenCalledWith(modulus.instance)
  })
  test('It should delete the old instance and inject', () => {
    const modulus = seal.Modulus(BigInt('4'))
    const newModulus = seal.Modulus(BigInt('6'))
    const spyOn = jest.spyOn(newModulus, 'inject')
    newModulus.inject(modulus.instance)
    expect(spyOn).toHaveBeenCalledWith(modulus.instance)
  })
  test("It should delete it's instance", () => {
    const modulus = seal.Modulus(BigInt('6'))
    const spyOn = jest.spyOn(modulus, 'delete')
    modulus.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(modulus.instance).toBeUndefined()
    expect(() => modulus.value).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const modulus = seal.Modulus(BigInt('6'))
    modulus.delete()
    const spyOn = jest.spyOn(modulus, 'delete')
    modulus.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(modulus.instance).toBeUndefined()
  })
  test('It should set a value', () => {
    const modulus = seal.Modulus(BigInt('6'))
    const spyOn = jest.spyOn(modulus, 'setValue')
    modulus.setValue(BigInt('2'))
    expect(spyOn).toHaveBeenCalledWith(BigInt('2'))
    expect(modulus.value).toEqual(BigInt('2'))
  })
  test('It should fail to set a value', () => {
    const modulus = seal.Modulus(BigInt('2'))
    const spyOn = jest.spyOn(modulus, 'setValue')
    expect(() => modulus.setValue(BigInt('1'))).toThrow()
    expect(spyOn).toHaveBeenCalledWith(BigInt('1'))
  })
  test('It should have bitCount of 0', () => {
    const modulus = seal.Modulus(BigInt('0'))
    expect(modulus.bitCount).toBe(0)
  })
  test('It should have bitCount of 20', () => {
    const modulus = seal.Modulus(BigInt('786433'))
    expect(modulus.bitCount).toBe(20)
  })
  test('It should be zero', () => {
    const modulus = seal.Modulus(BigInt('0'))
    expect(modulus.isZero).toBe(true)
  })
  test('It should be non zero', () => {
    const modulus = seal.Modulus(BigInt('88'))
    expect(modulus.isZero).toBe(false)
  })
  test('It should be prime', () => {
    const modulus = seal.Modulus(BigInt('786433'))
    expect(modulus.isPrime).toBe(true)
  })
  test('It should be not prime', () => {
    const modulus = seal.Modulus(BigInt('786432'))
    expect(modulus.isPrime).toBe(false)
  })
  test('It should save to a string', () => {
    const modulus = seal.Modulus(BigInt('7'))
    expect(modulus.value).toBe(BigInt('7'))
    const spyOn = jest.spyOn(modulus, 'save')
    const str = modulus.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const modulus = seal.Modulus(BigInt('7'))
    expect(modulus.value).toBe(BigInt('7'))
    const spyOn = jest.spyOn(modulus, 'saveArray')
    const array = modulus.saveArray()
    expect(spyOn).toHaveBeenCalled()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const modulus = seal.Modulus(BigInt('7'))
    expect(modulus.value).toBe(BigInt('7'))
    const str = modulus.save()
    modulus.delete()
    const newModulus = seal.Modulus(BigInt('9'))
    const spyOn = jest.spyOn(newModulus, 'load')
    newModulus.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
    expect(newModulus.value).toEqual(BigInt('7'))
  })
  test('It should load from a typed array', () => {
    const modulus = seal.Modulus(BigInt('7'))
    expect(modulus.value).toBe(BigInt('7'))
    const array = modulus.saveArray()
    modulus.delete()
    const newModulus = seal.Modulus(BigInt('9'))
    const spyOn = jest.spyOn(newModulus, 'loadArray')
    newModulus.loadArray(array)
    expect(spyOn).toHaveBeenCalledWith(array)
    expect(newModulus.value).toEqual(BigInt('7'))
  })
  test('It should fail to load from a string', () => {
    const modulus = seal.Modulus(BigInt('0'))
    const spyOn = jest.spyOn(modulus, 'load')
    expect(() => modulus.load('XqEQAwUBAAAbAAAAAAAAAHicY2eAAAAAQAAA')).toThrow()
    expect(spyOn).toHaveBeenCalledWith('XqEQAwUBAAAbAAAAAAAAAHicY2eAAAAAQAAA')
  })
  test('It should fail to load from a typed array', () => {
    const modulus = seal.Modulus(BigInt('0'))
    const spyOn = jest.spyOn(modulus, 'loadArray')
    expect(() =>
      modulus.loadArray(
        Uint8Array.from([
          94,
          161,
          16,
          3,
          5,
          1,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          120,
          156,
          99,
          103,
          128,
          0,
          0,
          0,
          64,
          0,
          8
        ])
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      Uint8Array.from([
        94,
        161,
        16,
        3,
        5,
        1,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        120,
        156,
        99,
        103,
        128,
        0,
        0,
        0,
        64,
        0,
        8
      ])
    )
  })
})
