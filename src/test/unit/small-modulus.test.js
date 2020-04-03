import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { SmallModulus } from '../../components'

let Morfix = null
let SmallModulusObject = null
beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  SmallModulusObject = SmallModulus(lib)(Morfix)
})

describe('SmallModulus', () => {
  test('It should be a factory', () => {
    expect(SmallModulusObject).toBeDefined()
    expect(typeof SmallModulusObject.constructor).toBe('function')
    expect(SmallModulusObject).toBeInstanceOf(Object)
    expect(SmallModulusObject.constructor).toBe(Function)
    expect(SmallModulusObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(SmallModulusObject)
    Constructor()
    expect(Constructor).toBeCalledWith()
  })
  test('It should construct an instance from a string', () => {
    const Constructor = jest.fn(SmallModulusObject)
    Constructor('2')
    expect(Constructor).toBeCalledWith('2')
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(SmallModulusObject)
    expect(() => Constructor('1')).toThrow()
    expect(Constructor).toBeCalledWith('1')
  })
  test('It should have properties', () => {
    const smallModulus = SmallModulusObject()
    // Test properties
    expect(smallModulus).toHaveProperty('instance')
    expect(smallModulus).toHaveProperty('inject')
    expect(smallModulus).toHaveProperty('delete')
    expect(smallModulus).toHaveProperty('setValue')
    expect(smallModulus).toHaveProperty('value')
    expect(smallModulus).toHaveProperty('bitCount')
    expect(smallModulus).toHaveProperty('isZero')
    expect(smallModulus).toHaveProperty('isPrime')
    expect(smallModulus).toHaveProperty('save')
    expect(smallModulus).toHaveProperty('saveArray')
    expect(smallModulus).toHaveProperty('load')
    expect(smallModulus).toHaveProperty('loadArray')
  })
  test('It should have an instance', () => {
    const smallModulus = SmallModulusObject()
    expect(smallModulus.instance).toBeDefined()
  })
  test('It should inject', () => {
    const smallModulus = SmallModulusObject('4')
    const newSmallModulus = SmallModulusObject('6')
    newSmallModulus.delete()
    const spyOn = jest.spyOn(newSmallModulus, 'inject')
    newSmallModulus.inject(smallModulus.instance)
    expect(spyOn).toHaveBeenCalledWith(smallModulus.instance)
  })
  test('It should delete the old instance and inject', () => {
    const smallModulus = SmallModulusObject('4')
    const newSmallModulus = SmallModulusObject('6')
    const spyOn = jest.spyOn(newSmallModulus, 'inject')
    newSmallModulus.inject(smallModulus.instance)
    expect(spyOn).toHaveBeenCalledWith(smallModulus.instance)
  })
  test("It should delete it's instance", () => {
    const smallModulus = SmallModulusObject()
    const spyOn = jest.spyOn(smallModulus, 'delete')
    smallModulus.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(smallModulus.instance).toBeNull()
    expect(() => smallModulus.value).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const smallModulus = SmallModulusObject()
    smallModulus.delete()
    const spyOn = jest.spyOn(smallModulus, 'delete')
    smallModulus.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(smallModulus.instance).toBeNull()
  })
  test('It should set a value', () => {
    const smallModulus = SmallModulusObject()
    const spyOn = jest.spyOn(smallModulus, 'setValue')
    smallModulus.setValue('2')
    expect(spyOn).toHaveBeenCalledWith('2')
  })
  test('It should fail to set a value', () => {
    const smallModulus = SmallModulusObject()
    const spyOn = jest.spyOn(smallModulus, 'setValue')
    expect(() => smallModulus.setValue('1')).toThrow()
    expect(spyOn).toHaveBeenCalledWith('1')
  })
  test('It should have bitCount of 0', () => {
    const smallModulus = SmallModulusObject()
    expect(smallModulus.bitCount).toBe(0)
  })
  test('It should have bitCount of 20', () => {
    const smallModulus = SmallModulusObject('786433')
    expect(smallModulus.bitCount).toBe(20)
  })
  test('It should be zero', () => {
    const smallModulus = SmallModulusObject()
    expect(smallModulus.isZero).toBe(true)
  })
  test('It should be non zero', () => {
    const smallModulus = SmallModulusObject('2')
    expect(smallModulus.isZero).toBe(false)
  })
  test('It should be prime', () => {
    const smallModulus = SmallModulusObject('786433')
    expect(smallModulus.isPrime).toBe(true)
  })
  test('It should be not prime', () => {
    const smallModulus = SmallModulusObject('10')
    expect(smallModulus.isPrime).toBe(false)
  })
  test('It should save to a string', () => {
    const smallModulus = SmallModulusObject('7')
    expect(smallModulus.value).toBe(BigInt(7))
    const spyOn = jest.spyOn(smallModulus, 'save')
    const str = smallModulus.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const smallModulus = SmallModulusObject('7')
    expect(smallModulus.value).toBe(BigInt(7))
    const spyOn = jest.spyOn(smallModulus, 'saveArray')
    const array = smallModulus.saveArray()
    expect(spyOn).toHaveBeenCalled()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const smallModulus = SmallModulusObject('7')
    expect(smallModulus.value).toBe(BigInt(7))
    const str = smallModulus.save()
    smallModulus.delete()
    const newSmallModulus = SmallModulusObject()
    const spyOn = jest.spyOn(newSmallModulus, 'load')
    newSmallModulus.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
  })
  test('It should load from a typed array', () => {
    const smallModulus = SmallModulusObject('7')
    expect(smallModulus.value).toBe(BigInt(7))
    const array = smallModulus.saveArray()
    smallModulus.delete()
    const newSmallModulus = SmallModulusObject()
    const spyOn = jest.spyOn(newSmallModulus, 'loadArray')
    newSmallModulus.loadArray(array)
    expect(spyOn).toHaveBeenCalledWith(array)
  })
  test('It should fail to load from a string', () => {
    const smallModulus = SmallModulusObject()
    const spyOn = jest.spyOn(smallModulus, 'load')
    expect(() =>
      smallModulus.load('XqEAARsAAAAAAAAAAAAAAHicY2eAAAAAQAAA')
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith('XqEAARsAAAAAAAAAAAAAAHicY2eAAAAAQAAA')
  })
  test('It should fail to load from a typed array', () => {
    const smallModulus = SmallModulusObject()
    const spyOn = jest.spyOn(smallModulus, 'loadArray')
    expect(() =>
      smallModulus.loadArray(
        Uint8Array.from([
          93,
          161,
          0,
          1,
          27,
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
        93,
        161,
        0,
        1,
        27,
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
