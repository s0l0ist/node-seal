// import { Seal, getLibrary } from '../../target/wasm'
// import { ParmsIdType } from '../../components'

// let seal = null
// let ParmsIdTypeObject = null
// beforeAll(async () => {
//   seal = await Seal()
//   const lib = getLibrary()
//   ParmsIdTypeObject = ParmsIdType(lib)(seal)
// })

// describe('ParmsIdType', () => {
//   test('It should be a factory', () => {
//     expect(ParmsIdTypeObject).toBeDefined()
//     expect(typeof ParmsIdTypeObject.constructor).toBe('function')
//     expect(ParmsIdTypeObject).toBeInstanceOf(Object)
//     expect(ParmsIdTypeObject.constructor).toBe(Function)
//     expect(ParmsIdTypeObject.constructor.name).toBe('Function')
//   })
//   test('It should construct an instance', () => {
//     const Constructor = jest.fn(ParmsIdTypeObject)
//     Constructor()
//     expect(Constructor).toBeCalledWith()
//   })
//   test('It should construct from an existing an instance', () => {
//     const parms = seal.EncryptionParameters(seal.SchemeType.BFV)
//     parms.setPolyModulusDegree(4096)
//     parms.setCoeffModulus(
//       seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
//     )
//     parms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
//     const context = seal.Context(parms, true, seal.SecurityLevel.tc128)
//     const parmsId = context.firstParmsId
//     const Constructor = jest.fn(ParmsIdTypeObject)
//     Constructor(parmsId.instance)
//     expect(Constructor).toBeCalledWith(parmsId.instance)
//   })
//   test('It should have properties', () => {
//     const parmsId = ParmsIdTypeObject()
//     // Test properties
//     expect(parmsId).toHaveProperty('instance')
//     expect(parmsId).toHaveProperty('inject')
//     expect(parmsId).toHaveProperty('delete')
//     expect(parmsId).toHaveProperty('values')
//   })
//   test('It should have an instance', () => {
//     const parmsId = ParmsIdTypeObject()
//     expect(parmsId.instance).toBeDefined()
//   })
//   test('It should inject', () => {
//     const parmsId = ParmsIdTypeObject()
//     const newParmsId = ParmsIdTypeObject()
//     newParmsId.delete()
//     const spyOn = jest.spyOn(newParmsId, 'inject')
//     newParmsId.inject(parmsId.instance)
//     expect(spyOn).toHaveBeenCalledWith(parmsId.instance)
//   })
//   test('It should delete the old instance and inject', () => {
//     const parmsId = ParmsIdTypeObject()
//     const newParmsId = ParmsIdTypeObject()
//     const spyOn = jest.spyOn(newParmsId, 'inject')
//     newParmsId.inject(parmsId.instance)
//     expect(spyOn).toHaveBeenCalledWith(parmsId.instance)
//   })
//   test("It should delete it's instance", () => {
//     const parmsId = ParmsIdTypeObject()
//     const spyOn = jest.spyOn(parmsId, 'delete')
//     parmsId.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(parmsId.instance).toBeNull()
//     expect(() => parmsId.values).toThrow(TypeError)
//   })
//   test('It should skip deleting twice', () => {
//     const parmsId = ParmsIdTypeObject()
//     parmsId.delete()
//     const spyOn = jest.spyOn(parmsId, 'delete')
//     parmsId.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(parmsId.instance).toBeNull()
//   })
//   test('It should return values', () => {
//     const parms = seal.EncryptionParameters(seal.SchemeType.BFV)
//     parms.setPolyModulusDegree(4096)
//     parms.setCoeffModulus(
//       seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
//     )
//     parms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
//     const context = seal.Context(parms, true, seal.SecurityLevel.tc128)
//     const parmsId = context.firstParmsId
//     const values = parmsId.values
//     expect(Array.isArray(values)).toBe(true)
//     values.forEach(x => {
//       expect(typeof x).toBe('bigint')
//     })
//   })
//   test('It should construct from no args', () => {
//     const constructor = jest.fn(ParmsIdTypeObject)
//     const parmsId = constructor()
//     expect(constructor).toHaveBeenCalledWith()
//     expect(parmsId).toBeDefined()
//     expect(typeof parmsId.constructor).toBe('function')
//     expect(parmsId).toBeInstanceOf(Object)
//     expect(parmsId.constructor).toBe(Object)
//     expect(parmsId.instance.constructor.name).toBe('ParmsIdType')
//     const values = parmsId.values
//     expect(Array.isArray(values)).toBe(true)
//     values.forEach(x => {
//       expect(typeof x).toBe('bigint')
//     })
//   })
// })
