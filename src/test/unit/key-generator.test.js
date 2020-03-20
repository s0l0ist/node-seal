import { Seal } from '../../index.js'

let Morfix = null
let parms = null
let context = null

beforeAll(async () => {
  Morfix = await Seal
  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
})

describe('KeyGenerator', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('KeyGenerator')
    expect(Morfix.KeyGenerator).not.toBeUndefined()
    expect(typeof Morfix.KeyGenerator.constructor).toBe('function')
    expect(Morfix.KeyGenerator).toBeInstanceOf(Object)
    expect(Morfix.KeyGenerator.constructor).toBe(Function)
    expect(Morfix.KeyGenerator.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.KeyGenerator(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('getSecretKey')
    expect(item).toHaveProperty('getPublicKey')
    expect(item).toHaveProperty('genRelinKeys')
    expect(item).toHaveProperty('genGaloisKeys')
  })
  test('It should have an instance (bfv)', () => {
    const item = Morfix.KeyGenerator(context)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(item.instance).not.toBeNull()
  })
  test("It should delete it's instance", () => {
    const item = Morfix.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.getSecretKey()).toThrow(TypeError)
  })
  test('It should return its secret key', () => {
    const item = Morfix.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'getSecretKey')
    const key = item.getSecretKey()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).not.toBeNull()
  })
  test('It should return its public key', () => {
    const item = Morfix.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'getPublicKey')
    const key = item.getPublicKey()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).not.toBeNull()
  })
  test('It should generate and return relinKeys', () => {
    const item = Morfix.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'genRelinKeys')
    const key = item.genRelinKeys()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).not.toBeNull()
  })
  test('It should generate and return galoisKeys', () => {
    const item = Morfix.KeyGenerator(context)
    const spyOn = jest.spyOn(item, 'genGaloisKeys')
    const key = item.genGaloisKeys()
    expect(spyOn).toHaveBeenCalledWith()
    expect(key.instance).not.toBeNull()
  })
})
