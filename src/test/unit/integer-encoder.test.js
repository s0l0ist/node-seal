import { Seal } from '../../index.js'

let Morfix = null
let parms = null
let context = null
let encoder = null

beforeAll(async () => {
  Morfix = await Seal
  parms = Morfix.EncryptionParameters(Morfix.SchemeType.BFV)
  parms.setPolyModulusDegree(4096)
  parms.setCoeffModulus(
    Morfix.CoeffModulus.BFVDefault(4096, Morfix.SecurityLevel.tc128)
  )
  parms.setPlainModulus(Morfix.PlainModulus.Batching(4096, 20))
  context = Morfix.Context(parms, true, Morfix.SecurityLevel.tc128)
  encoder = Morfix.IntegerEncoder(context)
})

describe('IntegerEncoder', () => {
  test('It should be a factory', () => {
    expect(Morfix).toHaveProperty('IntegerEncoder')
    expect(Morfix.IntegerEncoder).not.toBeUndefined()
    expect(typeof Morfix.IntegerEncoder.constructor).toBe('function')
    expect(Morfix.IntegerEncoder).toBeInstanceOf(Object)
    expect(Morfix.IntegerEncoder.constructor).toBe(Function)
    expect(Morfix.IntegerEncoder.constructor.name).toBe('Function')
  })
  test('It should have properties', () => {
    const item = Morfix.IntegerEncoder(context)
    // Test properties
    expect(item).toHaveProperty('instance')
    expect(item).toHaveProperty('unsafeInject')
    expect(item).toHaveProperty('delete')
    expect(item).toHaveProperty('encodeInt32')
    expect(item).toHaveProperty('encodeUInt32')
    expect(item).toHaveProperty('decodeInt32')
    expect(item).toHaveProperty('decodeUInt32')
  })
  test('It should have an instance (bfv)', () => {
    const item = Morfix.IntegerEncoder(context)
    expect(item.instance).not.toBeFalsy()
  })
  test('It should inject', () => {
    const item = Morfix.IntegerEncoder(context)
    const spyOn = jest.spyOn(item, 'unsafeInject')
    item.unsafeInject(encoder.instance)
    expect(spyOn).toHaveBeenCalledWith(encoder.instance)
    expect(item.slotCount).toEqual(encoder.slotCount)
  })
  test("It should delete it's instance", () => {
    const item = Morfix.IntegerEncoder(context)
    const spyOn = jest.spyOn(item, 'delete')
    item.delete()
    expect(spyOn).toHaveBeenCalled()
    expect(item.instance).toBeNull()
    expect(() => item.encodeInt32(4)).toThrow(TypeError)
  })
  test('It should encode an int32', () => {
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeInt32')
    encoder.encodeInt32(-5, plain)
    expect(spyOn).toHaveBeenCalledWith(-5, plain)
    const decoded = encoder.decodeInt32(plain)
    expect(decoded).toEqual(-5)
  })
  test('It should encode a uint32', () => {
    const plain = Morfix.PlainText()
    const spyOn = jest.spyOn(encoder, 'encodeUInt32')
    encoder.encodeUInt32(5, plain)
    expect(spyOn).toHaveBeenCalledWith(5, plain)
    const decoded = encoder.decodeUInt32(plain)
    expect(decoded).toEqual(5)
  })
  test('It should decode an int32', () => {
    const plain = Morfix.PlainText()
    encoder.encodeInt32(-5, plain)
    const spyOn = jest.spyOn(encoder, 'decodeInt32')
    const decoded = encoder.decodeInt32(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(decoded).toEqual(-5)
  })
  test('It should decode a uint32', () => {
    const plain = Morfix.PlainText()
    encoder.encodeUInt32(5, plain)
    const spyOn = jest.spyOn(encoder, 'decodeUInt32')
    const decoded = encoder.decodeUInt32(plain)
    expect(spyOn).toHaveBeenCalledWith(plain)
    expect(decoded).toEqual(5)
  })
})
