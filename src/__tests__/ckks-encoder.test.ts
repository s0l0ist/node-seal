import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from 'implementation/seal'
import { Context } from 'implementation/context'
import { Vector } from 'implementation/vector'
import { EncryptionParameters } from 'implementation/encryption-parameters'
import { BatchEncoder } from 'implementation/batch-encoder'
import { CKKSEncoder } from 'implementation/ckks-encoder'
import { Modulus } from 'implementation/modulus'
import { PlainText } from 'implementation/plain-text'

let seal: SEALLibrary
let bfvContext: Context
let coeffModulus: Vector
let plainModulus: Modulus
let bfvEncParms: EncryptionParameters
let batchEncoder: BatchEncoder

let ckksContext: Context
let ckksEncParms: EncryptionParameters
let ckksEncoder: CKKSEncoder
beforeAll(async () => {
  seal = await SEAL()
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 4096
  const bitSizes = Int32Array.from([46, 16, 46])
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.Create(polyModulusDegree, bitSizes)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.BFV)
  bfvEncParms.setPolyModulusDegree(polyModulusDegree)
  bfvEncParms.setCoeffModulus(coeffModulus)
  bfvEncParms.setPlainModulus(plainModulus)
  bfvContext = seal.Context(bfvEncParms, true, securityLevel)
  batchEncoder = seal.BatchEncoder(bfvContext)

  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.CKKS)
  ckksEncParms.setPolyModulusDegree(polyModulusDegree)
  ckksEncParms.setCoeffModulus(coeffModulus)
  ckksContext = seal.Context(ckksEncParms, true, securityLevel)
  ckksEncoder = seal.CKKSEncoder(ckksContext)
})

describe('CKKSEncoder', () => {
  test('It should be a factory', () => {
    expect(seal.CKKSEncoder).toBeDefined()
    expect(typeof seal.CKKSEncoder.constructor).toBe('function')
    expect(seal.CKKSEncoder).toBeInstanceOf(Object)
    expect(seal.CKKSEncoder.constructor).toBe(Function)
    expect(seal.CKKSEncoder.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.CKKSEncoder)
    Constructor(ckksContext)
    expect(Constructor).toBeCalledWith(ckksContext)
  })
  test('It should have properties', () => {
    const item = seal.CKKSEncoder(ckksContext)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encode')
    expect(item).toHaveProperty('decode')
    expect(item).toHaveProperty('slotCount')
  })
  test('It should have an instance (ckks)', () => {
    const item = seal.CKKSEncoder(ckksContext)
    expect(item.instance).toBeDefined()
  })
  test('It should inject', () => {
    const item = seal.CKKSEncoder(ckksContext)
    item.delete()
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(ckksEncoder.instance)
    expect(spyOn).toHaveBeenCalledWith(ckksEncoder.instance)
    expect(item.slotCount).toEqual(ckksEncoder.slotCount)
  })
  test('It should delete the old instance and inject', () => {
    const item = seal.CKKSEncoder(ckksContext)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(ckksEncoder.instance)
    expect(spyOn).toHaveBeenCalledWith(ckksEncoder.instance)
    expect(item.slotCount).toEqual(ckksEncoder.slotCount)
  })
  test("It should delete it's instance", () => {
    const item = seal.CKKSEncoder(ckksContext)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
    expect(() => item.slotCount).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = seal.CKKSEncoder(ckksContext)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeUndefined()
    expect(() => item.slotCount).toThrow(TypeError)
  })
  test('It should encode an float64 array to a plain destination', () => {
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }).map(
      (_, i) => i
    )
    const plain = seal.PlainText()
    const spyOn = jest.spyOn(ckksEncoder, 'encode')
    ckksEncoder.encode(arr, Math.pow(2, 20), plain)
    expect(spyOn).toHaveBeenCalledWith(arr, Math.pow(2, 20), plain)
  })
  test('It should encode an float64 array and return plaintext', () => {
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const spyOn = jest.spyOn(ckksEncoder, 'encode')
    const plain = ckksEncoder.encode(arr, Math.pow(2, 20)) as PlainText
    expect(spyOn).toHaveBeenCalledWith(arr, Math.pow(2, 20))
    expect(plain).toBeDefined()
    expect(typeof plain.constructor).toBe('function')
    expect(plain).toBeInstanceOf(Object)
    expect(plain.constructor).toBe(Object)
    expect(plain.instance.constructor.name).toBe('Plaintext')
  })
  test('It should fail to encode an invalid array type', () => {
    const arr = Int32Array.from({ length: ckksEncoder.slotCount }).map(
      (_, i) => i
    )
    const spyOn = jest.spyOn(ckksEncoder, 'encode')
    expect(() =>
      ckksEncoder.encode((arr as unknown) as Float64Array, Math.pow(2, 20))
    ).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr, Math.pow(2, 20))
  })
  test('It should decode an float64 array', () => {
    const arr = Float64Array.from(
      { length: ckksEncoder.slotCount },
      (_, i) => i
    )
    const plain = seal.PlainText()
    ckksEncoder.encode(arr, Math.pow(2, 20), plain)
    const spyOn = jest.spyOn(ckksEncoder, 'decode')
    const decoded = ckksEncoder.decode(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(decoded.map(x => 0 + Math.round(x))).toEqual(
      arr.map(x => 0 + Math.round(x))
    )
  })
  test('It should fail to decode an float64 array', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }).map(
      (_, i) => i
    )
    const plain = seal.PlainText()
    batchEncoder.encode(arr, plain)
    const spyOn = jest.spyOn(ckksEncoder, 'decode')
    expect(() => ckksEncoder.decode(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
})
