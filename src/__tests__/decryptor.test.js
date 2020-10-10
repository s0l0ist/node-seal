// import { Seal, getLibrary } from '../../target/wasm'
// import { Decryptor } from '../../components'

// let seal,
//   parms,
//   context,
//   keyGenerator,
//   publicKey,
//   secretKey,
//   encryptor,
//   encoder,
//   evaluator,
//   DecryptorObject = null
// beforeAll(async () => {
//   seal = await Seal()
//   const lib = getLibrary()
//   DecryptorObject = Decryptor(lib)(seal)

//   parms = seal.EncryptionParameters(seal.SchemeType.BFV)
//   parms.setPolyModulusDegree(4096)
//   parms.setCoeffModulus(
//     seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
//   )
//   parms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
//   context = seal.Context(parms, true, seal.SecurityLevel.tc128)
//   encoder = seal.BatchEncoder(context)
//   keyGenerator = seal.KeyGenerator(context)
//   publicKey = keyGenerator.publicKey()
//   secretKey = keyGenerator.secretKey()
//   evaluator = seal.Evaluator(context)
//   encryptor = seal.Encryptor(context, publicKey)
// })

// describe('Decryptor', () => {
//   test('It should be a factory', () => {
//     expect(DecryptorObject).toBeDefined()
//     expect(typeof DecryptorObject.constructor).toBe('function')
//     expect(DecryptorObject).toBeInstanceOf(Object)
//     expect(DecryptorObject.constructor).toBe(Function)
//     expect(DecryptorObject.constructor.name).toBe('Function')
//   })
//   test('It should construct an instance', () => {
//     const Constructor = jest.fn(DecryptorObject)
//     Constructor(context, secretKey)
//     expect(Constructor).toBeCalledWith(context, secretKey)
//   })
//   test('It should fail to construct an instance', () => {
//     const newParms = seal.EncryptionParameters(seal.SchemeType.BFV)
//     newParms.setPolyModulusDegree(2048)
//     newParms.setCoeffModulus(
//       seal.CoeffModulus.BFVDefault(2048, seal.SecurityLevel.tc128)
//     )
//     newParms.setPlainModulus(seal.PlainModulus.Batching(2048, 20))
//     const newContext = seal.Context(newParms)
//     const newKeyGenerator = seal.KeyGenerator(newContext)
//     const newSecretKey = newKeyGenerator.secretKey()

//     const Constructor = jest.fn(DecryptorObject)
//     expect(() => Constructor(context, newSecretKey)).toThrow()
//     expect(Constructor).toBeCalledWith(context, newSecretKey)
//   })
//   test('It should have properties', () => {
//     const item = DecryptorObject(context, secretKey)
//     // Test properties
//     expect(item).toHaveProperty('instance')
//     expect(item).toHaveProperty('unsafeInject')
//     expect(item).toHaveProperty('delete')
//     expect(item).toHaveProperty('decrypt')
//     expect(item).toHaveProperty('invariantNoiseBudget')
//   })
//   test('It should have an instance', () => {
//     const item = DecryptorObject(context, secretKey)
//     expect(item.instance).toBeDefined()
//   })
//   test('It should inject', () => {
//     const item = DecryptorObject(context, secretKey)
//     const newItem = DecryptorObject(context, secretKey)
//     newItem.delete()
//     const spyOn = jest.spyOn(newItem, 'unsafeInject')
//     newItem.unsafeInject(item.instance)
//     expect(spyOn).toHaveBeenCalledWith(item.instance)
//     expect(newItem.instance).toEqual(item.instance)
//   })
//   test('It should delete the old instance and inject', () => {
//     const item = DecryptorObject(context, secretKey)
//     const newItem = DecryptorObject(context, secretKey)
//     const spyOn = jest.spyOn(newItem, 'unsafeInject')
//     newItem.unsafeInject(item.instance)
//     expect(spyOn).toHaveBeenCalledWith(item.instance)
//     expect(newItem.instance).toEqual(item.instance)
//   })
//   test("It should delete it's instance", () => {
//     const item = DecryptorObject(context, secretKey)
//     const spyOn = jest.spyOn(item, 'delete')
//     item.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(item.instance).toBeNull()
//     expect(() => item.decrypt()).toThrow(TypeError)
//   })
//   test('It should skip deleting twice', () => {
//     const item = DecryptorObject(context, secretKey)
//     item.delete()
//     const spyOn = jest.spyOn(item, 'delete')
//     item.delete()
//     expect(spyOn).toHaveBeenCalled()
//     expect(item.instance).toBeNull()
//     expect(() => item.decrypt()).toThrow(TypeError)
//   })
//   test('It should encrypt a ciphertext to a destination plain', () => {
//     const item = DecryptorObject(context, secretKey)
//     const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
//     const plain = seal.PlainText()
//     const cipher = seal.CipherText()
//     encoder.encode(arr, plain)
//     encryptor.encrypt(plain, cipher)
//     const plainResult = seal.PlainText()
//     const spyOn = jest.spyOn(item, 'decrypt')
//     item.decrypt(cipher, plainResult)
//     expect(spyOn).toHaveBeenCalledWith(cipher, plainResult)
//     const decoded = encoder.decode(plainResult, true)
//     expect(decoded).toEqual(arr)
//   })
//   test('It should encrypt a ciphertext and return a plain', () => {
//     const item = DecryptorObject(context, secretKey)
//     const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
//     const plain = seal.PlainText()
//     const cipher = seal.CipherText()
//     encoder.encode(arr, plain)
//     encryptor.encrypt(plain, cipher)
//     const spyOn = jest.spyOn(item, 'decrypt')
//     const plainResult = item.decrypt(cipher)
//     expect(spyOn).toHaveBeenCalledWith(cipher)
//     expect(plainResult).toBeDefined()
//     expect(typeof plainResult.constructor).toBe('function')
//     expect(plainResult).toBeInstanceOf(Object)
//     expect(plainResult.constructor).toBe(Object)
//     expect(plainResult.instance.constructor.name).toBe('Plaintext')
//     const decoded = encoder.decode(plainResult, true)
//     expect(decoded).toEqual(arr)
//   })
//   test('It should return the invariant noise budget', () => {
//     const item = DecryptorObject(context, secretKey)
//     const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
//     const plain = seal.PlainText()
//     const cipher = seal.CipherText()
//     encoder.encode(arr, plain)
//     encryptor.encrypt(plain, cipher)
//     const spyOn = jest.spyOn(item, 'invariantNoiseBudget')
//     const noise = item.invariantNoiseBudget(cipher)
//     expect(typeof noise).toBe('number')
//     expect(spyOn).toHaveBeenCalledWith(cipher)
//   })
//   test('It should fail to return the invariant noise budget', () => {
//     const item = DecryptorObject(context, secretKey)
//     const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
//     const plain = seal.PlainText()
//     const cipher = seal.CipherText()
//     encoder.encode(arr, plain)
//     encryptor.encrypt(plain, cipher)
//     evaluator.cipherTransformToNtt(cipher, cipher)
//     const spyOn = jest.spyOn(item, 'invariantNoiseBudget')
//     expect(() => item.invariantNoiseBudget(cipher)).toThrow()
//     expect(spyOn).toHaveBeenCalledWith(cipher)
//   })
// })
