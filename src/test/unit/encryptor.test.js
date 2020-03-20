import { Seal } from '../../index.js'

let Morfix = null
let parms = null
let context = null
let keyGenerator = null
let publicKey = null
let secretKey = null
let decryptor = null
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
  decryptor = Morfix.Decryptor(context, secretKey)
})

describe('Encryptor', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('Encryptor')
    expect(Morfix.Encryptor).toBeDefined()
    expect(typeof Morfix.Encryptor.constructor).toBe('function')
    expect(Morfix.Encryptor).toBeInstanceOf(Object)
    expect(Morfix.Encryptor.constructor).toBe(Function)
    expect(Morfix.Encryptor.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.Encryptor(context, publicKey)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encrypt')
  })
  test('It should have an instance', () => {
    const item = Morfix.Encryptor(context, publicKey)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.Encryptor(context, publicKey)
    const newItem = Morfix.Encryptor(context, publicKey)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.instance).toEqual(item.instance)
  })
  test("It should delete it's instance", () => {
    const item = Morfix.Encryptor(context, publicKey)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.encrypt()).toThrow(TypeError)
  })
  test('It should encrypt a plaintext to a destination cipher', () => {
    const item = Morfix.Encryptor(context, publicKey)
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
    const item = Morfix.Encryptor(context, publicKey)
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
