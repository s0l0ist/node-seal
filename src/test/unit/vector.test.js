import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { Vector } from '../../components'

let Morfix = null
let VectorObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  VectorObject = Vector(lib)(Morfix)
})

describe('Vector', () => {
  test('It should be a factory', () => {
    expect(VectorObject).toBeDefined()
    expect(typeof VectorObject.constructor).toBe('function')
    expect(VectorObject).toBeInstanceOf(Object)
    expect(VectorObject.constructor).toBe(Function)
    expect(VectorObject.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = VectorObject()
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('type')
    expect(item).toHaveProperty('size')
    expect(item).toHaveProperty('printMatrix')
    expect(item).toHaveProperty('printVector')
    expect(item).toHaveProperty('fromArray')
    expect(item).toHaveProperty('getValue')
    expect(item).toHaveProperty('resize')
    expect(item).toHaveProperty('toArray')
  })
  test('It should have an instance', () => {
    const item = VectorObject()
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = VectorObject(Int32Array.from([3]))
    const newItem = VectorObject(Int32Array.from([7]))
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.getValue(0)).toBe(3)
  })
  test("It should delete it's instance", () => {
    const item = VectorObject(Int32Array.from([3]))
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.getValue(0)).toThrow(TypeError)
  })
  test('It should return type Int32Array', () => {
    const item = VectorObject(Int32Array.from([3]))
    expect(item.type).toBe(Int32Array)
  })
  test('It should return type Uint32Array', () => {
    const item = VectorObject(Uint32Array.from([3]))
    expect(item.type).toBe(Uint32Array)
  })
  test('It should return type Float64Array', () => {
    const item = VectorObject(Float64Array.from([3]))
    expect(item.type).toBe(Float64Array)
  })
  test('It should return its size', () => {
    const item = VectorObject(Int32Array.from([3]))
    expect(typeof item.size).toBe('number')
  })
  test('It should return size 0', () => {
    const item = VectorObject(Int32Array.from([]))
    expect(item.size).toBe(0)
  })
  test('It should print a matrix', () => {
    const item = VectorObject(
      Int32Array.from(Array.from({ length: 4096 })).fill(5)
    )
    item.printMatrix = jest.fn()
    item.printMatrix(2048)
    expect(item.printMatrix).toHaveBeenCalledWith(2048)
  })
  test('It should print a vector', () => {
    const item = VectorObject(
      Int32Array.from(Array.from({ length: 4096 })).fill(5)
    )
    item.printMatrix = jest.fn()
    item.printMatrix(4, 5)
    expect(item.printMatrix).toHaveBeenCalledWith(4, 5)
  })
  test('It should create an instance from an array', () => {
    const array1 = Array.from({ length: 4096 }).fill(5)
    const array2 = Array.from({ length: 4096 }).fill(6)
    const intArr1 = Int32Array.from(array1)
    const intArr2 = Int32Array.from(array2)
    const item = VectorObject(intArr1)
    const instance = item.fromArray(intArr2)
    expect(instance).toBeDefined()
    item.unsafeInject(instance)
    expect(item.toArray()).toEqual(intArr2)
  })
  test('It should get a value from a specified index', () => {
    const item = VectorObject(
      Int32Array.from(Array.from({ length: 4096 })).map((x, i) => i)
    )
    const spyOn = jest.spyOn(item, 'getValue')
    const value = item.getValue(5)
    expect(spyOn).toHaveBeenCalledWith(5)
    expect(value).toBe(5)
  })
  test('It should resize to a specified number', () => {
    const item = VectorObject(
      Int32Array.from(Array.from({ length: 4096 })).fill(3)
    )
    const spyOn = jest.spyOn(item, 'resize')
    item.resize(8192, 3)
    expect(spyOn).toHaveBeenCalledWith(8192, 3)
    expect(item.toArray()).toEqual(
      Int32Array.from(Array.from({ length: 8192 })).fill(3)
    )
  })
  test('It should return an Int32Array', () => {
    const arr = Int32Array.from(Array.from({ length: 4096 })).fill(-3)
    const item = VectorObject(arr)
    const spyOn = jest.spyOn(item, 'toArray')
    const res = item.toArray()
    expect(spyOn).toHaveBeenCalledWith()
    expect(res).toEqual(arr)
  })
  test('It should return an Uint32Array', () => {
    const arr = Uint32Array.from(Array.from({ length: 4096 })).fill(3)
    const item = VectorObject(arr)
    const spyOn = jest.spyOn(item, 'toArray')
    const res = item.toArray()
    expect(spyOn).toHaveBeenCalledWith()
    expect(res).toEqual(arr)
  })
  test('It should return an Float64Array', () => {
    const arr = Float64Array.from(Array.from({ length: 4096 })).fill(3.3)
    const item = VectorObject(arr)
    const spyOn = jest.spyOn(item, 'toArray')
    const res = item.toArray()
    expect(spyOn).toHaveBeenCalledWith()
    expect(res).toEqual(arr)
  })

  test('It should construct from no args', () => {
    const constructor = jest.fn(VectorObject)
    const item = constructor()
    expect(constructor).toHaveBeenCalledWith()
    expect(item).toBeDefined()
    expect(typeof item.constructor).toBe('function')
    expect(item).toBeInstanceOf(Object)
    expect(item.constructor).toBe(Object)
    expect(item.instance.constructor.name).toBe('std$$vector$int32_t$')
    expect(item.toArray()).toEqual(new Int32Array(0))
  })

  test('It should construct from an Int32Array', () => {
    const arr = Int32Array.from(Array.from({ length: 4096 })).fill(-3)
    const constructor = jest.fn(VectorObject)
    const item = constructor(arr)
    expect(constructor).toHaveBeenCalledWith(arr)
    expect(item).toBeDefined()
    expect(typeof item.constructor).toBe('function')
    expect(item).toBeInstanceOf(Object)
    expect(item.constructor).toBe(Object)
    expect(item.instance.constructor.name).toBe('std$$vector$int32_t$')
    expect(item.toArray()).toEqual(arr)
  })
  test('It should construct from an Uint32Array', () => {
    const arr = Uint32Array.from(Array.from({ length: 4096 })).fill(3)
    const constructor = jest.fn(VectorObject)
    const item = constructor(arr)
    expect(constructor).toHaveBeenCalledWith(arr)
    expect(item).toBeDefined()
    expect(typeof item.constructor).toBe('function')
    expect(item).toBeInstanceOf(Object)
    expect(item.constructor).toBe(Object)
    expect(item.instance.constructor.name).toBe('std$$vector$uint32_t$')
    expect(item.toArray()).toEqual(arr)
  })
  test('It should construct from an Float64Array', () => {
    const arr = Float64Array.from(Array.from({ length: 4096 })).fill(3.3)
    const constructor = jest.fn(VectorObject)
    const item = constructor(arr)
    expect(constructor).toHaveBeenCalledWith(arr)
    expect(item).toBeDefined()
    expect(typeof item.constructor).toBe('function')
    expect(item).toBeInstanceOf(Object)
    expect(item.constructor).toBe(Object)
    expect(item.instance.constructor.name).toBe('std$$vector$double$')
    expect(item.toArray()).toEqual(arr)
  })
})
