import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { RelinKeys } from '../../components'

let Morfix = null
let parms = null
let context = null
let keyGenerator = null
let RelinKeysObject = null
beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  RelinKeysObject = RelinKeys(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  keyGenerator = Morfix.KeyGenerator(context)
})

describe('RelinKeys', () => {
  test('It should be a factory', () => {
    expect(RelinKeysObject).toBeDefined()
    expect(typeof RelinKeysObject.constructor).toBe('function')
    expect(RelinKeysObject).toBeInstanceOf(Object)
    expect(RelinKeysObject.constructor).toBe(Function)
    expect(RelinKeysObject.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = RelinKeysObject()
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('inject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('getIndex')
    expect(item).toHaveProperty('hasKey')
    expect(item).toHaveProperty('save')
    expect(item).toHaveProperty('saveArray')
    expect(item).toHaveProperty('load')
    expect(item).toHaveProperty('loadArray')
    expect(item).toHaveProperty('copy')
    expect(item).toHaveProperty('clone')
    expect(item).toHaveProperty('move')
  })
  test('It should have an instance', () => {
    const item = RelinKeysObject()
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = RelinKeysObject()
    const str = item.save()
    const newItem = RelinKeysObject()
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(str)
  })
  test('It should delete the old instance and inject', () => {
    const item = RelinKeysObject()
    const str = item.save()
    const newItem = RelinKeysObject()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(str)
  })
  test("It should delete it's instance", () => {
    const item = RelinKeysObject()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.save()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = RelinKeysObject()
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.size).toThrow(TypeError)
  })
  test('It should get the index of a key power', () => {
    const item = RelinKeysObject()
    const spyOn = jest.spyOn(item, 'getIndex')
    const index = item.getIndex(3)
    expect(spyOn).toHaveBeenCalledWith(3)
    expect(typeof index).toBe('number')
  })
  test('It should fail to get the index of a key power', () => {
    const item = RelinKeysObject()
    const spyOn = jest.spyOn(item, 'getIndex')
    expect(() => item.getIndex(1)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(1)
  })
  test('It should return if the key power exists', () => {
    const item = RelinKeysObject()
    const spyOn = jest.spyOn(item, 'hasKey')
    const index = item.hasKey(2)
    expect(spyOn).toHaveBeenCalledWith(2)
    expect(typeof index).toBe('boolean')
  })
  test('It should fail to return if the key power exists', () => {
    const item = RelinKeysObject()
    const spyOn = jest.spyOn(item, 'hasKey')
    expect(() => item.hasKey(1)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(1)
  })
  test('It should save to a string', () => {
    const item = RelinKeysObject()
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const item = RelinKeysObject()
    const spyOn = jest.spyOn(item, 'saveArray')
    const array = item.saveArray()
    expect(spyOn).toHaveBeenCalledWith()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const item = keyGenerator.genRelinKeys()
    const newItem = RelinKeysObject()
    const str = item.save()
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(context, str)
    expect(spyOn).toHaveBeenCalledWith(context, str)
    expect(newItem.save()).toEqual(str)
  })
  test('It should load from a typed array', () => {
    const item = keyGenerator.genRelinKeys()
    const newItem = RelinKeysObject()
    const array = item.saveArray()
    const spyOn = jest.spyOn(newItem, 'loadArray')
    newItem.loadArray(context, array)
    expect(spyOn).toHaveBeenCalledWith(context, array)
    expect(newItem.saveArray()).toEqual(array)
  })
  test('It should fail to load from a string', () => {
    const newItem = RelinKeysObject()
    const spyOn = jest.spyOn(newItem, 'load')
    expect(() =>
      newItem.load(
        context,
        'XqEAASUAAAAAAAAAAAAAAHicY2CgCHywj1vIwCCBRQYAOAcCRw=='
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      context,
      'XqEAASUAAAAAAAAAAAAAAHicY2CgCHywj1vIwCCBRQYAOAcCRw=='
    )
  })
  test('It should fail to load from a Uint8Array', () => {
    const newItem = RelinKeysObject()
    const spyOn = jest.spyOn(newItem, 'loadArray')
    expect(() =>
      newItem.loadArray(
        context,
        Uint8Array.from([
          93,
          161,
          0,
          1,
          27,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          120,
          156,
          99,
          103,
          128,
          0,
          0,
          0,
          64,
          0,
          8
        ])
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      context,
      Uint8Array.from([
        93,
        161,
        0,
        1,
        27,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        120,
        156,
        99,
        103,
        128,
        0,
        0,
        0,
        64,
        0,
        8
      ])
    )
  })
  test('It should copy another instance', () => {
    const item = keyGenerator.genRelinKeys()
    const newItem = RelinKeysObject()
    const spyOn = jest.spyOn(newItem, 'copy')
    newItem.copy(item)
    expect(spyOn).toHaveBeenCalledWith(item)
  })
  test('It should fail to copy another instance', () => {
    const item = keyGenerator.genRelinKeys()
    const newItem = RelinKeysObject()
    item.delete()
    const spyOn = jest.spyOn(newItem, 'copy')
    expect(() => newItem.copy(item)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(item)
  })
  test('It should clone itself', () => {
    const item = RelinKeysObject()
    const spyOn = jest.spyOn(item, 'clone')
    const newItem = item.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newItem).toBeDefined()
    expect(typeof newItem.constructor).toBe('function')
    expect(newItem).toBeInstanceOf(Object)
    expect(newItem.constructor).toBe(Object)
    expect(newItem.instance.constructor.name).toBe('RelinKeys')
  })
  test('It should fail to clone itself', () => {
    const item = RelinKeysObject()
    item.delete()
    const spyOn = jest.spyOn(item, 'clone')
    expect(() => item.clone()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should move another instance into itself and delete the old', () => {
    const item = keyGenerator.genRelinKeys()
    const newItem = RelinKeysObject()
    const spyOn = jest.spyOn(newItem, 'move')
    newItem.move(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(item.instance).toBeNull()
  })
  test('It should fail to move another instance into itself and delete the old', () => {
    const item = keyGenerator.genRelinKeys()
    const newItem = RelinKeysObject()
    item.delete()
    const spyOn = jest.spyOn(newItem, 'move')
    expect(() => newItem.move(item)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(item)
  })
})
