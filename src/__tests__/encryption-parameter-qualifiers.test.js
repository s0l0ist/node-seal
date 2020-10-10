// import { Seal } from '../../target/wasm'
// import { EncryptionParameterQualifiers } from '../../components'

// let seal = null
// let parms = null
// let context = null
// let contextData = null

// let ckksParms = null
// let ckksContext = null
// let ckksContextData = null

// let EncryptionParameterQualifiersObject = null

// beforeAll(async () => {
//   seal = await Seal()
//   EncryptionParameterQualifiersObject = EncryptionParameterQualifiers()()

//   parms = seal.EncryptionParameters(seal.SchemeType.BFV)
//   parms.setPolyModulusDegree(4096)
//   parms.setCoeffModulus(
//     seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
//   )
//   parms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
//   context = seal.Context(parms, true, seal.SecurityLevel.tc128)
//   contextData = context.firstContextData

//   ckksParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
//   ckksParms.setPolyModulusDegree(4096)
//   ckksParms.setCoeffModulus(
//     seal.CoeffModulus.Create(4096, Int32Array.from([46, 16, 46]))
//   )
//   ckksContext = seal.Context(ckksParms, true, seal.SecurityLevel.tc128)
//   ckksContextData = ckksContext.firstContextData
// })

// describe('EncryptionParameterQualifiers', () => {
//   test('It should be a factory', () => {
//     expect(EncryptionParameterQualifiersObject).toBeDefined()
//     expect(typeof EncryptionParameterQualifiersObject.constructor).toBe(
//       'function'
//     )
//     expect(EncryptionParameterQualifiersObject).toBeInstanceOf(Object)
//     expect(EncryptionParameterQualifiersObject.constructor).toBe(Function)
//     expect(EncryptionParameterQualifiersObject.constructor.name).toBe(
//       'Function'
//     )
//   })
//   test('It should have properties', () => {
//     const item = EncryptionParameterQualifiersObject(
//       EncryptionParameterQualifiersObject(contextData.qualifiers.instance)
//         .instance
//     )
//     // Test properties
//     expect(item).toHaveProperty('instance')
//     expect(item).toHaveProperty('unsafeInject')
//     expect(item).toHaveProperty('delete')
//     expect(item).toHaveProperty('parametersSet')
//     expect(item).toHaveProperty('usingFFT')
//     expect(item).toHaveProperty('usingNTT')
//     expect(item).toHaveProperty('usingBatching')
//     expect(item).toHaveProperty('usingFastPlainLift')
//     expect(item).toHaveProperty('usingDescendingModulusChain')
//     expect(item).toHaveProperty('securityLevel')
//   })
//   test('It should have an instance (none)', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     expect(item.instance).toBeDefined()
//   })
//   test('It should have an instance (bfv)', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     expect(item.instance).toBeDefined()
//   })
//   test('It should have an instance (ckks)', () => {
//     const item = EncryptionParameterQualifiersObject(
//       ckksContextData.qualifiers.instance
//     )
//     expect(item.instance).toBeDefined()
//   })
//   test('It should inject', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     const newItem = EncryptionParameterQualifiersObject(
//       ckksContextData.qualifiers.instance
//     )
//     const spyOn = jest.spyOn(newItem, 'unsafeInject')
//     newItem.unsafeInject(item.instance)
//     expect(spyOn).toHaveBeenCalledWith(item.instance)
//     expect(newItem.parametersSet()).toEqual(true)
//   })
//   test('It should delete the old instance and inject', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     const newItem = EncryptionParameterQualifiersObject(
//       ckksContextData.qualifiers.instance
//     )
//     newItem.delete()
//     const spyOn = jest.spyOn(newItem, 'unsafeInject')
//     newItem.unsafeInject(item.instance)
//     expect(spyOn).toHaveBeenCalledWith(item.instance)
//     expect(newItem.parametersSet()).toEqual(true)
//   })
//   test("It should delete it's instance", () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     const spyOn = jest.spyOn(item, 'delete')
//     item.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(item.instance).toBeNull()
//     expect(() => item.usingFFT).toThrow(TypeError)
//   })
//   test('It should skip deleting twice', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     item.delete()
//     const spyOn = jest.spyOn(item, 'delete')
//     item.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(item.instance).toBeNull()
//     expect(() => item.usingFFT).toThrow(TypeError)
//   })
//   test('It should return true if the parameters are set', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     expect(item.parametersSet()).toEqual(true)
//   })
//   test('It should return true if using FFT', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     expect(item.usingFFT).toEqual(true)
//   })
//   test('It should return true if using NTT', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     expect(item.usingNTT).toEqual(true)
//   })
//   test('It should return true if using batching', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     expect(item.usingBatching).toEqual(true)
//   })
//   test('It should return true if using fast plain lift', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     expect(item.usingFastPlainLift).toEqual(true)
//   })
//   test('It should return true if coeff modulus primes are in decreasing order', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     expect(item.usingDescendingModulusChain).toEqual(true)
//   })
//   test('It should return the security level', () => {
//     const item = EncryptionParameterQualifiersObject(
//       contextData.qualifiers.instance
//     )
//     expect(item.securityLevel).toEqual(seal.SecurityLevel.tc128)
//   })
// })
