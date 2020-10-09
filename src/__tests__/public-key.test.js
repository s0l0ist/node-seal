// import { Seal, getLibrary } from '../../target/wasm'
// import { PublicKey } from '../../components'

// let Morfix = null
// let parms = null
// let context = null
// let keyGenerator = null
// let PublicKeyObject = null
// beforeAll(async () => {
//   Morfix = await Seal()
//   const lib = getLibrary()
//   PublicKeyObject = PublicKey(lib)(Morfix)

//   parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
//   parms.setPolyModulusDegree(4096)
//   parms.setCoeffModulus(
//     Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
//   )
//   parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
//   context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
//   keyGenerator = Morfix.KeyGenerator(context)
// })

// describe('PublicKey', () => {
//   test('It should be a factory', () => {
//     expect(PublicKeyObject).toBeDefined()
//     expect(typeof PublicKeyObject.constructor).toBe('function')
//     expect(PublicKeyObject).toBeInstanceOf(Object)
//     expect(PublicKeyObject.constructor).toBe(Function)
//     expect(PublicKeyObject.constructor.name).toBe('Function')
//   })
//   test('It should have properties', () => {
//     const item = PublicKeyObject()
//     // Test properties
//     expect(item).toHaveProperty('instance')
//     expect(item).toHaveProperty('inject')
//     expect(item).toHaveProperty('delete')
//     expect(item).toHaveProperty('save')
//     expect(item).toHaveProperty('saveArray')
//     expect(item).toHaveProperty('load')
//     expect(item).toHaveProperty('loadArray')
//     expect(item).toHaveProperty('copy')
//     expect(item).toHaveProperty('clone')
//     expect(item).toHaveProperty('move')
//   })
//   test('It should have an instance', () => {
//     const item = PublicKeyObject()
//     expect(item.instance).toBeDefined()
//   })
//   test('It should inject', () => {
//     const item = PublicKeyObject()
//     const str = item.save()
//     const newItem = PublicKeyObject()
//     newItem.delete()
//     const spyOn = jest.spyOn(newItem, 'inject')
//     newItem.inject(item.instance)
//     expect(spyOn).toHaveBeenCalledWith(item.instance)
//     expect(newItem.save()).toEqual(str)
//   })
//   test('It should delete the old instance and inject', () => {
//     const item = PublicKeyObject()
//     const str = item.save()
//     const newItem = PublicKeyObject()
//     const spyOn = jest.spyOn(newItem, 'inject')
//     newItem.inject(item.instance)
//     expect(spyOn).toHaveBeenCalledWith(item.instance)
//     expect(newItem.save()).toEqual(str)
//   })
//   test("It should delete it's instance", () => {
//     const item = PublicKeyObject()
//     const spyOn = jest.spyOn(item, 'delete')
//     item.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(item.instance).toBeNull()
//     expect(() => item.save()).toThrow(TypeError)
//   })
//   test('It should skip deleting twice', () => {
//     const item = PublicKeyObject()
//     item.delete()
//     const spyOn = jest.spyOn(item, 'delete')
//     item.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(item.instance).toBeNull()
//   })
//   test('It should save to a string', () => {
//     const item = PublicKeyObject()
//     const spyOn = jest.spyOn(item, 'save')
//     const str = item.save()
//     expect(spyOn).toHaveBeenCalledWith()
//     expect(typeof str).toBe('string')
//   })
//   test('It should save to an array', () => {
//     const item = PublicKeyObject()
//     const spyOn = jest.spyOn(item, 'saveArray')
//     const array = item.saveArray()
//     expect(spyOn).toHaveBeenCalledWith()
//     expect(array.constructor).toBe(Uint8Array)
//   })
//   test('It should load from a string', () => {
//     const item = keyGenerator.publicKey()
//     const newItem = PublicKeyObject()
//     const str = item.save()
//     const spyOn = jest.spyOn(newItem, 'load')
//     newItem.load(context, str)
//     expect(spyOn).toHaveBeenCalledWith(context, str)
//     expect(newItem.save()).toEqual(str)
//   })
//   test('It should load from a typed array', () => {
//     const item = keyGenerator.publicKey()
//     const newItem = PublicKeyObject()
//     const array = item.saveArray()
//     const spyOn = jest.spyOn(newItem, 'loadArray')
//     newItem.loadArray(context, array)
//     expect(spyOn).toHaveBeenCalledWith(context, array)
//     expect(newItem.saveArray()).toEqual(array)
//   })
//   test('It should fail to load from a string', () => {
//     const newItem = PublicKeyObject()
//     const spyOn = jest.spyOn(newItem, 'load')
//     expect(() =>
//       newItem.load(
//         context,
//         'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
//       )
//     ).toThrow()
//     expect(spyOn).toHaveBeenCalledWith(
//       context,
//       'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
//     )
//   })
//   test('It should fail to load from a Uint8Array', () => {
//     const newItem = PublicKeyObject()
//     const spyOn = jest.spyOn(newItem, 'loadArray')
//     expect(() =>
//       newItem.loadArray(
//         context,
//         Uint8Array.from([
//           94,
//           161,
//           16,
//           3,
//           5,
//           1,
//           0,
//           0,
//           40,
//           0,
//           0,
//           0,
//           0,
//           0,
//           0,
//           0,
//           120,
//           156,
//           99,
//           96,
//           160,
//           8,
//           124,
//           176,
//           143,
//           91,
//           40,
//           192,
//           204,
//           10,
//           100,
//           73,
//           160,
//           201,
//           0,
//           0,
//           57,
//           170,
//           2,
//           95
//         ])
//       )
//     ).toThrow()
//     expect(spyOn).toHaveBeenCalledWith(
//       context,
//       Uint8Array.from([
//         94,
//         161,
//         16,
//         3,
//         5,
//         1,
//         0,
//         0,
//         40,
//         0,
//         0,
//         0,
//         0,
//         0,
//         0,
//         0,
//         120,
//         156,
//         99,
//         96,
//         160,
//         8,
//         124,
//         176,
//         143,
//         91,
//         40,
//         192,
//         204,
//         10,
//         100,
//         73,
//         160,
//         201,
//         0,
//         0,
//         57,
//         170,
//         2,
//         95
//       ])
//     )
//   })
//   test('It should copy another instance', () => {
//     const item = keyGenerator.publicKey()
//     const newItem = PublicKeyObject()
//     const spyOn = jest.spyOn(newItem, 'copy')
//     newItem.copy(item)
//     expect(spyOn).toHaveBeenCalledWith(item)
//   })
//   test('It should fail to copy another instance', () => {
//     const item = keyGenerator.publicKey()
//     const newItem = PublicKeyObject()
//     item.delete()
//     const spyOn = jest.spyOn(newItem, 'copy')
//     expect(() => newItem.copy(item)).toThrow()
//     expect(spyOn).toHaveBeenCalledWith(item)
//   })
//   test('It should clone itself', () => {
//     const item = PublicKeyObject()
//     const spyOn = jest.spyOn(item, 'clone')
//     const newItem = item.clone()
//     expect(spyOn).toHaveBeenCalledWith()
//     expect(newItem).toBeDefined()
//     expect(typeof newItem.constructor).toBe('function')
//     expect(newItem).toBeInstanceOf(Object)
//     expect(newItem.constructor).toBe(Object)
//     expect(newItem.instance.constructor.name).toBe('PublicKey')
//   })
//   test('It should fail to clone itself', () => {
//     const item = PublicKeyObject()
//     item.delete()
//     const spyOn = jest.spyOn(item, 'clone')
//     expect(() => item.clone()).toThrow()
//     expect(spyOn).toHaveBeenCalledWith()
//   })
//   test('It should move another instance into itself and delete the old', () => {
//     const item = keyGenerator.publicKey()
//     const newItem = PublicKeyObject()
//     const spyOn = jest.spyOn(newItem, 'move')
//     newItem.move(item)
//     expect(spyOn).toHaveBeenCalledWith(item)
//     expect(item.instance).toBeNull()
//   })
//   test('It should fail to move another instance into itself and delete the old', () => {
//     const item = keyGenerator.publicKey()
//     const newItem = PublicKeyObject()
//     item.delete()
//     const spyOn = jest.spyOn(newItem, 'move')
//     expect(() => newItem.move(item)).toThrow()
//     expect(spyOn).toHaveBeenCalledWith(item)
//   })
// })
