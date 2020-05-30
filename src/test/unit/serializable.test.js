import { Seal } from '../../target/wasm/main'
import { Serializable } from '../../components'

let Morfix = null
let parms = null
let context = null
let keyGenerator = null
let publicKey = null
let secretKey = null
let encryptor = null
let encoder = null
let SerializableObject = null
beforeAll(async () => {
  Morfix = await Seal()
  SerializableObject = Serializable()(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  keyGenerator = Morfix.KeyGenerator(context)
  publicKey = keyGenerator.publicKey()
  secretKey = keyGenerator.secretKey()
  encryptor = Morfix.Encryptor(context, publicKey, secretKey)
  encoder = Morfix.BatchEncoder(context)
})

describe('SecretKey', () => {
  test('It should be a factory', () => {
    expect(SerializableObject).toBeDefined()
    expect(typeof SerializableObject.constructor).toBe('function')
    expect(SerializableObject).toBeInstanceOf(Object)
    expect(SerializableObject.constructor).toBe(Function)
    expect(SerializableObject.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = SerializableObject()
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('save')
    expect(item).toHaveProperty('saveArray')
  })
  test('It should not have an instance by default', () => {
    const item = SerializableObject()
    expect(item.instance).toBeNull()
  })
  test('It should inject', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr)
    const item = encryptor.encryptSymmetricSerializable(plain)
    const saved = item.save()
    const newItem = SerializableObject()
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(saved)
  })
  test('It should delete the old instance and inject', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr)
    const item = encryptor.encryptSymmetricSerializable(plain)
    const item2 = encryptor.encryptSymmetricSerializable(plain)
    const saved = item2.save()
    const newItem = SerializableObject()
    newItem.unsafeInject(item.instance)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item2.instance)
    expect(spyOn).toHaveBeenCalledWith(item2.instance)
    expect(newItem.save()).toEqual(saved)
  })
  test("It should delete it's instance", () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr)
    const item = encryptor.encryptSymmetricSerializable(plain)
    const newItem = SerializableObject()
    newItem.unsafeInject(item.instance)
    const spyOn = jest.spyOn(newItem, 'delete')
    newItem.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(newItem.instance).toBeNull()
    expect(() => newItem.save()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr)
    const item = encryptor.encryptSymmetricSerializable(plain)
    const newItem = SerializableObject()
    newItem.unsafeInject(item.instance)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'delete')
    newItem.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(newItem.instance).toBeNull()
  })
  test('It should save to a string', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr)
    const item = encryptor.encryptSymmetricSerializable(plain)
    const newItem = SerializableObject()
    newItem.unsafeInject(item.instance)
    const spyOn = jest.spyOn(newItem, 'save')
    const str = newItem.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const arr = Int32Array.from({ length: encoder.slotCount }, (_, i) => i)
    const plain = encoder.encode(arr)
    const item = encryptor.encryptSymmetricSerializable(plain)
    const newItem = SerializableObject()
    newItem.unsafeInject(item.instance)
    const spyOn = jest.spyOn(newItem, 'saveArray')
    const array = newItem.saveArray()
    expect(spyOn).toHaveBeenCalledWith()
    expect(array.constructor).toBe(Uint8Array)
  })
})
