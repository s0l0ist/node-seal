import SEAL from '../index_wasm_node'
import { SEALLibrary } from 'implementation/seal'
import { Context } from 'implementation/context'
import { Modulus } from 'implementation/modulus'
import { Vector } from 'implementation/vector'
import { EncryptionParameters } from 'implementation/encryption-parameters'
import { BatchEncoder } from 'implementation/batch-encoder'
import { KeyGenerator } from 'implementation/key-generator'

let seal: SEALLibrary
let bfvContext: Context
let coeffModulus: Vector
let plainModulus: Modulus
let bfvEncParms: EncryptionParameters
let batchEncoder: BatchEncoder
let bfvKeyGenerator: KeyGenerator

beforeAll(async () => {
  seal = await SEAL()
  const polyModulusDegree = 4096
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.BFVDefault(polyModulusDegree)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
  bfvEncParms.setPolyModulusDegree(polyModulusDegree)
  bfvEncParms.setCoeffModulus(coeffModulus)
  bfvEncParms.setPlainModulus(plainModulus)
  bfvContext = seal.Context(bfvEncParms)
  batchEncoder = seal.BatchEncoder(bfvContext)
  bfvKeyGenerator = seal.KeyGenerator(bfvContext)
})

describe('GaloisKeys', () => {
  test('It should be a factory', () => {
    expect(seal.GaloisKeys).toBeDefined()
    expect(typeof seal.GaloisKeys.constructor).toBe('function')
    expect(seal.GaloisKeys).toBeInstanceOf(Object)
    expect(seal.GaloisKeys.constructor).toBe(Function)
    expect(seal.GaloisKeys.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = seal.GaloisKeys()
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
    const item = seal.GaloisKeys()
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.GaloisKeys()
    const str = item.save()
    const newItem = seal.GaloisKeys()
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(str)
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.GaloisKeys()
    const str = item.save()
    const newItem = seal.GaloisKeys()
    const spyOn = jest.spyOn(newItem, 'inject')
    newItem.inject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(item.instance)
    expect(newItem.save()).toEqual(str)
  })
  test("It should delete it's instance", () => {
    const item = seal.GaloisKeys()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.save()).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = seal.GaloisKeys()
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.size).toThrow(TypeError)
  })
  test('It should get the index of a galois element', () => {
    const item = seal.GaloisKeys()
    const spyOn = jest.spyOn(item, 'getIndex')
    const index = item.getIndex(5)
    expect(spyOn).toHaveBeenCalledWith(5)
    expect(typeof index).toBe('number')
  })
  test('It should fail to get the index of a galois element', () => {
    const item = seal.GaloisKeys()
    const spyOn = jest.spyOn(item, 'getIndex')
    expect(() => item.getIndex(-1)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(-1)
  })
  test('It should return if the galois element exists', () => {
    const item = seal.GaloisKeys()
    const spyOn = jest.spyOn(item, 'hasKey')
    const index = item.hasKey(3)
    expect(spyOn).toHaveBeenCalledWith(3)
    expect(typeof index).toBe('boolean')
  })
  test('It should fail to return if the galois element exists', () => {
    const item = seal.GaloisKeys()
    const spyOn = jest.spyOn(item, 'hasKey')
    expect(() => item.hasKey(-1)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(-1)
  })
  test('It should save to a string', () => {
    const item = seal.GaloisKeys()
    const spyOn = jest.spyOn(item, 'save')
    const str = item.save()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const item = seal.GaloisKeys()
    const spyOn = jest.spyOn(item, 'saveArray')
    const array = item.saveArray()
    expect(spyOn).toHaveBeenCalledWith()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const item = bfvKeyGenerator.galoisKeysLocal()
    const newItem = seal.GaloisKeys()
    const str = item.save()
    const spyOn = jest.spyOn(newItem, 'load')
    newItem.load(bfvContext, str)
    expect(spyOn).toHaveBeenCalledWith(bfvContext, str)
    expect(newItem.save()).toEqual(str)
  })
  test('It should load from a typed array', () => {
    const item = bfvKeyGenerator.galoisKeysLocal()
    const newItem = seal.GaloisKeys()
    const array = item.saveArray()
    const spyOn = jest.spyOn(newItem, 'loadArray')
    newItem.loadArray(bfvContext, array)
    expect(spyOn).toHaveBeenCalledWith(bfvContext, array)
    expect(newItem.saveArray()).toEqual(array)
  })
  test('It should fail to load from a string', () => {
    const newItem = seal.GaloisKeys()
    const spyOn = jest.spyOn(newItem, 'load')
    expect(() =>
      newItem.load(
        bfvContext,
        'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
      )
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(
      bfvContext,
      'XqEQAwUBAAAoAAAAAAAAAHicY2CgCHywj1sowMwKZEmgyQAAOaoCXw=='
    )
  })
  test('It should fail to load from a Uint8Array', () => {
    const newItem = seal.GaloisKeys()
    const spyOn = jest.spyOn(newItem, 'loadArray')
    expect(() =>
      newItem.loadArray(
        bfvContext,
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
      bfvContext,
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
    const item = bfvKeyGenerator.galoisKeysLocal()
    const newItem = seal.GaloisKeys()
    const spyOn = jest.spyOn(newItem, 'copy')
    newItem.copy(item)
    expect(spyOn).toHaveBeenCalledWith(item)
  })
  test('It should fail to copy another instance', () => {
    const item = bfvKeyGenerator.galoisKeysLocal()
    const newItem = seal.GaloisKeys()
    item.delete()
    const spyOn = jest.spyOn(newItem, 'copy')
    expect(() => newItem.copy(item)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(item)
  })
  test('It should clone itself', () => {
    const item = seal.GaloisKeys()
    const spyOn = jest.spyOn(item, 'clone')
    const newItem = item.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newItem).toBeDefined()
    expect(typeof newItem.constructor).toBe('function')
    expect(newItem).toBeInstanceOf(Object)
    expect(newItem.constructor).toBe(Object)
    expect(newItem.instance.constructor.name).toBe('GaloisKeys')
  })
  test('It should fail to clone itself', () => {
    const item = seal.GaloisKeys()
    item.delete()
    const spyOn = jest.spyOn(item, 'clone')
    expect(() => item.clone()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should move another instance into itself and delete the old', () => {
    const item = bfvKeyGenerator.galoisKeysLocal()
    const newItem = seal.GaloisKeys()
    const spyOn = jest.spyOn(newItem, 'move')
    newItem.move(item)
    expect(spyOn).toHaveBeenCalledWith(item)
    expect(item.instance).toBeNull()
  })
  test('It should fail to move another instance into itself and delete the old', () => {
    const item = bfvKeyGenerator.galoisKeysLocal()
    const newItem = seal.GaloisKeys()
    item.delete()
    const spyOn = jest.spyOn(newItem, 'move')
    expect(() => newItem.move(item)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(item)
  })
})
