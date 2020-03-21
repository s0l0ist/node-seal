import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { Decryptor } from '../../components'

let Morfix = null
let parms = null
let context = null
let keyGenerator = null
let publicKey = null
let secretKey = null
let encryptor = null
let DecryptorObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  DecryptorObject = Decryptor(lib)(Morfix)

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
  encryptor = Morfix.Encryptor(context, publicKey)
})

describe('Decryptor', () => {
  test('It should be a factory', () => {
    expect(DecryptorObject).toBeDefined()
    expect(typeof DecryptorObject.constructor).toBe('function')
    expect(DecryptorObject).toBeInstanceOf(Object)
    expect(DecryptorObject.constructor).toBe(Function)
    expect(DecryptorObject.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = DecryptorObject(context, secretKey)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('decrypt')
  })
  test('It should have an instance', () => {
    const item = DecryptorObject(context, secretKey)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = DecryptorObject(context, secretKey)
    const newItem = DecryptorObject(context, secretKey)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = DecryptorObject(context, secretKey)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.decrypt()).toThrow(TypeError)
  })
  test('It should encrypt a ciphertext to a destination plain', () => {
    const item = DecryptorObject(context, secretKey)
    const encoder = Morfix.BatchEncoder(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = Morfix.PlainText()
    const cipher = Morfix.CipherText()
    encoder.encode(arr, plain)
    encryptor.encrypt(plain, cipher)
    const plainResult = Morfix.PlainText()
    const spyOn = jest.spyOn(item, 'decrypt')
    item.decrypt(cipher, plainResult)
    expect(spyOn).toHaveBeenCalledWith(cipher, plainResult)
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
  test('It should encrypt a ciphertext and return a plain', () => {
    const item = DecryptorObject(context, secretKey)
    const encoder = Morfix.BatchEncoder(context)
    const arr = Int32Array.from({ length: encoder.slotCount }).fill(5)
    const plain = Morfix.PlainText()
    const cipher = Morfix.CipherText()
    encoder.encode(arr, plain)
    encryptor.encrypt(plain, cipher)
    const spyOn = jest.spyOn(item, 'decrypt')
    const plainResult = item.decrypt(cipher)
    expect(spyOn).toHaveBeenCalledWith(cipher)
    expect(plainResult).toBeDefined()
    expect(typeof plainResult.constructor).toBe('function')
    expect(plainResult).toBeInstanceOf(Object)
    expect(plainResult.constructor).toBe(Object)
    expect(plainResult.instance.constructor.name).toBe('Plaintext')
    const decoded = encoder.decode(plainResult, true)
    expect(decoded).toEqual(arr)
  })
})
