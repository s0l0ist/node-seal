import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from 'implementation/seal'
import { EncryptionParameters } from 'implementation/encryption-parameters'
import { Context } from 'implementation/context'
import { KeyGenerator } from 'implementation/key-generator'
let seal: SEALLibrary
let parms: EncryptionParameters
let context: Context
let keyGenerator: KeyGenerator
beforeAll(async () => {
  seal = await SEAL()
  parms = seal.EncryptionParameters(seal.SchemeType.bfv)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    seal.CoeffModulus.BFVDefault(4096, seal.SecurityLevel.tc128)
  )
  parms.setPlainModulus(seal.PlainModulus.Batching(4096, 20))
  context = seal.Context(parms, true, seal.SecurityLevel.tc128)
  keyGenerator = seal.KeyGenerator(context)
})

describe('SecretKey', () => {
  test('It should be a factory', () => {
    expect(seal.SecretKey).toBeDefined()
    expect(typeof seal.SecretKey.constructor).toBe('function')
    expect(seal.SecretKey).toBeInstanceOf(Object)
    expect(seal.SecretKey.constructor).toBe(Function)
    expect(seal.SecretKey.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = seal.SecretKey()
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
    const item = seal.SecretKey()
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.SecretKey()
    const str = item.save()
    const newItem = seal.SecretKey()
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(str)
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.SecretKey()
    const str = item.save()
    const newItem = seal.SecretKey()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(str)
  })
  test("It should delete it's instance", () => {
    const item = seal.SecretKey()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
    expect(() => item.save()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = seal.SecretKey()
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
  })
  test('It should save to a string', () => {
    const item = seal.SecretKey()
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const item = seal.SecretKey()
    const spyOn = jest.spyOn(item, 'saveArray')
    const array = item.saveArray()
    expect(spyOn).toHaveBeenCalledWith()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const item = keyGenerator.secretKey()
    const newItem = seal.SecretKey()
    const str = item.save()
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(context, str)
    expect(spyOn).toHaveBeenCalledWith(context, str)
    expect(newItem.save()).toEqual(str)
  })
  test('It should load from a typed array', () => {
    const item = keyGenerator.secretKey()
    const newItem = seal.SecretKey()
    const array = item.saveArray()
    const spyOn = jest.spyOn(newItem, 'loadArray')
    newItem.loadArray(context, array)
    expect(spyOn).toHaveBeenCalledWith(context, array)
    expect(newItem.saveArray()).toEqual(array)
  })
  test('It should fail to load from a string', () => {
    const newItem = seal.SecretKey()
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
    const newItem = seal.SecretKey()
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
    const newItem = seal.SecretKey()
    const spyOn = jest.spyOn(newItem, 'copy')
    newItem.copy(item)
    expect(spyOn).toHaveBeenCalledWith(item)
  })
  test('It should fail to copy another instance', () => {
    const item = keyGenerator.secretKey()
    const newItem = seal.SecretKey()
    item.delete()
    const spyOn = jest.spyOn(newItem, 'copy')
    expect(() => newItem.copy(item)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(item)
  })
  test('It should clone itself', () => {
    const item = seal.SecretKey()
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
    const item = seal.SecretKey()
    item.delete()
    const spyOn = jest.spyOn(item, 'clone')
    expect(() => item.clone()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should move another instance into itself and delete the old', () => {
    const item = keyGenerator.secretKey()
    const newItem = seal.SecretKey()
    const spyOn = jest.spyOn(newItem, 'move')
    newItem.move(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(item.instance).toBeUndefined()
  })
  test('It should fail to move another instance into itself and delete the old', () => {
    const item = keyGenerator.secretKey()
    const newItem = seal.SecretKey()
    item.delete()
    const spyOn = jest.spyOn(newItem, 'move')
    expect(() => newItem.move(item)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(item)
  })
})
