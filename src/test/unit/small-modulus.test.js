import { Seal } from '../../index.js'

let Morfix = null
beforeAll(async () => {
  Morfix = await Seal
})

describe('SmallModulus', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('SmallModulus')
    expect(Morfix.SmallModulus).toBeDefined()
    expect(typeof Morfix.SmallModulus.constructor).toBe('function')
    expect(Morfix.SmallModulus).toBeInstanceOf(Object)
    expect(Morfix.SmallModulus.constructor).toBe(Function)
    expect(Morfix.SmallModulus.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.SmallModulus()
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('inject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('setValue')
    expect(item).toHaveProperty('value')
    expect(item).toHaveProperty('bitCount')
    expect(item).toHaveProperty('isZero')
    expect(item).toHaveProperty('isPrime')
    expect(item).toHaveProperty('save')
    expect(item).toHaveProperty('load')
  })
  test('It should have an instance', () => {
    const item = Morfix.SmallModulus()
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.SmallModulus('4')
    const newItem = Morfix.SmallModulus('6')
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = Morfix.SmallModulus('7')
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.value).toThrow(TypeError)
  })
  test('It should set a value', () => {
    const item = Morfix.SmallModulus()
    const spyOn = jest.spyOn(item, 'setValue')
    item.setValue('2')
    expect(spyOn).toHaveBeenCalledWith('2')
    expect(item.value).toBe(BigInt(2))
  })
  test('It should have bitCount of 0', () => {
    const item = Morfix.SmallModulus()
    const bitCount = item.bitCount
    expect(bitCount).toBe(0)
  })
  test('It should have bitCount of 20', () => {
    const item = Morfix.SmallModulus('786433')
    const bitCount = item.bitCount
    expect(bitCount).toBe(20)
  })
  test('It should be zero', () => {
    const item = Morfix.SmallModulus()
    expect(item.isZero).toBe(true)
  })
  test('It should be non zero', () => {
    const item = Morfix.SmallModulus('2')
    expect(item.isZero).toBe(false)
  })
  test('It should be prime', () => {
    const item = Morfix.SmallModulus('786433')
    expect(item.isPrime).toBe(true)
  })
  test('It should be not prime', () => {
    const item = Morfix.SmallModulus('10')
    expect(item.isPrime).toBe(false)
  })
  test('It should save to a string', () => {
    const item = Morfix.SmallModulus('7')
    expect(item.value).toBe(BigInt(7))
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should load from a string', () => {
    const item = Morfix.SmallModulus('7')
    expect(item.value).toBe(BigInt(7))
    const str = item.save()
    item.delete()
    const newItem = Morfix.SmallModulus()
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(str)
    expect(spyOn).toHaveBeenCalledWith(str)
    expect(newItem.value).toBe(BigInt(7))
  })
  test('It should construct from no args', () => {
    const spyOn = jest.spyOn(Morfix, 'SmallModulus')
    const item = Morfix.SmallModulus()
    expect(spyOn).toHaveBeenCalledWith()
    expect(item).toBeDefined()
    expect(typeof item.constructor).toBe('function')
    expect(item).toBeInstanceOf(Object)
    expect(item.constructor).toBe(Object)
    expect(item.instance.constructor.name).toBe('SmallModulus')
    expect(item.value).toBe(BigInt(0))
  })
  test('It should construct from a string', () => {
    const spyOn = jest.spyOn(Morfix, 'SmallModulus')
    const item = Morfix.SmallModulus('5')
    expect(spyOn).toHaveBeenCalledWith('5')
    expect(item).toBeDefined()
    expect(typeof item.constructor).toBe('function')
    expect(item).toBeInstanceOf(Object)
    expect(item.constructor).toBe(Object)
    expect(item.instance.constructor.name).toBe('SmallModulus')
    expect(item.value).toBe(BigInt(5))
  })
  test('It should construct from an instance', () => {
    const oldItem = Morfix.SmallModulus('8')
    const spyOn = jest.spyOn(Morfix, 'SmallModulus')
    const item = Morfix.SmallModulus(oldItem.instance)
    expect(spyOn).toHaveBeenCalledWith(oldItem.instance)
    expect(item).toBeDefined()
    expect(typeof item.constructor).toBe('function')
    expect(item).toBeInstanceOf(Object)
    expect(item.constructor).toBe(Object)
    expect(item.instance.constructor.name).toBe('SmallModulus')
    expect(item.value).toBe(BigInt(8))
  })
})
