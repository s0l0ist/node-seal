import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { PublicKey } from '../../components'

let Morfix = null
let parms = null
let context = null
let keyGenerator = null
let PublicKeyObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  PublicKeyObject = PublicKey(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  keyGenerator = Morfix.KeyGenerator(context)
})

describe('PublicKey', () => {
  test('It should be a factory', () => {
    expect(PublicKeyObject).toBeDefined()
    expect(typeof PublicKeyObject.constructor).toBe('function')
    expect(PublicKeyObject).toBeInstanceOf(Object)
    expect(PublicKeyObject.constructor).toBe(Function)
    expect(PublicKeyObject.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = PublicKeyObject()
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('inject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('save')
    expect(item).toHaveProperty('load')
    expect(item).toHaveProperty('copy')
    expect(item).toHaveProperty('clone')
    expect(item).toHaveProperty('move')
  })
  test('It should have an instance', () => {
    const item = PublicKeyObject()
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = PublicKeyObject()
    const str = item.save()
    const newItem = PublicKeyObject()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(str)
  })
  test("It should delete it's instance", () => {
    const item = PublicKeyObject()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.save()).toThrow(TypeError)
  })
  test('It should save to a string', () => {
    const item = PublicKeyObject()
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof str).toBe('string')
  })
  test('It should load from a string', () => {
    const item = keyGenerator.getPublicKey()
    const newItem = PublicKeyObject()
    const str = item.save()
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(context, str)
    expect(spyOn).toHaveBeenCalledWith(context, str)
    expect(newItem.save()).toEqual(str)
  })
  test('It should copy another instance', () => {
    const item = keyGenerator.getPublicKey()
    const newItem = PublicKeyObject()
    const spyOn = jest.spyOn(newItem, 'copy')
    newItem.copy(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(newItem.save()).toEqual(item.save())
  })
  test('It should clone itself', () => {
    const item = keyGenerator.getPublicKey()
    const spyOn = jest.spyOn(item, 'clone')
    const newItem = item.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newItem).toBeDefined()
    expect(typeof newItem.constructor).toBe('function')
    expect(newItem).toBeInstanceOf(Object)
    expect(newItem.constructor).toBe(Object)
    expect(newItem.instance.constructor.name).toBe('PublicKey')
    expect(newItem.save()).toEqual(item.save())
  })
  test('It should move another instance into itself and delete the old', () => {
    const item = keyGenerator.getPublicKey()
    const str = item.save()
    const newItem = PublicKeyObject()
    const spyOn = jest.spyOn(newItem, 'move')
    newItem.move(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(item.instance).toBeNull()
    expect(() => item.save()).toThrow(TypeError)
    expect(newItem.save()).toEqual(str)
  })
})
