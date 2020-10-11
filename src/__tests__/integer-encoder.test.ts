import SEAL from '../index_throws_wasm_node'
import { SEALLibrary } from 'implementation/seal'
import { Context } from 'implementation/context'
import { Modulus } from 'implementation/modulus'
import { Vector } from 'implementation/vector'
import { EncryptionParameters } from 'implementation/encryption-parameters'
import { IntegerEncoder } from 'implementation/integer-encoder'
import { PlainText } from 'implementation/plain-text'

let seal: SEALLibrary
let context: Context
let coeffModulus: Vector
let plainModulus: Modulus
let encParms: EncryptionParameters
let encoder: IntegerEncoder
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
  encoder = seal.IntegerEncoder(context)
})

describe('IntegerEncoder', () => {
  test('It should be a factory', () => {
    expect(seal.IntegerEncoder).toBeDefined()
    expect(typeof seal.IntegerEncoder.constructor).toBe('function')
    expect(seal.IntegerEncoder).toBeInstanceOf(Object)
    expect(seal.IntegerEncoder.constructor).toBe(Function)
    expect(seal.IntegerEncoder.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.IntegerEncoder)
    Constructor(context)
    expect(Constructor).toBeCalledWith(context)
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(seal.IntegerEncoder)
    expect(() => Constructor((null as unknown) as Context)).toThrow()
    expect(Constructor).toBeCalledWith(null)
  })
  test('It should have properties', () => {
    const item = seal.IntegerEncoder(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encodeInt32')
    expect(item).toHaveProperty('encodeUint32')
    expect(item).toHaveProperty('decodeInt32')
    expect(item).toHaveProperty('decodeUint32')
  })
  test('It should have an instance', () => {
    const item = seal.IntegerEncoder(context)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.IntegerEncoder(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.instance).toBeDefined()
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.IntegerEncoder(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.instance).toBeDefined()
  })
  test("It should delete it's instance", () => {
    const item = seal.IntegerEncoder(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
    expect(() => item.encodeInt32(4)).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = seal.IntegerEncoder(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
  })
  test('It should encode an int32 to a plaintext destination', () => {
    const plain = seal.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeInt32')
    encoder.encodeInt32(-5, plain)
    expect(spyOn).toHaveBeenCalledWith(-5, plain)
    const decoded = encoder.decodeInt32(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should encode an int32 and return a plaintext', () => {
    const spyOn = jest.spyOn(encoder, 'encodeInt32')
    const plain = encoder.encodeInt32(-5) as PlainText
    expect(spyOn).toHaveBeenCalledWith(-5)
    const decoded = encoder.decodeInt32(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should fail to encode an int32', () => {
    const plain = seal.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeInt32')
    expect(() => encoder.encodeInt32(Number.MAX_SAFE_INTEGER, plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER, plain)
  })

  test('It should encode a uint32 to a plaintext destination', () => {
    const plain = seal.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeUint32')
    encoder.encodeUint32(5, plain)
    expect(spyOn).toHaveBeenCalledWith(5, plain)
    const decoded = encoder.decodeUint32(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should encode a uint32 and return a plaintext', () => {
    const spyOn = jest.spyOn(encoder, 'encodeUint32')
    const plain = encoder.encodeUint32(5) as PlainText
    expect(spyOn).toHaveBeenCalledWith(5)
    const decoded = encoder.decodeUint32(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should fail to encode a uint32', () => {
    const plain = seal.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeUint32')
    expect(() => encoder.encodeUint32(Number.MAX_SAFE_INTEGER, plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(Number.MAX_SAFE_INTEGER, plain)
  })

  test('It should decode an int32', () => {
    const plain = seal.PlainText()
    encoder.encodeInt32(-5, plain)
    const spyOn = jest.spyOn(encoder, 'decodeInt32')
    const decoded = encoder.decodeInt32(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should fail to decode an int32', () => {
    const plain = seal.PlainText()
    encoder.encodeUint32(4294967295, plain)
    const spyOn = jest.spyOn(encoder, 'decodeInt32')
    expect(() => encoder.decodeInt32(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
  test('It should decode a uint32', () => {
    const plain = seal.PlainText()
    encoder.encodeUint32(5, plain)
    const spyOn = jest.spyOn(encoder, 'decodeUint32')
    const decoded = encoder.decodeUint32(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should fail to decode a uint32', () => {
    const plain = seal.PlainText()
    encoder.encodeInt32(-5, plain)
    const spyOn = jest.spyOn(encoder, 'decodeUint32')
    expect(() => encoder.decodeUint32(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
})
