// import { Seal, getLibrary } from '../../target/wasm'
// import { Vector } from '../../components'

// let Morfix = null
// let VectorObject = null
// beforeAll(async () => {
//   Morfix = await Seal()
//   const lib = getLibrary()
//   VectorObject = Vector(lib)(Morfix)
// })

// describe('Vector', () => {
//   test('It should be a factory', () => {
//     expect(VectorObject).toBeDefined()
//     expect(typeof VectorObject.constructor).toBe('function')
//     expect(VectorObject).toBeInstanceOf(Object)
//     expect(VectorObject.constructor).toBe(Function)
//     expect(VectorObject.constructor.name).toBe('Function')
//   })
//   test('It should construct an instance', () => {
//     const Constructor = jest.fn(VectorObject)
//     Constructor()
//     expect(Constructor).toBeCalledWith()
//   })
//   test('It should construct an instance with of uint8', () => {
//     const Constructor = jest.fn(VectorObject)
//     Constructor(Uint8Array.from([0]))
//     expect(Constructor).toBeCalledWith(Uint8Array.from([0]))
//   })
//   test('It should construct an instance with of int32', () => {
//     const Constructor = jest.fn(VectorObject)
//     Constructor(Int32Array.from([0]))
//     expect(Constructor).toBeCalledWith(Int32Array.from([0]))
//   })
//   test('It should construct an instance with of uint32', () => {
//     const Constructor = jest.fn(VectorObject)
//     Constructor(Uint32Array.from([0]))
//     expect(Constructor).toBeCalledWith(Uint32Array.from([0]))
//   })
//   test('It should construct an instance with of float64', () => {
//     const Constructor = jest.fn(VectorObject)
//     Constructor(Float64Array.from([0]))
//     expect(Constructor).toBeCalledWith(Float64Array.from([0]))
//   })
//   test('It should fail to construct an instance', () => {
//     const Constructor = jest.fn(VectorObject)
//     expect(() => Constructor(BigInt64Array.from([0n]))).toThrow()
//     expect(Constructor).toBeCalledWith(BigInt64Array.from([0n]))
//   })
//   test('It should have properties', () => {
//     const item = VectorObject()
//     // Test properties
//     expect(item).toHaveProperty('instance')
//     expect(item).toHaveProperty('unsafeInject')
//     expect(item).toHaveProperty('delete')
//     expect(item).toHaveProperty('type')
//     expect(item).toHaveProperty('size')
//     expect(item).toHaveProperty('getValue')
//     expect(item).toHaveProperty('resize')
//     expect(item).toHaveProperty('toArray')
//   })
//   test('It should have an instance', () => {
//     const item = VectorObject()
//     expect(item.instance).toBeDefined()
//   })
//   test('It should inject', () => {
//     const item = VectorObject(Int32Array.from([3]))
//     const newItem = VectorObject(Int32Array.from([7]))
//     newItem.delete()
//     const spyOn = jest.spyOn(newItem, 'unsafeInject')
//     newItem.unsafeInject(item.instance)
//     expect(spyOn).toHaveBeenCalledWith(item.instance)
//     expect(newItem.getValue(0)).toBe(3)
//   })
//   test('It should delete the old instance and inject', () => {
//     const item = VectorObject(Int32Array.from([3]))
//     const newItem = VectorObject(Int32Array.from([7]))
//     const spyOn = jest.spyOn(newItem, 'unsafeInject')
//     newItem.unsafeInject(item.instance)
//     expect(spyOn).toHaveBeenCalledWith(item.instance)
//     expect(newItem.getValue(0)).toBe(3)
//   })
//   test("It should delete it's instance", () => {
//     const item = VectorObject(Int32Array.from([3]))
//     const spyOn = jest.spyOn(item, 'delete')
//     item.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(item.instance).toBeNull()
//     expect(() => item.getValue(0)).toThrow(TypeError)
//   })
//   test('It should skip deleting twice', () => {
//     const item = VectorObject(Int32Array.from([3]))
//     item.delete()
//     const spyOn = jest.spyOn(item, 'delete')
//     item.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(item.instance).toBeNull()
//     expect(() => item.getValue(0)).toThrow(TypeError)
//   })
//   test('It should return type Uint8Array', () => {
//     const item = VectorObject(Uint8Array.from([3]))
//     expect(item.type).toBe(Uint8Array)
//   })
//   test('It should return type Int32Array', () => {
//     const item = VectorObject(Int32Array.from([3]))
//     expect(item.type).toBe(Int32Array)
//   })
//   test('It should return type Uint32Array', () => {
//     const item = VectorObject(Uint32Array.from([3]))
//     expect(item.type).toBe(Uint32Array)
//   })
//   test('It should return type Float64Array', () => {
//     const item = VectorObject(Float64Array.from([3]))
//     expect(item.type).toBe(Float64Array)
//   })
//   test('It should return its size', () => {
//     const item = VectorObject(Int32Array.from([3]))
//     expect(typeof item.size).toBe('number')
//   })
//   test('It should return size 0', () => {
//     const item = VectorObject(Int32Array.from([]))
//     expect(item.size).toBe(0)
//   })
//   test('It should print a matrix', () => {
//     const item = VectorObject(
//       Int32Array.from(Array.from({ length: 4096 })).fill(5)
//     )
//     item.printMatrix = jest.fn()
//     item.printMatrix(2048)
//     expect(item.printMatrix).toHaveBeenCalledWith(2048)
//   })
//   test('It should print a vector', () => {
//     const item = VectorObject(
//       Int32Array.from(Array.from({ length: 4096 })).fill(5)
//     )
//     item.printMatrix = jest.fn()
//     item.printMatrix(4, 5)
//     expect(item.printMatrix).toHaveBeenCalledWith(4, 5)
//   })
//   test('It should get a value from a specified index', () => {
//     const item = VectorObject(
//       Int32Array.from(Array.from({ length: 4096 })).map((x, i) => i)
//     )
//     const spyOn = jest.spyOn(item, 'getValue')
//     const value = item.getValue(5)
//     expect(spyOn).toHaveBeenCalledWith(5)
//     expect(value).toBe(5)
//   })
//   test('It should resize to a specified number', () => {
//     const item = VectorObject(
//       Int32Array.from(Array.from({ length: 4096 })).fill(3)
//     )
//     const spyOn = jest.spyOn(item, 'resize')
//     item.resize(8192, 3)
//     expect(spyOn).toHaveBeenCalledWith(8192, 3)
//   })
//   test('It should fail to resize to a specified number', () => {
//     const item = VectorObject(
//       Int32Array.from(Array.from({ length: 4096 })).fill(3)
//     )
//     const spyOn = jest.spyOn(item, 'resize')
//     expect(() => item.resize(-1, 3)).toThrow()
//     expect(spyOn).toHaveBeenCalledWith(-1, 3)
//   })
//   test('It should return a Uint8Array', () => {
//     const arr = Uint8Array.from(Array.from({ length: 4096 })).fill(3)
//     const item = VectorObject(arr)
//     const spyOn = jest.spyOn(item, 'toArray')
//     const res = item.toArray()
//     expect(spyOn).toHaveBeenCalledWith()
//     expect(res).toEqual(arr)
//   })
//   test('It should return an Int32Array', () => {
//     const arr = Int32Array.from(Array.from({ length: 4096 })).fill(-3)
//     const item = VectorObject(arr)
//     const spyOn = jest.spyOn(item, 'toArray')
//     const res = item.toArray()
//     expect(spyOn).toHaveBeenCalledWith()
//     expect(res).toEqual(arr)
//   })
//   test('It should return an Uint32Array', () => {
//     const arr = Uint32Array.from(Array.from({ length: 4096 })).fill(3)
//     const item = VectorObject(arr)
//     const spyOn = jest.spyOn(item, 'toArray')
//     const res = item.toArray()
//     expect(spyOn).toHaveBeenCalledWith()
//     expect(res).toEqual(arr)
//   })
//   test('It should return an Float64Array', () => {
//     const arr = Float64Array.from(Array.from({ length: 4096 })).fill(3.3)
//     const item = VectorObject(arr)
//     const spyOn = jest.spyOn(item, 'toArray')
//     const res = item.toArray()
//     expect(spyOn).toHaveBeenCalledWith()
//     expect(res).toEqual(arr)
//   })
// })
