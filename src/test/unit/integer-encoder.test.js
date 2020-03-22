import { Seal } from '../../index.js'
import { getLibrary } from '../../index'
import { IntegerEncoder } from '../../components'

let Morfix = null
let parms = null
let context = null
let encoder = null
let IntegerEncoderObject = null
beforeAll(async () => {
  Morfix = await Seal
  const lib = getLibrary()
  IntegerEncoderObject = IntegerEncoder(lib)(Morfix)

  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  encoder = IntegerEncoderObject(context)
})

describe('IntegerEncoder', () => {
  test('It should be a factory', () => {
    expect(IntegerEncoderObject).toBeDefined()
    expect(typeof IntegerEncoderObject.constructor).toBe('function')
    expect(IntegerEncoderObject).toBeInstanceOf(Object)
    expect(IntegerEncoderObject.constructor).toBe(Function)
    expect(IntegerEncoderObject.constructor.name).toBe('Function')
  })
  test('It should construct an instance', () => {
    const Constructor = jest.fn(IntegerEncoderObject)
    Constructor(context)
    expect(Constructor).toBeCalledWith(context)
  })
  test('It should fail to construct an instance', () => {
    const Constructor = jest.fn(IntegerEncoderObject)
    expect(() => Constructor('fail')).toThrow()
    expect(Constructor).toBeCalledWith('fail')
  })
  test('It should have properties', () => {
    const item = IntegerEncoderObject(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encodeInt32')
    expect(item).toHaveProperty('encodeUInt32')
    expect(item).toHaveProperty('decodeInt32')
    expect(item).toHaveProperty('decodeUInt32')
  })
  test('It should have an instance', () => {
    const item = IntegerEncoderObject(context)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = IntegerEncoderObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.slotCount).toEqual(encoder.slotCount)
  })
  test('It should delete the old instance and inject', () => {
    const item = IntegerEncoderObject(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.slotCount).toEqual(encoder.slotCount)
  })
  test("It should delete it's instance", () => {
    const item = IntegerEncoderObject(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.encodeInt32(4)).toThrow(TypeError)
  })
  test('It should skip deleting twice', () => {
    const item = IntegerEncoderObject(context)
    item.delete()
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
  })
  test('It should encode an int32 to a plaintext destination', () => {
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeInt32')
    encoder.encodeInt32(-5, plain)
    expect(spyOn).toHaveBeenCalledWith(-5, plain)
    const decoded = encoder.decodeInt32(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should encode an int32 and return a plaintext', () => {
    const spyOn = jest.spyOn(encoder, 'encodeInt32')
    const plain = encoder.encodeInt32(-5)
    expect(spyOn).toHaveBeenCalledWith(-5)
    const decoded = encoder.decodeInt32(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should fail to encode an int32', () => {
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeInt32')
    expect(() => encoder.encodeInt32(Math.MAX_SAFE_INTEGER, plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(Math.MAX_SAFE_INTEGER, plain)
  })

  test('It should encode a uint32 to a plaintext destination', () => {
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeUInt32')
    encoder.encodeUInt32(5, plain)
    expect(spyOn).toHaveBeenCalledWith(5, plain)
    const decoded = encoder.decodeUInt32(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should encode a uint32 and return a plaintext', () => {
    const spyOn = jest.spyOn(encoder, 'encodeUInt32')
    const plain = encoder.encodeUInt32(5)
    expect(spyOn).toHaveBeenCalledWith(5)
    const decoded = encoder.decodeUInt32(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should fail to encode a uint32', () => {
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeUInt32')
    expect(() => encoder.encodeUInt32(Math.MAX_SAFE_INTEGER, plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(Math.MAX_SAFE_INTEGER, plain)
  })

  test('It should decode an int32', () => {
    const plain = Morfix.PlainText()
    encoder.encodeInt32(-5, plain)
    const spyOn = jest.spyOn(encoder, 'decodeInt32')
    const decoded = encoder.decodeInt32(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should fail to decode an int32', () => {
    const plain = Morfix.PlainText()
    encoder.encodeUInt32(4294967295, plain)
    const spyOn = jest.spyOn(encoder, 'decodeInt32')
    expect(() => encoder.decodeInt32(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
  test('It should decode a uint32', () => {
    const plain = Morfix.PlainText()
    encoder.encodeUInt32(5, plain)
    const spyOn = jest.spyOn(encoder, 'decodeUInt32')
    const decoded = encoder.decodeUInt32(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(typeof decoded).toBe('number')
  })
  test('It should fail to decode a uint32', () => {
    const plain = Morfix.PlainText()
    encoder.encodeInt32(-5, plain)
    const spyOn = jest.spyOn(encoder, 'decodeUInt32')
    expect(() => encoder.decodeUInt32(plain)).toThrow()
    expect(spyOn).toHaveBeenCalledWith(plain)
  })
})
