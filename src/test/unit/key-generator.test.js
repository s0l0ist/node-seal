import { Seal, getLibrary } from '../../target/wasm'
import { KeyGenerator } from '../../components'

let Morfix,
  parms,
  context,
  keyGen,
  secretKey,
  publicKey,
  invalidParms,
  invalidContext,
  KeyGeneratorObject = null
beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  KeyGeneratorObject = KeyGenerator(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  keyGen = Morfix.KeyGenerator(context)
  secretKey = keyGen.getSecretKey()
  publicKey = keyGen.getPublicKey()

  invalidParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  invalidParms.setPolyModulusDegree(1024)
  invalidParms.setCoeffModulus(
    Morfix.CoeffModulus.Create(1024, Int32Array.from([27]))
  )
  invalidParms.setPlainModulus(Morfix.PlainModulus.Batching(1024, 20))
  invalidContext = Morfix.Context(invalidParms)
})

describe('KeyGenerator', () => {
  test('It should be a factory', () => {
    expect(KeyGeneratorObject).toBeDefined()
    expect(typeof KeyGeneratorObject.constructor).toBe('function')
    expect(KeyGeneratorObject).toBeInstanceOf(Object)
    expect(KeyGeneratorObject.constructor).toBe(Function)
    expect(KeyGeneratorObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(KeyGeneratorObject)
    Constructor(context)
    expect(Constructor).toBeCalledWith(context)
  })
  test('It should construct an instance with a secretkey', () => {
    const Constructor = jest.fn(KeyGeneratorObject)
    Constructor(context, secretKey)
    expect(Constructor).toBeCalledWith(context, secretKey)
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(KeyGeneratorObject)
    expect(() => Constructor('fail')).toThrow()
    expect(Constructor).toBeCalledWith('fail')
  })
  test('It should have properties', () => {
    const item = KeyGeneratorObject(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('getSecretKey')
    expect(item).toHaveProperty('getPublicKey')
    expect(item).toHaveProperty('genRelinKeysLocal')
    expect(item).toHaveProperty('relinKeys')
    expect(item).toHaveProperty('genGaloisKeysLocal')
    expect(item).toHaveProperty('galoisKeys')
  })
  test('It should have an instance (bfv)', () => {
    const item = KeyGeneratorObject(context)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = KeyGeneratorObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(keyGen.instance)
    expect(spyOn).toHaveBeenCalledWith(keyGen.instance)
    expect(item.instance).toBeDefined()
  })
  test('It should delete the old instance and inject', () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(keyGen.instance)
    expect(spyOn).toHaveBeenCalledWith(keyGen.instance)
  })
  test("It should delete it's instance", () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.getSecretKey()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = KeyGeneratorObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
  })
  test('It should return its secret key', () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'getSecretKey')
    const key = item.getSecretKey()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).toBeDefined()
  })
  test('It should return its public key', () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'getPublicKey')
    const key = item.getPublicKey()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).toBeDefined()
  })
  test('It should generate and return relinKeys', () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'genRelinKeysLocal')
    const key = item.genRelinKeysLocal()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).toBeDefined()
  })
  test('It should fail to generate and return relinKeys', () => {
    const item = KeyGeneratorObject(invalidContext)
    const spyOn = jest.spyOn(item, 'genRelinKeysLocal')
    expect(() => item.genRelinKeysLocal()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should generate and return all galoisKeys', () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'genGaloisKeysLocal')
    const key = item.genGaloisKeysLocal()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).toBeDefined()
  })
  test('It should generate and return specific galoisKeys', () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'genGaloisKeysLocal')
    const key = item.genGaloisKeysLocal(
      Int32Array.from([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
    )
    expect(spyOn).toHaveBeenCalledWith(
      Int32Array.from([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
    )
    expect(key.instance).toBeDefined()
  })
  test('It should fail to generate and return galoisKeys', () => {
    const item = KeyGeneratorObject(invalidContext)
    const spyOn = jest.spyOn(item, 'genGaloisKeysLocal')
    expect(() => item.genGaloisKeysLocal()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should generate and return all galoisKeys as a base64 string', () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'galoisKeys')
    const serializable = item.galoisKeys()
    const serialized = serializable.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof serialized).toBe('string')
  })
  test('It should generate and return specific galoisKeys as a base64 string', () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'galoisKeys')
    const serializable = item.galoisKeys(
      Int32Array.from([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
    )
    expect(spyOn).toHaveBeenCalledWith(
      Int32Array.from([1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024])
    )
    const serialized = serializable.save()
    expect(typeof serialized).toBe('string')
  })
  test('It should fail to generate and return specific galoisKeys as a base64 string', () => {
    const item = KeyGeneratorObject(context)
    const spyOn = jest.spyOn(item, 'galoisKeys')
    expect(() => item.galoisKeys(Int32Array.from([99999]))).toThrow()
    expect(spyOn).toHaveBeenCalledWith(Int32Array.from([99999]))
  })
})
