import { Seal } from '../../index.js'

let Morfix = null
let parms = null
let context = null
let keyGenerator = null
let publicKey = null
let secretKey = null
let encryptor = null
beforeAll(async () => {
  Morfix = await Seal
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
    expect(Morfix).toHaveProperty('Decryptor')
    expect(Morfix.Decryptor).toBeDefined()
    expect(typeof Morfix.Decryptor.constructor).toBe('function')
    expect(Morfix.Decryptor).toBeInstanceOf(Object)
    expect(Morfix.Decryptor.constructor).toBe(Function)
    expect(Morfix.Decryptor.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.Decryptor(context, secretKey)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('decrypt')
  })
  test('It should have an instance', () => {
    const item = Morfix.Decryptor(context, secretKey)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.Decryptor(context, secretKey)
    const newItem = Morfix.Decryptor(context, secretKey)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = Morfix.Decryptor(context, secretKey)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.decrypt()).toThrow(TypeError)
  })
  test('It should encrypt a ciphertext to a destination plain', () => {
    const item = Morfix.Decryptor(context, secretKey)
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
    const item = Morfix.Decryptor(context, secretKey)
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
