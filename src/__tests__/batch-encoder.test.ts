import SEAL from '../index_wasm_node'
import { SEALLibrary } from 'implementation/seal'
import { Context } from 'implementation/context'
import { Modulus } from 'implementation/modulus'
import { Vector } from 'implementation/vector'
import { EncryptionParameters } from 'implementation/encryption-parameters'

let seal: SEALLibrary
let context: Context
let coeffModulus: Vector
let plainModulus: Modulus
let encParms: EncryptionParameters
beforeAll(async () => {
  seal = await SEAL()
  const schemeType = seal.SchemeType.BFV
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 1024
  const bitSizes = Int32Array.from([27])
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.Create(polyModulusDegree, bitSizes)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  encParms = seal.EncryptionParameters(schemeType)
  encParms.setPolyModulusDegree(polyModulusDegree)
  encParms.setCoeffModulus(coeffModulus)
  encParms.setPlainModulus(plainModulus)
  context = seal.Context(encParms, true, securityLevel)
})

describe('BatchEncoder', () => {
  test('It should be a factory', () => {
    expect(seal.BatchEncoder).toBeDefined()
    expect(typeof seal.BatchEncoder.constructor).toBe('function')
    expect(seal.BatchEncoder).toBeInstanceOf(Object)
    expect(seal.BatchEncoder.constructor).toBe(Function)
    expect(seal.BatchEncoder.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.BatchEncoder)
    Constructor(context)
    expect(Constructor).toBeCalledWith(context)
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(seal.BatchEncoder)
    expect(() => Constructor(null as any)).toThrow()
    expect(Constructor).toBeCalledWith(null)
  })
  test('It should have properties', () => {
    const item = seal.BatchEncoder(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encode')
    expect(item).toHaveProperty('decode')
    expect(item).toHaveProperty('slotCount')
  })
  test('It should have an instance', () => {
    const item = seal.BatchEncoder(context)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.BatchEncoder(context)
    const newItem = seal.BatchEncoder(context)
    newItem.delete()
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(newItem.instance)
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.BatchEncoder(context)
    const newItem = seal.BatchEncoder(context)
    const spyOn = jest.spyOn(newItem, 'unsafeInject')
    newItem.unsafeInject(item.instance)
    expect(spyOn).toHaveBeenCalledWith(newItem.instance)
  })
  test("It should delete it's instance", () => {
    const item = seal.BatchEncoder(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
  })
  test('It should skip deleting twice', () => {
    const item = seal.BatchEncoder(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
  })
  test('It should encode an int32 array to a plaintext destination', () => {
    const item = seal.BatchEncoder(context)
    const arr = Int32Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => -i)
    )
    const plain = seal.PlainText()
    const spyOn = jest.spyOn(item, 'encode')
    item.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode an int32 array and return a plaintext', () => {
    const item = seal.BatchEncoder(context)
    const arr = Int32Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => -i)
    )
    const spyOn = jest.spyOn(item, 'encode')
    const plain = item.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
  })
  test('It should encode an int64 array to a plaintext destination', () => {
    const item = seal.BatchEncoder(context)
    const arr = BigInt64Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => BigInt(-i))
    )
    const plain = seal.PlainText()
    const spyOn = jest.spyOn(item, 'encode')
    item.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode an int64 array and return a plaintext', () => {
    const item = seal.BatchEncoder(context)
    const arr = BigInt64Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => BigInt(-i))
    )
    const spyOn = jest.spyOn(item, 'encode')
    const plain = item.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
  })
  test('It should encode an uint32 array to a plaintext destination', () => {
    const item = seal.BatchEncoder(context)
    const arr = Uint32Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => i)
    )
    const plain = seal.PlainText()
    const spyOn = jest.spyOn(item, 'encode')
    item.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode an uint32 array and return a plaintext', () => {
    const item = seal.BatchEncoder(context)
    const arr = Uint32Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => i)
    )
    const spyOn = jest.spyOn(item, 'encode')
    const plain = item.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
  })
  test('It should encode an uint64 array to a plaintext destination', () => {
    const item = seal.BatchEncoder(context)
    const arr = BigUint64Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => BigInt(i))
    )
    const plain = seal.PlainText()
    const spyOn = jest.spyOn(item, 'encode')
    item.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode an uint64 array and return a plaintext', () => {
    const item = seal.BatchEncoder(context)
    const arr = BigUint64Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => BigInt(i))
    )
    const spyOn = jest.spyOn(item, 'encode')
    const plain = item.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
  })
  test('It should fail on unsupported array type', () => {
    const item = seal.BatchEncoder(context)
    const arr = Float64Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => i)
    )
    const spyOn = jest.spyOn(item, 'encode')
    expect(() => item.encode(arr as any)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr)
  })
  test('It should fail on encoding bad data', () => {
    const item = seal.BatchEncoder(context)
    const arr = Int32Array.from(
      Array.from({ length: item.slotCount * 2 }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(item, 'encode')
    expect(() => item.encode(arr)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr)
  })
  test('It should decode an int32 array', () => {
    const item = seal.BatchEncoder(context)
    const arr = Int32Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => -i)
    )
    const plain = seal.PlainText()
    item.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'decode')
    const decoded = item.decode(plain, true)
    expect(spyOn).toHaveBeenCalledWith(plain, true)
    expect(decoded).toEqual(arr)
  })
  test('It should decode an int64 array', () => {
    const item = seal.BatchEncoder(context)
    const arr = BigInt64Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => BigInt(-i))
    )
    const plain = seal.PlainText()
    item.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'decodeBigInt')
    const decoded = item.decodeBigInt(plain, true)
    expect(spyOn).toHaveBeenCalledWith(plain, true)
    expect(decoded).toEqual(arr)
  })
  test('It should decode an uint32 array', () => {
    const item = seal.BatchEncoder(context)
    const arr = Uint32Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => i)
    )
    const plain = seal.PlainText()
    item.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'decode')
    const decoded = item.decode(plain, false)
    expect(spyOn).toHaveBeenCalledWith(plain, false)
    expect(decoded).toEqual(arr)
  })
  test('It should decode a uint64 array', () => {
    const item = seal.BatchEncoder(context)
    const arr = BigUint64Array.from(
      Array.from({ length: item.slotCount }).map((_, i) => BigInt(i))
    )
    const plain = seal.PlainText()
    item.encode(arr, plain)
    const spyOn = jest.spyOn(item, 'decodeBigInt')
    const decoded = item.decodeBigInt(plain, false)
    expect(spyOn).toHaveBeenCalledWith(plain, false)
    expect(decoded).toEqual(arr)
  })
})
