import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { Encryptor } from '../../components'

let Morfix,
  parms,
  context,
  keyGenerator,
  publicKey,
  secretKey,
  decryptor,
  EncryptorObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  EncryptorObject = Encryptor(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  keyGenerator = Morfix.KeyGenerator(context)
  publicKey = keyGenerator.getPublicKey()
  secretKey = keyGenerator.getSecretKey()
  decryptor = Morfix.Decryptor(context, secretKey)
})

describe('Encryptor', () => {
  test('It should be a factory', () => {
    expect(EncryptorObject).toBeDefined()
    expect(typeof EncryptorObject.constructor).toBe('function')
    expect(EncryptorObject).toBeInstanceOf(Object)
    expect(EncryptorObject.constructor).toBe(Function)
    expect(EncryptorObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(EncryptorObject)
    Constructor(context, publicKey)
    expect(Constructor).toBeCalledWith(context, publicKey)
  })
  test('It should fail to construct an instance', () => {
    const newParms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
    newParms.setPolyModulusDegree(2048)
    newParms.setCoeffModulus(
      Morfix.CoeffModulus.BFVDefault(2048, Morfix.SecurityLevel.tc128)
    )
    newParms.setPlainModulus(Morfix.PlainModulus.Batching(2048, 20))
    const newContext = Morfix.Context(newParms)
    const newKeyGenerator = Morfix.KeyGenerator(newContext)
    const newPublicKey = newKeyGenerator.getPublicKey()

    const Constructor = jest.fn(EncryptorObject)
    expect(() => Constructor(context, newPublicKey)).toThrow()
    expect(Constructor).toBeCalledWith(context, newPublicKey)
  })
  test('It should have properties', () => {
    const item = EncryptorObject(context, publicKey)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encrypt')
  })
  test('It should have an instance', () => {
    const item = EncryptorObject(context, publicKey)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = EncryptorObject(context, publicKey)
    const newItem = EncryptorObject(context, publicKey)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test('It should delete the old instance and inject', () => {
    const item = EncryptorObject(context, publicKey)
    const newItem = EncryptorObject(context, publicKey)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = EncryptorObject(context, publicKey)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.encrypt()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = EncryptorObject(context, publicKey)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.decrypt()).toThrow(TypeError)
  })
  test('It should encrypt a plaintext to a destination cipher', () => {
    const item = EncryptorObject(context, publicKey)
    const encoder = Morfix.BatchEncoder(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = Morfix.PlainText()
    const cipher = Morfix.CipherText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encrypt')
    item.encrypt(plain, cipher)
    expect(spyOn).toHaveBeenCalledWith(plain, cipher)
    const plainResult = decryptor.decrypt(cipher)
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
  test('It should encrypt a plaintext and return a cipher', () => {
    const item = EncryptorObject(context, publicKey)
    const encoder = Morfix.BatchEncoder(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = Morfix.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'encrypt')
    const cipher = item.encrypt(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(cipher).toBeDefined()
    expect(typeof cipher.constructor).toBe('function')
    expect(cipher).toBeInstanceOf(Object)
    expect(cipher.constructor).toBe(Object)
    expect(cipher.instance.constructor.name).toBe('Ciphertext')
    const plainResult = decryptor.decrypt(cipher)
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
})
