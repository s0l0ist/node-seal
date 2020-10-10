// import { Seal, getLibrary } from '../../target/wasm'
// import { ContextData } from '../../components'

// let seal = null
// let parms = null
// let context = null

// let ckksParms = null
// let ckksContext = null
// let ContextDataObject = null
// beforeAll(async () => {
//   seal = await Seal()
//   const lib = getLibrary()
//   ContextDataObject = ContextData(lib)(seal)

//   parms = seal.EncryptionParameters(seal.SchemeType.BFV)
//   parms.setPolyModulusDegree(4096)
//   parms.setCoeffModulus(
//     seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
//   )
//   parms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
//   context = seal.Context(parms, true, seal.SecurityLevel.tc128)
//   ckksParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
//   ckksParms.setPolyModulusDegree(4096)
//   ckksParms.setCoeffModulus(
//     seal.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
//   )
//   ckksContext = seal.Context(parms, true, seal.SecurityLevel.tc128)
// })

// describe('ContextData', () => {
//   test('It should be a factory', () => {
//     expect(ContextDataObject).toBeDefined()
//     expect(typeof ContextDataObject.constructor).toBe('function')
//     expect(ContextDataObject).toBeInstanceOf(Object)
//     expect(ContextDataObject.constructor).toBe(Function)
//     expect(ContextDataObject.constructor.name).toBe('Function')
//   })
//   test('It should have properties', () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)
//     // Test properties
//     expect(contextData).toHaveProperty('instance')
//     expect(contextData).toHaveProperty('unsafeInject')
//     expect(contextData).toHaveProperty('delete')
//     expect(contextData).toHaveProperty('parms')
//     expect(contextData).toHaveProperty('parmsId')
//     expect(contextData).toHaveProperty('qualifiers')
//     expect(contextData).toHaveProperty('totalCoeffModulusBitCount')
//     expect(contextData).toHaveProperty('prevContextData')
//     expect(contextData).toHaveProperty('nextContextData')
//     expect(contextData).toHaveProperty('chainIndex')
//   })
//   test('It should have an instance (bfv)', () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)
//     expect(contextData.instance).toBeDefined()
//   })
//   test('It should have an instance (ckks)', () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)
//     expect(contextData.instance).toBeDefined()
//   })
//   test('It should inject', () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)

//     const newContextData = ContextDataObject(
//       ckksContext.firstContextData.instance
//     )
//     newContextData.delete()
//     const spyOn = jest.spyOn(newContextData, 'unsafeInject')
//     newContextData.unsafeInject(contextData.instance)
//     expect(spyOn).toHaveBeenCalledWith(contextData.instance)
//     expect(newContextData.totalCoeffModulusBitCount).toEqual(72)
//   })
//   test('It should delete the old instance and inject', () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)

//     const newContextData = ContextDataObject(
//       ckksContext.firstContextData.instance
//     )
//     const spyOn = jest.spyOn(newContextData, 'unsafeInject')
//     newContextData.unsafeInject(contextData.instance)
//     expect(spyOn).toHaveBeenCalledWith(contextData.instance)
//     expect(newContextData.totalCoeffModulusBitCount).toEqual(72)
//   })
//   test("It should delete it's instance", () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)

//     const spyOn = jest.spyOn(contextData, 'delete')
//     contextData.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(contextData.instance).toBeNull()
//     expect(() => contextData.totalCoeffModulusBitCount).toThrow(TypeError)
//   })
//   test('It should skip deleting twice', () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)
//     contextData.delete()
//     const spyOn = jest.spyOn(contextData, 'delete')
//     contextData.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(contextData.instance).toBeNull()
//     expect(() => contextData.totalCoeffModulusBitCount).toThrow(TypeError)
//   })
//   test('It should return a the previous context data', () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)

//     const prev = contextData.prevContextData
//     expect(prev.instance).toBeDefined()
//     expect(prev.totalCoeffModulusBitCount).toEqual(109)
//   })
//   test('It should return a the next context data', () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)

//     const prev = contextData.nextContextData
//     expect(prev.instance).toBeDefined()
//     expect(prev.totalCoeffModulusBitCount).toEqual(36)
//   })
//   test('It should return the chain index', () => {
//     const contextData = ContextDataObject(context.firstContextData.instance)

//     expect(contextData.chainIndex).toEqual(1)
//   })
// })
