import SEAL from '../throws_wasm_node_umd'
import { SEALLibrary } from '../implementation/seal'
import { Context } from '../implementation/context'
import { Modulus } from '../implementation/modulus'
import { Vector } from '../implementation/vector'
import { EncryptionParameters } from '../implementation/encryption-parameters'
import { BatchEncoder } from '../implementation/batch-encoder'
import { CKKSEncoder } from '../implementation/ckks-encoder'
import { Evaluator } from '../implementation/evaluator'
import { PlainText } from '../implementation/plain-text'

let seal: SEALLibrary
let bfvContext: Context
let coeffModulus: Vector
let plainModulus: Modulus
let bfvEncParms: EncryptionParameters
let batchEncoder: BatchEncoder
let bfvEvaluator: Evaluator

let ckksContext: Context
let ckksEncParms: EncryptionParameters
let ckksEncoder: CKKSEncoder
beforeAll(async () => {
  seal = await SEAL()
  const securityLevel = seal.SecurityLevel.tc128
  const polyModulusDegree = 1024
  const bitSizes = Int32Array.from([27])
  const bitSize = 20
  coeffModulus = seal.CoeffModulus.Create(polyModulusDegree, bitSizes)
  plainModulus = seal.PlainModulus.Batching(polyModulusDegree, bitSize)
  bfvEncParms = seal.EncryptionParameters(seal.SchemeType.bfv)
  bfvEncParms.setPolyModulusDegree(polyModulusDegree)
  bfvEncParms.setCoeffModulus(coeffModulus)
  bfvEncParms.setPlainModulus(plainModulus)
  bfvContext = seal.Context(bfvEncParms, true, securityLevel)
  batchEncoder = seal.BatchEncoder(bfvContext)
  bfvEvaluator = seal.Evaluator(bfvContext)

  ckksEncParms = seal.EncryptionParameters(seal.SchemeType.ckks)
  ckksEncParms.setPolyModulusDegree(polyModulusDegree)
  ckksEncParms.setCoeffModulus(coeffModulus)
  ckksContext = seal.Context(ckksEncParms, true, securityLevel)
  ckksEncoder = seal.CKKSEncoder(ckksContext)
})

describe('PlainText', () => {
  test('It should be a factory', () => {
    expect(seal.PlainText).toBeDefined()
    expect(typeof seal.PlainText.constructor).toBe('function')
    expect(seal.PlainText).toBeInstanceOf(Object)
    expect(seal.PlainText.constructor).toBe(Function)
    expect(seal.PlainText.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(seal.PlainText)
    Constructor()
    expect(Constructor).toBeCalledWith()
  })
  test('It should construct an instance with a coeffCount', () => {
    const Constructor = jest.fn(seal.PlainText)
    Constructor({ coeffCount: 2 })
    expect(Constructor).toBeCalledWith({ coeffCount: 2 })
  })
  test('It should construct an instance with a coeffCount, capacity', () => {
    const Constructor = jest.fn(seal.PlainText)
    Constructor({ capacity: 2, coeffCount: 2 })
    expect(Constructor).toBeCalledWith({ capacity: 2, coeffCount: 2 })
  })
  test('It should fail to construct an instance from invalid parameters', () => {
    const Constructor = jest.fn(seal.PlainText)
    expect(() => Constructor({ coeffCount: -1, capacity: 2 })).toThrow()
    expect(Constructor).toBeCalledWith({
      coeffCount: -1,
      capacity: 2
    })
  })
  test('It should fail to construct an instance from bad parameters', () => {
    const Constructor = jest.fn(seal.PlainText)
    expect(() => Constructor({ capacity: 2 })).toThrow()
    expect(Constructor).toBeCalledWith({ capacity: 2 })
  })
  test('It should have properties', () => {
    const plainText = seal.PlainText()
    // Test properties
    expect(plainText).toHaveProperty('instance')
    expect(plainText).toHaveProperty('unsafeInject')
    expect(plainText).toHaveProperty('delete')
    expect(plainText).toHaveProperty('reserve')
    expect(plainText).toHaveProperty('shrinkToFit')
    expect(plainText).toHaveProperty('release')
    expect(plainText).toHaveProperty('resize')
    expect(plainText).toHaveProperty('setZero')
    expect(plainText).toHaveProperty('isZero')
    expect(plainText).toHaveProperty('capacity')
    expect(plainText).toHaveProperty('coeffCount')
    expect(plainText).toHaveProperty('significantCoeffCount')
    expect(plainText).toHaveProperty('nonzeroCoeffCount')
    expect(plainText).toHaveProperty('toPolynomial')
    expect(plainText).toHaveProperty('isNttForm')
    expect(plainText).toHaveProperty('scale')
    expect(plainText).toHaveProperty('setScale')
    expect(plainText).toHaveProperty('pool')
    expect(plainText).toHaveProperty('save')
    expect(plainText).toHaveProperty('saveArray')
    expect(plainText).toHaveProperty('load')
    expect(plainText).toHaveProperty('loadArray')
    expect(plainText).toHaveProperty('copy')
    expect(plainText).toHaveProperty('clone')
    expect(plainText).toHaveProperty('move')
  })
  test('It should have an instance', () => {
    const plainText = seal.PlainText()
    expect(plainText.instance).toBeDefined()
  })
  test('It should inject', () => {
    const plainText = seal.PlainText()
    const newPlainText = seal.PlainText()
    newPlainText.delete()
    const spyOn = jest.spyOn(newPlainText, 'unsafeInject')
    newPlainText.unsafeInject(plainText.instance)
    expect(spyOn).toHaveBeenCalledWith(plainText.instance)
  })
  test('It should delete the old instance and inject', () => {
    const plainText = seal.PlainText()
    const newPlainText = seal.PlainText()
    const spyOn = jest.spyOn(newPlainText, 'unsafeInject')
    newPlainText.unsafeInject(plainText.instance)
    expect(spyOn).toHaveBeenCalledWith(plainText.instance)
  })
  test("It should delete it's instance", () => {
    const plainText = seal.PlainText()
    const spyOn = jest.spyOn(plainText, 'delete')
    plainText.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(plainText.instance).toBeUndefined()
  })
  test('It should skip deleting twice', () => {
    const plainText = seal.PlainText()
    plainText.delete()
    const spyOn = jest.spyOn(plainText, 'delete')
    plainText.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(plainText.instance).toBeUndefined()
  })
  test('It should reserve memory', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'reserve')
    plainText.reserve(batchEncoder.slotCount * 2)
    expect(spyOn).toHaveBeenCalledWith(batchEncoder.slotCount * 2)
  })
  test('It should fail to reserve memory', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'reserve')
    expect(() => plainText.reserve(-2)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(-2)
  })
  test('It should shrink', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    plainText.reserve(batchEncoder.slotCount * 2)
    const spyOn = jest.spyOn(plainText, 'shrinkToFit')
    plainText.shrinkToFit()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should release allocated memory', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'release')
    plainText.release()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should resize', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'resize')
    plainText.resize(batchEncoder.slotCount * 2)
    expect(spyOn).toHaveBeenCalledWith(batchEncoder.slotCount * 2)
  })
  test('It should fail to resize', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'resize')
    expect(() => plainText.resize(-2)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(-2)
  })
  test('It should set to zero', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'setZero')
    plainText.setZero()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should return if plaintext is zero', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 0)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    expect(typeof plainText.isZero).toBe('boolean')
  })
  test('It should return the capacity of the current allocation', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    expect(typeof plainText.capacity).toBe('number')
  })
  test('It should return the coeff count', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    expect(typeof plainText.coeffCount).toBe('number')
  })
  test('It should return the significant coeff count', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    expect(typeof plainText.significantCoeffCount).toBe('number')
  })
  test('It should return the non-zero coeff count', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    expect(typeof plainText.nonzeroCoeffCount).toBe('number')
  })
  test('It should return the polynomial string', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, (_, i) => i)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'toPolynomial')
    const str = plainText.toPolynomial()
    expect(spyOn).toHaveBeenCalledWith()
    expect(typeof str).toBe('string')
  })
  test('It should fail to return the polynomial string', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, (_, i) => i)
    const plainText = seal.PlainText()
    const parmsId = bfvContext.firstParmsId
    batchEncoder.encode(arr, plainText)
    bfvEvaluator.plainTransformToNtt(plainText, parmsId, plainText)
    const spyOn = jest.spyOn(plainText, 'toPolynomial')
    expect(() => plainText.toPolynomial()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should return if in NTT form', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    expect(typeof plainText.isNttForm).toBe('boolean')
  })
  test('It should return the scale (ckks)', () => {
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    ckksEncoder.encode(arr, Math.pow(2, 20), plainText)
    expect(typeof plainText.scale).toBe('number')
  })
  test('It should set the scale (ckks)', () => {
    const arr = Float64Array.from({ length: ckksEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    const scale1 = Math.pow(2, 20)
    const scale2 = 2097152.32
    ckksEncoder.encode(arr, scale1, plainText)
    expect(plainText.scale).toEqual(scale1)
    plainText.setScale(scale2)
    expect(plainText.scale).toEqual(scale2)
  })
  test('It should return a parms id type', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const parms = plainText.parmsId
    const values = parms.values
    expect(values.constructor).toBe(BigUint64Array)
    expect(values).toEqual(
      BigUint64Array.from([BigInt('0'), BigInt('0'), BigInt('0'), BigInt('0')])
    )
  })
  test('It should return a parms id type (ntt)', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    const parmsId = bfvContext.firstParmsId
    batchEncoder.encode(arr, plainText)
    bfvEvaluator.plainTransformToNtt(plainText, parmsId, plainText)
    const parms = plainText.parmsId
    const values = parms.values
    expect(values.constructor).toBe(BigUint64Array)
    expect(values).toEqual(
      BigUint64Array.from([
        BigInt('17476483468957856337'),
        BigInt('2996125235791699026'),
        BigInt('16665771614849413640'),
        BigInt('17359866543464280799')
      ])
    )
  })
  test('It should return the currently used memory pool handle', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const pool = plainText.pool
    expect(pool.constructor.name).toBe('MemoryPoolHandle')
  })
  test('It should save to a string', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'save')
    const str = plainText.save()
    expect(spyOn).toHaveBeenCalled()
    expect(typeof str).toBe('string')
  })
  test('It should save to an array', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'saveArray')
    const array = plainText.saveArray()
    expect(spyOn).toHaveBeenCalled()
    expect(array.constructor).toBe(Uint8Array)
  })
  test('It should load from a string', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const str = plainText.save()
    plainText.delete()
    const newPlainText = seal.PlainText()
    const spyOn = jest.spyOn(newPlainText, 'load')
    newPlainText.load(bfvContext, str)
    expect(spyOn).toHaveBeenCalledWith(bfvContext, str)
  })
  test('It should load from a typed array', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const array = plainText.saveArray()
    plainText.delete()
    const newPlainText = seal.PlainText()
    const spyOn = jest.spyOn(newPlainText, 'loadArray')
    newPlainText.loadArray(bfvContext, array)
    expect(spyOn).toHaveBeenCalledWith(bfvContext, array)
  })
  test('It should fail to load from a string', () => {
    const plainText = seal.PlainText()
    const spyOn = jest.spyOn(plainText, 'load')
    expect(() =>
      plainText.load(
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
    const plainText = seal.PlainText()
    const spyOn = jest.spyOn(plainText, 'loadArray')
    expect(() =>
      plainText.loadArray(
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
          96,
          32,
          5,
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
          153,
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
        96,
        32,
        5,
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
        153,
        2,
        95
      ])
    )
  })
  test('It should copy another instance', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const newPlainText = seal.PlainText()
    const spyOn = jest.spyOn(newPlainText, 'copy')
    newPlainText.copy(plainText)
    expect(spyOn).toHaveBeenCalledWith(plainText)
    expect(newPlainText.save()).toEqual(plainText.save())
  })
  test('It should fail to copy another instance', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plain = batchEncoder.encode(arr) as PlainText
    const newPlain = seal.PlainText()
    plain.delete()
    const spyOn = jest.spyOn(newPlain, 'copy')
    expect(() => newPlain.copy(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
  test('It should clone itself', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const spyOn = jest.spyOn(plainText, 'clone')
    const newPlainText = plainText.clone()
    expect(spyOn).toHaveBeenCalledWith()
    expect(newPlainText).toBeDefined()
    expect(typeof newPlainText.constructor).toBe('function')
    expect(newPlainText).toBeInstanceOf(Object)
    expect(newPlainText.constructor).toBe(Object)
    expect(newPlainText.instance.constructor.name).toBe('Plaintext')
    expect(newPlainText.save()).toEqual(plainText.save())
  })
  test('It should fail to clone itself', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    plainText.delete()
    const spyOn = jest.spyOn(plainText, 'clone')
    expect(() => plainText.clone()).toThrow()
    expect(spyOn).toHaveBeenCalledWith()
  })
  test('It should move another instance into itself and delete the old', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const str = plainText.save()
    const newPlainText = seal.PlainText()
    const spyOn = jest.spyOn(newPlainText, 'move')
    newPlainText.move(plainText)
    expect(spyOn).toHaveBeenCalledWith(plainText)
    expect(plainText.instance).toBeUndefined()
    expect(() => plainText.isZero).toThrow(TypeError)
    expect(newPlainText.save()).toEqual(str)
  })
  test('It should fail to move another instance into itself and delete the old', () => {
    const arr = Int32Array.from({ length: batchEncoder.slotCount }, _ => 5)
    const plainText = seal.PlainText()
    batchEncoder.encode(arr, plainText)
    const newPlainText = seal.PlainText()
    plainText.delete()
    const spyOn = jest.spyOn(newPlainText, 'move')
    expect(() => newPlainText.move(plainText)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plainText)
  })
})
