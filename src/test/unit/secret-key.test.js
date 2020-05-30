import { Seal, getLibrary } from '../../target/wasm/main'
import { SecretKey } from '../../components'

let Morfix = null
let parms = null
let context = null
let keyGenerator = null
let SecretKeyObject = null
beforeAll(async () => {
  Morfix = await Seal()
  const lib = getLibrary()
  SecretKeyObject = SecretKey(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  keyGenerator = Morfix.KeyGenerator(context)
})

describe('SecretKey', () => {
  test('It should be a factory', () => {
    expect(SecretKeyObject).toBeDefined()
    expect(typeof SecretKeyObject.constructor).toBe('function')
    expect(SecretKeyObject).toBeInstanceOf(Object)
    expect(SecretKeyObject.constructor).toBe(Function)
    expect(SecretKeyObject.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = SecretKeyObject()
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('inject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('save')
    expect(item).toHaveProperty('saveArray')
    expect(item).toHaveProperty('load')
    expect(item).toHaveProperty('loadArray')
    expect(item).toHaveProperty('copy')
    expect(item).toHaveProperty('clone')
    expect(item).toHaveProperty('move')
  })
  test('It should have an instance', () => {
    const item = SecretKeyObject()
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = SecretKeyObject()
    const str = item.save()
    const newItem = SecretKeyObject()
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(str)
  })
  test('It should delete the old instance and inject', () => {
    const item = SecretKeyObject()
    const str = item.save()
    const newItem = SecretKeyObject()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(str)
  })
  test("It should delete it's instance", () => {
    const item = SecretKeyObject()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.save()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = SecretKeyObject()
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
  })
  test('It should save to a string', () => {
    const item = SecretKeyObject()
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const item = SecretKeyObject()
    const spyOn = jest.spyOn(item, 'saveArray')
    const array = item.saveArray()
    expect(spyOn).toHaveBeenCalledWith()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const item = keyGenerator.secretKey()
    const newItem = SecretKeyObject()
    const str = item.save()
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(context, str)
    expect(spyOn).toHaveBeenCalledWith(context, str)
    expect(newItem.save()).toEqual(str)
  })
  test('It should load from a typed array', () => {
    const item = keyGenerator.secretKey()
    const newItem = SecretKeyObject()
    const array = item.saveArray()
    const spyOn = jest.spyOn(newItem, 'loadArray')
    newItem.loadArray(context, array)
    expect(spyOn).toHaveBeenCalledWith(context, array)
    expect(newItem.saveArray()).toEqual(array)
  })
  test('It should fail to load from a string', () => {
    const newItem = SecretKeyObject()
    const spyOn = jest.spyOn(newItem, 'load')
    expect(() =>
      newItem.load(
        context,
        'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      context,
      'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
    )
  })
  test('It should fail to load from a Uint8Array', () => {
    const newItem = SecretKeyObject()
    const spyOn = jest.spyOn(newItem, 'loadArray')
    expect(() =>
      newItem.loadArray(
        context,
        Uint8Array.from([
          94,
          161,
          16,
          3,
          5,
          1,
          0,
          0,
          40,
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
          96,
          160,
          8,
          124,
          176,
          143,
          91,
          40,
          192,
          204,
          10,
          100,
          73,
          160,
          201,
          0,
          0,
          57,
          170,
          2,
          95
        ])
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      context,
      Uint8Array.from([
        94,
        161,
        16,
        3,
        5,
        1,
        0,
        0,
        40,
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
        96,
        160,
        8,
        124,
        176,
        143,
        91,
        40,
        192,
        204,
        10,
        100,
        73,
        160,
        201,
        0,
        0,
        57,
        170,
        2,
        95
      ])
    )
  })
  test('It should copy another instance', () => {
    const item = keyGenerator.secretKey()
    const newItem = SecretKeyObject()
    const spyOn = jest.spyOn(newItem, 'copy')
    newItem.copy(item)
    expect(spyOn).toHaveBeenCalledWith(item)
  })
  test('It should fail to copy another instance', () => {
    const item = keyGenerator.secretKey()
    const newItem = SecretKeyObject()
    item.delete()
    const spyOn = jest.spyOn(newItem, 'copy')
    expect(() => newItem.copy(item)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(item)
  })
  test('It should clone itself', () => {
    const item = SecretKeyObject()
    const spyOn = jest.spyOn(item, 'clone')
    const newItem = item.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newItem).toBeDefined()
    expect(typeof newItem.constructor).toBe('function')
    expect(newItem).toBeInstanceOf(Object)
    expect(newItem.constructor).toBe(Object)
    expect(newItem.instance.constructor.name).toBe('SecretKey')
  })
  test('It should fail to clone itself', () => {
    const item = SecretKeyObject()
    item.delete()
    const spyOn = jest.spyOn(item, 'clone')
    expect(() => item.clone()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should move another instance into itself and delete the old', () => {
    const item = keyGenerator.secretKey()
    const newItem = SecretKeyObject()
    const spyOn = jest.spyOn(newItem, 'move')
    newItem.move(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(item.instance).toBeNull()
  })
  test('It should fail to move another instance into itself and delete the old', () => {
    const item = keyGenerator.secretKey()
    const newItem = SecretKeyObject()
    item.delete()
    const spyOn = jest.spyOn(newItem, 'move')
    expect(() => newItem.move(item)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(item)
  })
})
