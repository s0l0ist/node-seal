// import { Seal, getLibrary } from '../../target/wasm'
// import { SecurityLevel } from '../../components'

// let SecurityLevelObject = null

// beforeAll(async () => {
//   await Seal()
//   const lib = getLibrary()
//   SecurityLevelObject = SecurityLevel(lib)()
// })

// describe('SecurityLevel', () => {
//   test('It should be a static instance', () => {
//     expect(SecurityLevelObject).toBeDefined()
//     expect(typeof SecurityLevelObject.constructor).toBe('function')
//     expect(SecurityLevelObject).toBeInstanceOf(Object)
//     expect(SecurityLevelObject.constructor).toBe(Object)
//     expect(SecurityLevelObject.constructor.name).toBe('Object')
//   })
//   test('It should have properties', () => {
//     expect(SecurityLevelObject).toHaveProperty('none')
//     expect(SecurityLevelObject).toHaveProperty('tc128')
//     expect(SecurityLevelObject).toHaveProperty('tc192')
//     expect(SecurityLevelObject).toHaveProperty('tc256')
//   })
//   test('It should return type none', async () => {
//     const securityLevel = SecurityLevelObject.none
//     expect(securityLevel).toBeDefined()
//     expect(typeof securityLevel.constructor).toBe('function')
//     expect(securityLevel).toBeInstanceOf(Object)
//     expect(securityLevel.constructor).toBe(SecurityLevelObject.none.constructor)
//     expect(SecurityLevelObject.none.constructor.name).toBe('SecLevelType_none')
//   })
//   test('It should return type tc128', async () => {
//     const securityLevel = SecurityLevelObject.tc128
//     expect(securityLevel).toBeDefined()
//     expect(typeof securityLevel.constructor).toBe('function')
//     expect(securityLevel).toBeInstanceOf(Object)
//     expect(securityLevel.constructor).toBe(
//       SecurityLevelObject.tc128.constructor
//     )
//     expect(SecurityLevelObject.tc128.constructor.name).toBe(
//       'SecLevelType_tc128'
//     )
//   })
//   test('It should return type tc192', async () => {
//     const securityLevel = SecurityLevelObject.tc192
//     expect(securityLevel).toBeDefined()
//     expect(typeof securityLevel.constructor).toBe('function')
//     expect(securityLevel).toBeInstanceOf(Object)
//     expect(securityLevel.constructor).toBe(
//       SecurityLevelObject.tc192.constructor
//     )
//     expect(SecurityLevelObject.tc192.constructor.name).toBe(
//       'SecLevelType_tc192'
//     )
//   })
//   test('It should return type tc256', async () => {
//     const securityLevel = SecurityLevelObject.tc256
//     expect(securityLevel).toBeDefined()
//     expect(typeof securityLevel.constructor).toBe('function')
//     expect(securityLevel).toBeInstanceOf(Object)
//     expect(securityLevel.constructor).toBe(
//       SecurityLevelObject.tc256.constructor
//     )
//     expect(SecurityLevelObject.tc256.constructor.name).toBe(
//       'SecLevelType_tc256'
//     )
//   })
// })
