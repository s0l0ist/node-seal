import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { BatchEncoder } from '../../components'

let Morfix = null
let parms = null
let context = null
let encoder = null
let BatchEncoderObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  BatchEncoderObject = BatchEncoder(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  encoder = BatchEncoderObject(context)
})

describe('BatchEncoder', () => {
  test('It should be a factory', () => {
    expect(BatchEncoderObject).toBeDefined()
    expect(typeof BatchEncoderObject.constructor).toBe('function')
    expect(BatchEncoderObject).toBeInstanceOf(Object)
    expect(BatchEncoderObject.constructor).toBe(Function)
    expect(BatchEncoderObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(BatchEncoderObject)
    Constructor(context)
    expect(Constructor).toBeCalledWith(context)
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(BatchEncoderObject)
    expect(() => Constructor('fail')).toThrow()
    expect(Constructor).toBeCalledWith('fail')
  })
  test('It should have properties', () => {
    const item = BatchEncoderObject(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encode')
    expect(item).toHaveProperty('decode')
    expect(item).toHaveProperty('slotCount')
  })
  test('It should have an instance (bfv)', () => {
    const item = BatchEncoderObject(context)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = BatchEncoderObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.slotCount).toEqual(encoder.slotCount)
  })
  test('It should delete the old instance and inject', () => {
    const item = BatchEncoderObject(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.slotCount).toEqual(encoder.slotCount)
  })
  test("It should delete it's instance", () => {
    const item = BatchEncoderObject(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.slotCount).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = BatchEncoderObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.slotCount).toThrow(TypeError)
  })
  test('It should encode an int32 array to a plaintext destination', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encode')
    encoder.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode an int32 array and return a plaintext', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    )
    const spyOn = jest.spyOn(encoder, 'encode')
    const plain = encoder.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
    expect(typeof plain.constructor).toBe('function')
    expect(plain).toBeInstanceOf(Object)
    expect(plain.constructor).toBe(Object)
    expect(plain.instance.constructor.name).toBe('Plaintext')
  })
  test('It should encode a uint32 array to a plaintext destination', () => {
    const arr = Uint32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encode')
    encoder.encode(arr, plain)
    expect(spyOn).toHaveBeenCalledWith(arr, plain)
  })
  test('It should encode a uint32 array and return a plaintext', () => {
    const arr = Uint32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(encoder, 'encode')
    const plain = encoder.encode(arr)
    expect(spyOn).toHaveBeenCalledWith(arr)
    expect(plain).toBeDefined()
    expect(typeof plain.constructor).toBe('function')
    expect(plain).toBeInstanceOf(Object)
    expect(plain.constructor).toBe(Object)
    expect(plain.instance.constructor.name).toBe('Plaintext')
  })
  test('It should fail on unsupported array type', () => {
    const arr = Float64Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(encoder, 'encode')
    expect(() => encoder.encode(arr)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr)
  })
  test('It should fail on encoding bad data', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount * 2 }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(encoder, 'encode')
    expect(() => encoder.encode(arr)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr)
  })
  test('It should decode an int32 array', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => -i)
    )
    const plain = Morfix.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(encoder, 'decode')
    const decoded = encoder.decode(plain, true)
    expect(spyOn).toHaveBeenCalledWith(plain, true)
    expect(decoded).toEqual(arr)
  })
  test('It should decode an uint32 array', () => {
    const arr = Uint32Array.from(
      Array.from({ length: encoder.slotCount }).map((x, i) => i)
    )
    const plain = Morfix.PlainText()
    encoder.encode(arr, plain)
    const spyOn = jest.spyOn(encoder, 'decode')
    const decoded = encoder.decode(plain, false)
    expect(spyOn).toHaveBeenCalledWith(plain, false)
    expect(decoded).toEqual(arr)
  })
  test('It should fail to decode', () => {
    const arr = Int32Array.from(
      Array.from({ length: encoder.slotCount * 2 }).map((x, i) => i)
    )
    const spyOn = jest.spyOn(encoder, 'decode')
    expect(() => encoder.decode(arr, false)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(arr, false)
  })
})
